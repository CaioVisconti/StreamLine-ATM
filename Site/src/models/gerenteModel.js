const e = require("express");
const database = require("../database/config");
const axios = require('axios');
const moment = require('moment');

// Dashboard

function historico(idAgencia) {

  let instrucaoSql = ` select atm.Hostname as "ATM", 
                            a.componente as "Componente", 
                            a.valor as "Valor", 
                            a.categoria as "Tipo", 
                            a.dtHoraAbertura as "DataHora"
                            from alerta as a
                            join parametro as p
                            on p.idParametro = a.fkParametro
                            join atm as atm 
                            on p.fkAtm = atm.idAtm
                            where atm.fkAgencia = ${idAgencia}
                            and DATE(a.dtHoraAbertura) = curdate()
                            order by a.dtHoraAbertura desc
                            limit 10;`

  return database.executar(instrucaoSql);
}

function mostrarCountTotal(idAgencia) { // Contagem total de alertas

  let instrucaoSql = ` select count(a.idalerta) as total
                        from alerta as a
                            join parametro as p
                            on a.fkParametro = p.idParametro
                            join atm on atm.idAtm = p.fkAtm
                            where date(a.dtHoraAbertura) = curdate() 
                            and fkAgencia =  ${idAgencia};`

  return database.executar(instrucaoSql);
}

function mostrarCount(idAgencia) { //Contagem atual ate 10

  let instrucaoSql = `SELECT COUNT(*) AS total
                      FROM (
                          SELECT a.idalerta
                          FROM alerta AS a
                          JOIN parametro AS p ON a.fkParametro = p.idParametro
                          JOIN atm ON atm.idAtm = p.fkAtm
                          WHERE DATE(a.dtHoraAbertura) = CURDATE()
                            AND fkAgencia = ${idAgencia}
                          LIMIT 10
                      ) AS sub;`

  return database.executar(instrucaoSql);
}


function buscarKpiCriticos(idAgencia) { // Traz todos os alertas criticos 

  let instrucaoSql = `select count(idAlerta) as totalCriticos from alerta as a
                        join parametrizacao as p
                        on a.fkParametro = p.idParametro
                        join atm as atm
                        on atm.idAtm = p.fkAtm
                        where categoria = "High" 
                        and date(dtHoraAbertura) = curdate() 
                        and fkAgencia = ${idAgencia};`

  return database.executar(instrucaoSql);
}

function buscarKpiPercentual(idAgencia) { // Traz o percentual de quantos atms estao sem alertas

  let instrucaoSql = `SELECT
                            CONCAT(
                                ROUND(
                                    (COUNT(distinct atm.idAtm)
                                    - COUNT(distinct case when a.categoria in ('High', 'Medium') THEN atm.idAtm END)       
                                ) * 100
                                / COUNT(distinct atm.idAtm)
                            , 2)
                            , '%') as percentualBons
                        from atm
                        LEFT JOIN parametrizacao p
                            ON p.fkAtm = atm.idAtm
                        LEFT JOIN alerta a
                            ON a.fkParametro = p.idParametro
                                AND DATE(A.dtHoraAbertura) = CURDATE()
                        WHERE atm.fkAgencia = ${idAgencia};`

  return database.executar(instrucaoSql);
}

function buscarGraficoTop5(idAgencia) { // Ranking dos 5 atms que mais tiveram alertas

  let instrucaoSql = `SELECT
                            COUNT(a.idAlerta) AS qtdAlertas,
                            CONCAT("ATM ", idAtm) as atm
                        FROM alerta as a
                        LEFT JOIN parametrizacao AS p
                            ON a.fkParametro = p.idParametro
                        LEFT JOIN atm AS atm
                            ON p.fkAtm = atm.idAtm
                        WHERE
                            atm.fkAgencia = ${idAgencia}
                            AND DATE(a.dtHoraAbertura)
                                BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                                    AND CURDATE()
                            AND categoria in ("High", "Medium")
                        GROUP BY
                        atm
                        ORDER BY
                            qtdAlertas desc
                        LIMIT 5;`

  return database.executar(instrucaoSql);
}

function buscarGraficoSituacao(idAgencia) { // Grafico de quantos atms estão em certa situação

  let instrucaoSql = `SELECT
                          classificacao.situacao,
                          COUNT(*) AS total_atms,
                          classificacao.dia
                      FROM (
                          SELECT
                              base.idAtm,
                              base.dia,
                              CASE
                                  WHEN MAX(CASE WHEN a.categoria = 'High' THEN 1 ELSE 0 END) = 1 THEN 'Crítico'
                                  WHEN MAX(CASE WHEN a.categoria = 'Medium' THEN 1 ELSE 0 END) = 1 THEN 'Médio'
                                  ELSE 'Bom'
                              END AS situacao
                          FROM
                              (
                                  SELECT DISTINCT
                                      atm.idAtm,
                                      DATE(c.dtHora) AS dia,
                                      p.idParametro 
                                  FROM
                                      atm
                                  JOIN parametro p ON atm.idAtm = p.fkAtm
                                  JOIN captura c ON p.idParametro = c.fkParametro
                                  WHERE
                                      atm.fkAgencia = ${idAgencia} 
                                      AND DATE(c.dtHora) BETWEEN CURDATE() - INTERVAL 6 DAY AND CURDATE()
                              ) AS base
                          LEFT JOIN
                              alerta a ON base.idParametro = a.fkParametro AND DATE(a.dtHoraAbertura) = base.dia
                          GROUP BY
                              base.idAtm, base.dia
                      ) AS classificacao
                      GROUP BY
                          classificacao.situacao, classificacao.dia
                      ORDER BY
                          classificacao.dia, classificacao.situacao;
                      `

  return database.executar(instrucaoSql);
}

//JIRA
// Carrega configuração do Jira a partir das variáveis de ambiente
const JIRA_CONFIG = {
  baseURL: process.env.JIRA_BASE_URL,
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  projectKey: process.env.JIRA_PROJECT_KEY
};

/** Retorna headers Authorization para chamar a API do Jira */
function obterHeadersJira() {
  try {
    const auth = Buffer
      .from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.apiToken}`)
      .toString('base64');
    return {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error("Erro ao criar headers:", error);
    throw error;
  }
}

function buscarIssuesJira(startDate, endDate, maxResultsTotalDesejado = 1000) {
  return new Promise(async (resolve, reject) => {
    let todasAsIssuesColetadas = []
    let startAt = 0
    const maxResultsPorPaginaJira = 100
    let totalDeIssuesDisponiveisNaQuery
    let continuarBuscando = true

    const jql = `
        project = "${JIRA_CONFIG.projectKey}"
        AND status = "Completed" 
        AND resolutiondate >= "${startDate}" 
        AND resolutiondate < "${endDate}"
        ORDER BY resolutiondate ASC
    `

    const baseUrl = JIRA_CONFIG.baseURL
    const url = `${baseUrl}/rest/api/3/search`;
    const headers = obterHeadersJira();

    try {
      while (continuarBuscando) {

        const params = {
          jql: jql,
          startAt: startAt,
          maxResults: maxResultsPorPaginaJira,
          fields: 'key,summary,status,created,resolutiondate,changelog',
          expand: 'changelog' 
        };

        const response = await axios.get(url, {
          headers: headers,
          params: params,
          timeout: 30000
        });

        if (response.data && response.data.issues) {
          todasAsIssuesColetadas = todasAsIssuesColetadas.concat(response.data.issues);

          if (totalDeIssuesDisponiveisNaQuery == undefined) {
            totalDeIssuesDisponiveisNaQuery = response.data.total;
          }

          if (todasAsIssuesColetadas.length >= totalDeIssuesDisponiveisNaQuery ||
            response.data.issues.length === 0 ||
            todasAsIssuesColetadas.length >= maxResultsTotalDesejado) {
            continuarBuscando = false;
          } else {
            startAt += response.data.issues.length;
          }
        } else {
          console.warn("Resposta da API do Jira sem 'issues' ou 'data'. Interrompendo paginação.");
          continuarBuscando = false;
        }
      }

      resolve({
        issues: todasAsIssuesColetadas,
        total: totalDeIssuesDisponiveisNaQuery || todasAsIssuesColetadas.length, // O total que a JQL realmente encontrou
        startAt: 0,
        maxResults: todasAsIssuesColetadas.length // O número total de issues efetivamente retornadas
      });

    } catch (error) {
      console.error("ERRO DETALHADO em MODEL buscarIssuesJira durante paginação:", error.message);
    }
  });
}

function calcularTempoResolucao(issue) {

  try {
    const dtCriacao = moment(issue.fields.created);
    const dtResolucao = moment(issue.fields.resolutiondate);

    const dif = dtResolucao.diff(dtCriacao, 'hours', true);

    const resultadoFinal = Math.round(dif * 10) / 10;

    return resultadoFinal;

  } catch (error) {
    console.error(`[${issue.key}] Erro GERAL ao calcular tempo de resolução:`, error);
    return null;
  }
}


function agruparDadosPorDia(issues) {

  try {

    const dadosAgrupados = {};

    issues.forEach(issue => {
      const tempoDeResolucao = calcularTempoResolucao(issue);
      if (tempoDeResolucao !== null) {
        const keyDataResolucao = moment(issue.fields.resolutiondate).format('YYYY-MM-DD');
        if (!dadosAgrupados[keyDataResolucao]) {
          dadosAgrupados[keyDataResolucao] = {
            cont: 0,
            tempoTotal: 0
          };
        }
        dadosAgrupados[keyDataResolucao].cont++;
        dadosAgrupados[keyDataResolucao].tempoTotal += tempoDeResolucao;
      }
      else {
        console.log("dei erro antes do for each")
      }
    });

    const result = {
      labels: [],
      ticketCounts: [],
      avgResolutionTimes: []
    };

    Object.keys(dadosAgrupados).sort((a, b) => moment(a, 'YYYY-MM-DD').diff(moment(b, 'YYYY-MM-DD')))
      .forEach(dateKey => {
        const info = dadosAgrupados[dateKey];
        const avgTime = info.tempoTotal / info.cont;
        result.labels.push(dateKey);
        result.ticketCounts.push(info.cont);
        result.avgResolutionTimes.push(Math.round(avgTime * 10) / 10);
      });

    return result;
  } catch (error) {
    console.error("Erro em agruparDadosPorDia:", error);
    return {
      labels: [],
      ticketCounts: [],
      avgResolutionTimes: []
    };
  }
}

function calcularEstatisticasJira(issues) {
  try {

    let somaDosTemposDeResolucaoEmHoras = 0;
    let contagemDeTemposValidos = 0;

    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i];
      const tempoEmHoras = calcularTempoResolucao(issue);

      // Verifica se o tempo é um número válido (não null, não NaN)
      if (tempoEmHoras !== null && !isNaN(tempoEmHoras)) {
        somaDosTemposDeResolucaoEmHoras += tempoEmHoras;
        contagemDeTemposValidos++;
      }
    }

    // Se não houver tempos válidos, retorna o padrão
    if (contagemDeTemposValidos == 0) {
      return {
        avgResolution: "0min",
        avgResolutionInHours: 0
      };
    }

    // Calcula a média do tempo de resolução em horas
    const mediaTempoEmHoras = somaDosTemposDeResolucaoEmHoras / contagemDeTemposValidos;

    let mediaFormatada;

    // Formata a média para exibição (s, min, ou h)
    if (mediaTempoEmHoras < 0.01 && mediaTempoEmHoras > 0) { // Para tempos em segundos
      const mediaEmSegundos = mediaTempoEmHoras * 3600;
      mediaFormatada = `${Math.round(mediaEmSegundos)}s`;
    } else if (mediaTempoEmHoras < 1) { // Menos de 1 hora
      const mediaEmMinutos = mediaTempoEmHoras * 60;
      mediaFormatada = `${Math.round(mediaEmMinutos)}min`;
    } else { // 1 hora ou mais
      const horasArredondadas = (Math.round(mediaTempoEmHoras * 10) / 10).toFixed(1);
      mediaFormatada = `${horasArredondadas}h`;
    }

    const estatisticasParaRetornar = {
      avgResolution: mediaFormatada,
      avgResolutionInHours: mediaTempoEmHoras
    };

    return estatisticasParaRetornar;

  } catch (error) {
    console.error("Erro em MODEL calcularEstatisticasJira:", error);
    return {
      avgResolution: "Erro",
      avgResolutionInHours: null
    };
  }
}

function buscarIssuesPendentesTabela() {
  return new Promise(async (resolve, reject) => {
    try {
      const dataSeteDiasAtras = moment().subtract(7, 'days').format('YYYY-MM-DD');
      const jql = `
        project = "${JIRA_CONFIG.projectKey}"
        AND statusCategory != "Done"
        AND created >= "${dataSeteDiasAtras}"
        ORDER BY priority DESC, created ASC
      `;

      const baseUrl = JIRA_CONFIG.baseURL.endsWith('/')
        ? JIRA_CONFIG.baseURL.slice(0, -1)
        : JIRA_CONFIG.baseURL;
      const url = `${baseUrl}/rest/api/3/search`;

      const headers = obterHeadersJira();

      const params = {
        jql: jql,
        fields: 'summary,priority,created,key,status',
        maxResults: 100
      };

      const response = await axios.get(url, {
        headers: headers,
        params: params,
        timeout: 30000
      });

      resolve(response.data.issues || []); // Retorna a lista de issues

    } catch (error) {
      console.error("Erro detalhado em MODEL buscarIssuesPendentes:");
      reject(error);
    }
  });
}

// Outros

function buscarKpiTotal(idAgencia) {

  let instrucaoSql = `SELECT COUNT(atm.fkAgencia) AS total FROM atm JOIN agencia AS a ON atm.fkAgencia = a.idAgencia WHERE idAgencia = ${idAgencia} GROUP BY a.idAgencia;`

  return database.executar(instrucaoSql);
}

function buscarKpiAlerta(idAgencia) {

  let instrucaoSql = `SELECT COUNT(al.fkParametro) AS alertas FROM atm JOIN agencia AS a ON atm.fkAgencia = a.idAgencia JOIN parametro AS p ON atm.idAtm = p.fkAtm JOIN alerta AS al ON al.fkParametro = p.idParametro WHERE idAgencia = ${idAgencia} GROUP BY a.idAgencia;`

  return database.executar(instrucaoSql);
}

function carregarCards(idAgencia) {

  let instrucaoSql = `SELECT atm.* FROM agencia AS ag JOIN atm ON ag.idAgencia = atm.fkAgencia WHERE fkAgencia = ${idAgencia};`;

  return database.executar(instrucaoSql);
}

function search(escrito, idAgencia) {

  let instrucaoSql = `SELECT atm.* FROM agencia AS ag JOIN atm ON ag.idAgencia = atm.fkAgencia WHERE fkAgencia = ${idAgencia} AND hostname LIKE "%${escrito}%" ORDER BY hostname ASC;`;

  return database.executar(instrucaoSql);
}

function buscarModelos(id) {

  let instrucaoSql = `SELECT DISTINCT modelo AS modelo FROM atm WHERE fkAgencia = ${id};`;

  return database.executar(instrucaoSql);
}

function buscarSO(id) {

  let instrucaoSql = `SELECT DISTINCT sistemaOperacional AS so FROM atm WHERE fkAgencia = ${id};`;

  return database.executar(instrucaoSql);
}

function filtrar(primeiro, segundo, id) {
  let formato = "ASC"
  let instrucaoSql = ""

  if (!segundo.includes("%")) {
    if (segundo == "ativo") {
      segundo = 1;
    } else if (segundo == "desativo") {
      segundo = 0;
    }

    if (segundo == "filtro_ZA") {
      formato = "DESC"
    }
  } else {
    segundo.replace("%", " ")
  }

  if (primeiro == "statusATM") {
    instrucaoSql = `SELECT * FROM atm WHERE fkAgencia = ${id} AND ${primeiro} = ${segundo}`;
  } else if (primeiro == "hostname") {
    instrucaoSql = `SELECT * FROM atm WHERE fkAgencia = ${id} ORDER BY ${primeiro} ${formato}`;
  } else {
    instrucaoSql = `SELECT * FROM atm WHERE fkAgencia = ${id} AND ${primeiro} = "${segundo}" ORDER BY ${primeiro} ${formato};`;
  }

  return database.executar(instrucaoSql);
}

function procurarComponentes(idAtm) {

  let instrucaoSql = `SELECT tipo AS metrica, identificador FROM componentes AS c JOIN parametro AS p ON p.fkComponente = c.idComponentes WHERE p.fkAtm = ${idAtm};`;

  return database.executar(instrucaoSql);
}

function atualizar(listaAtm) {
  let hostname = listaAtm.hostname;
  let idAtm = listaAtm.idAtm;
  let ip = listaAtm.ip;
  let macAdress = listaAtm.macAdress;
  let modelo = listaAtm.modelo;
  let sistemaOperacional = listaAtm.sistemaOperacional;
  let status = listaAtm.statusATM;

  let instrucaoSql = `UPDATE atm SET hostname = "${hostname}", ip = "${ip}", macAdress = "${macAdress}", modelo = "${modelo}", sistemaOperacional = "${sistemaOperacional}", statusATM = ${status} WHERE idAtm = ${idAtm};`;

  return database.executar(instrucaoSql);
}

function cadastrarATM(modelo, hostname, ip, macdress, so, status, fkAgencia) {

  let instrucaoSql = `INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES ("${hostname}", "${modelo}", "${ip}", "${macdress}", "${so}", ${status}, ${fkAgencia});`;

  return database.executar(instrucaoSql);
}

function procurarConfiguracao(componente, idAtm) {

  let instrucaoSql = `SELECT limite AS Limite, unidadeMedida AS UM, idParametro, tipo AS Tipo FROM parametrizacao WHERE fkAtm = ${idAtm} AND tipo LIKE "%${componente}%";`;

  return database.executar(instrucaoSql);
}

function atualizarParametro(limite, id) {

  let instrucaoSql = `UPDATE parametro SET limite = ${limite} WHERE idParametro = ${id};`;

  return database.executar(instrucaoSql);
}

function procurarConfigDisponivel(componente) {

  let instrucaoSql = `SELECT tipo AS Tipo, idComponentes AS id FROM componentes WHERE tipo LIKE '%${componente}%';`;

  return database.executar(instrucaoSql);
}

function cadastrarConfig(limite, medida, idAtm) {

  let instrucaoSql = `INSERT INTO parametro (fkAtm, fkComponente, limite, dtAlteracao) VALUES (${idAtm}, ${medida}, ${limite}, now());`;

  return database.executar(instrucaoSql);
}

function removerAtm(id) {

  let instrucaoSql = `DELETE FROM atm WHERE idAtm = ${id};`;

  return database.executar(instrucaoSql);
}

function removerConfig(id) {

  let instrucaoSql = `DELETE FROM parametro WHERE idParametro = ${id};`;

  return database.executar(instrucaoSql);

}

function buscarKpiFuncionarios(id) {

  let instrucaoSql = `SELECT COUNT(idUsuario) AS qtd FROM usuario WHERE fkAgencia = ${id} AND cargo <> "Gerente"`;

  return database.executar(instrucaoSql);
}

function carregarCardsFuncionario(id) {

  let instrucaoSql = `SELECT * FROM usuario WHERE fkAgencia = ${id} AND cargo <> "Gerente"`;

  return database.executar(instrucaoSql);
}

function buscarCargo(id) {

  let instrucaoSql = `SELECT DISTINCT cargo FROM usuario WHERE fkAgencia = ${id} AND cargo <> "Gerente"`;

  return database.executar(instrucaoSql);
}

function buscarEmail(id) {

  let instrucaoSql = `SELECT email FROM usuario WHERE fkAgencia = ${id} AND cargo <> "Gerente"`;

  return database.executar(instrucaoSql);
}

function buscarTelefone(id) {

  let instrucaoSql = `SELECT telefone FROM usuario WHERE fkAgencia = ${id} AND cargo <> "Gerente"`;

  return database.executar(instrucaoSql);
}

function searchFuncionario(pesquisa, id) {

  let instrucaoSql = `SELECT * FROM usuario WHERE fkAgencia = ${id} AND nome LIKE "%${pesquisa}%" AND cargo <> "Gerente"`;

  return database.executar(instrucaoSql)
}

function filtrarFuncionario(primeiro, segundo, id) {
  let formato = "ASC";

  console.log(primeiro, segundo, id);

  if (segundo == "filtro_ZA") {
    formato = "DESC";
  }

  if (primeiro == "nome") {
    instrucaoSql = `SELECT * FROM usuario WHERE fkAgencia = ${id} AND cargo <> "Gerente" ORDER BY ${primeiro} ${formato};`;
  } else if (primeiro == "cargo") {
    instrucaoSql = `SELECT * FROM usuario WHERE fkAgencia = ${id} AND cargo <> "Gerente" AND cargo = "${segundo}" ORDER BY ${primeiro} ${formato};`;
  } else {
    instrucaoSql = `SELECT * FROM usuario WHERE fkAgencia = ${id} AND cargo <> "Gerente" AND ${primeiro} LIKE "%${segundo}%" ORDER BY ${primeiro} ${formato};`;
  }

  return database.executar(instrucaoSql);
}

function cadastrarFuncionario(nome, telefone, cargo, email, senha, idAgencia) {

  let instrucaoSql = `INSERT INTO usuario (nome, telefone, cargo, email, senha, fkAgencia) VALUES ("${nome}", "${telefone}", "${cargo}", "${email}", "${senha}", ${idAgencia});`;

  return database.executar(instrucaoSql);
}

function atualizarFuncionario(json) {

  let instrucaoSql = `UPDATE usuario SET nome = "${json.nome}", telefone = "${json.telefone}", cargo = "${json.cargo}", email = "${json.email}", senha = "${json.senha}" WHERE idUsuario = ${json.idUsuario}`;

  return database.executar(instrucaoSql);
}

function removerFuncionario(id) {

  let instrucaoSql = `DELETE FROM usuario WHERE idUsuario = ${id}`;

  return database.executar(instrucaoSql);
}

function listarAtmsPorAgencia(idAgencia) {
  let instrucaoSql = `select atm.idAtm from atm join agencia on agencia.idAgencia = atm.fkAgencia WHERE idAgencia = ${idAgencia};`
  return database.executar(instrucaoSql)
}

module.exports = {
  // Pagina da dashboard
  buscarKpiCriticos,
  buscarKpiPercentual,
  buscarGraficoTop5,
  buscarGraficoSituacao,
  historico,
  mostrarCountTotal,
  mostrarCount,
  listarAtmsPorAgencia,

  // Página de ATM
  buscarKpiTotal,
  buscarKpiAlerta,
  carregarCards,
  search,
  buscarModelos,
  buscarSO,
  filtrar,
  procurarComponentes,
  atualizar,
  cadastrarATM,
  procurarConfiguracao,
  atualizarParametro,
  procurarConfigDisponivel,
  cadastrarConfig,
  removerAtm,
  removerConfig,

  // Página de Funcionario
  buscarKpiFuncionarios,
  carregarCardsFuncionario,
  buscarCargo,
  buscarEmail,
  buscarTelefone,
  searchFuncionario,
  filtrarFuncionario,
  cadastrarFuncionario,
  atualizarFuncionario,
  removerFuncionario,

  //Jira
  calcularTempoResolucao,
  agruparDadosPorDia,
  calcularEstatisticasJira,
  buscarIssuesJira,
  buscarIssuesPendentesTabela
};