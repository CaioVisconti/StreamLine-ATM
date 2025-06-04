const gerenteModel = require("../models/gerenteModel");
const { get } = require("../routes/gerente");

// Baixar CSV

const { S3Client, ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const archiver = require("archiver");
const moment = require('moment');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
    },
});

async function downloadCSV(req, res) {
    const idAgencia = req.params.idAgencia;
    const bucketName = "trusted-streamline-atm";
    const prefix = "capturas/"; // base do caminho no bucket

    if (!idAgencia) {
        return res.status(400).json({ mensagem: "Parâmetro 'idAgencia' inválido." });
    }

    try {
        const resultadoAtms = await gerenteModel.listarAtmsPorAgencia(idAgencia);

        if (resultadoAtms.length == 0) {
            return res.status(404).json({ mensagem: "Nenhuma ATM encontrada para esta agência." });
        }

        var atmIds = [];
        for (var i = 0; i < resultadoAtms.length; i++) {
            atmIds.push(String(resultadoAtms[i].idAtm));
        }

        // Preparar resposta como arquivo ZIP
        res.setHeader("Content-Disposition", 'attachment; filename="arquivosATMS.zip"');
        res.setHeader("Content-Type", "application/zip");

        var archive = archiver("zip", { zlib: { level: 9 } });
        archive.on("error", function (err) {
            console.error("Erro ao criar ZIP:", err);
            res.status(500).send("Erro ao gerar o arquivo compactado.");
        });

        archive.pipe(res); // Funcao do archiver que pega a Response e zipa, primeiro zipa e depois envia em pipe

        // Para cada ATM, buscar arquivos
        for (var j = 0; j < atmIds.length; j++) {
            const atmId = atmIds[j];
            const atmPrefix = prefix + "ATM" + atmId + "/";

            const listResp = await s3.send(new ListObjectsV2Command({
                Bucket: bucketName,
                Prefix: atmPrefix
            }));

            const objetos = listResp.Contents || [];

            if (objetos.length == 0) {
                continue
            }

            let arquivoMaisRecente = objetos[0];

            for (var k = 1; k < objetos.length; k++) {
                if (objetos[k].LastModified > arquivoMaisRecente.LastModified) {
                    arquivoMaisRecente = objetos[k];
                }
            }

            const getResp = await s3.send(new GetObjectCommand({
                Bucket: bucketName,
                Key: arquivoMaisRecente.Key
            }));

            const partes = arquivoMaisRecente.Key.split("/");
            const nomeZip = partes[partes.length - 1];

            archive.append(getResp.Body, { name: nomeZip });
        }

        await archive.finalize();
    }
    catch (e) {
        console.error("Erro ao acessar S3 ou gerar ZIP:", e);
        if (!res.headersSent) {
            res.status(500).send("Erro ao baixar arquivos.");
        }
    }
}

// Kpis, gráficos e historico

function historico(req, res) {
    let idAgencia = req.params.idAgencia;

    gerenteModel.historico(idAgencia)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch((erro) => {
            console.error("Erro na captura de historico:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function mostrarCountTotal(req, res) {
    let idAgencia = req.params.idAgencia;

    gerenteModel.mostrarCountTotal(idAgencia)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch((erro) => {
            console.error("Erro na captura de mostrarCount:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function mostrarCount(req, res) {
    let idAgencia = req.params.idAgencia;

    gerenteModel.mostrarCount(idAgencia)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch((erro) => {
            console.error("Erro na captura de mostrarCount:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarKpiCriticos(req, res) {
    let idAgencia = req.params.idAgencia;

    gerenteModel.buscarKpiCriticos(idAgencia)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch((erro) => {
            console.error("Erro na captura da kpi de total criticos:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarKpiPercentual(req, res) {
    let idAgencia = req.params.idAgencia;

    gerenteModel.buscarKpiPercentual(idAgencia)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch((erro) => {
            console.error("Erro na captura da kpi de percentual:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarGraficoTop5(req, res) {
    let idAgencia = req.params.idAgencia;

    gerenteModel.buscarGraficoTop5(idAgencia)
        .then((resultado) => {
            if (resultado.length > 0) {
                console.log("resultado: " + resultado)
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch((erro) => {
            console.error("Erro na captura do top 5:", erro);
            console.error("Erro completo:", JSON.stringify(erro));
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarGraficoSituacao(req, res) {
    let idAgencia = req.params.idAgencia;

    gerenteModel.buscarGraficoSituacao(idAgencia)
        .then((resultado) => {
            if (resultado.length > 0) {
                console.log("situ")
                console.log(resultado)
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch((erro) => {
            console.error("Erro na captura do grafico de situacao:", erro);
            console.error("Erro completo:", JSON.stringify(erro));
            res.status(500).json(erro.sqlMessage);
        });
}

// Jira

async function buscarDadosJira(req, res) {
    try {
        // Define startDate e endDate para sempre cobrir os últimos 7 dias (incluindo hoje)
        const endDate = moment().add(1, 'day').format('YYYY-MM-DD'); // Data de hoje
        const startDate = moment().subtract(6, 'days').format('YYYY-MM-DD'); // 6 dias atrás (totalizando 7 dias com hoje)

        // 1. Busca as issues resolvidas no Jira
        const jiraApiResponse = await gerenteModel.buscarIssuesJira(startDate, endDate);
        const issues = jiraApiResponse.issues || [];
        // 2. Agrupa por dia de resolução
        const chartData = gerenteModel.agruparDadosPorDia(issues);
        // 3. Calcula estatísticas gerais
        const stats = gerenteModel.calcularEstatisticasJira(issues);

        const resultadoFinal = {
            success: true,
            message: "Dados do Jira (últimos 7 dias) processados com sucesso.",
            data: {
                startDate,
                endDate,
                chartData,
                stats
            }
        };
        res.json(resultadoFinal);

    } catch (error) {
        console.error("ERRO no CONTROLLER em buscarDadosJira (últimos 7 dias):", error);
    }
}

function formatarDuracaoPendenteTabela(createdDateString) {
    if (!createdDateString) return "N/A";
    const createdDate = moment(createdDateString);
    const now = moment();
    const duration = moment.duration(now.diff(createdDate));
    const days = Math.floor(duration.asDays());
    const hours = duration.hours(); // Retorna a parte das horas (0-23)
    const minutes = duration.minutes(); // Retorna a parte dos minutos (0-59)
    const seconds = duration.seconds(); // Retorna a parte dos segundos (0-59)

    if (days > 0) {
        let string = `${days}d`;
        if (hours > 0) {
            string += ` ${hours}h`;
        }
        return string;
    } else if (hours > 0) {
        return `${hours}h ${String(minutes).padStart(2, '0')}m`; // Ex: "15h 30m"
    } else if (minutes > 0) {
        return `${minutes}min`;
    } else {
        return `${seconds}s`;
    }

}

async function listarAlertasPendentesTabela(req, res) {
    try {
        const issuesPendentes = await gerenteModel.buscarIssuesPendentesTabela();
        const baseUrl = process.env.JIRA_BASE_URL;

        const tabelaDeAlertas = []; // Array para armazenar os resultados formatados

        for (let i = 0; i < issuesPendentes.length; i++) {
            const issue = issuesPendentes[i];

            const summary = issue.fields.summary || "";
            let atm = "N/A";
            let problema = summary;

            // Recortar nome do card para separar na coluna ATM e na coluna PROBLEMA
            const delimiterIndex = summary.indexOf(" - ");
            if (delimiterIndex !== -1) {
                atm = summary.substring(0, delimiterIndex).trim();
                problema = summary.substring(delimiterIndex + 3).trim();
            }

            const prioridadeOriginal = issue.fields.priority ? issue.fields.priority.name : "N/A";
            let prioridadeTraduzida;

            if (prioridadeOriginal == "High") {
                prioridadeTraduzida = "Crítico";
            } else if (prioridadeOriginal == "Medium") {
                prioridadeTraduzida = "Médio";
            } else {
                prioridadeTraduzida = prioridadeOriginal;
            }

            const itemFormatado = {
                atm: atm,
                problema: problema,
                tipo: prioridadeTraduzida,
                duracao: formatarDuracaoPendenteTabela(issue.fields.created),
                link: `${baseUrl}/browse/${issue.key}`,
                key: issue.key
            };

            tabelaDeAlertas.push(itemFormatado); // Adiciona o item formatado ao array
        }

        res.json({
            success: true,
            message: "Alertas pendentes buscados com sucesso.",
            data: tabelaDeAlertas
        });

    } catch (error) {
        console.error("ERRO no CONTROLLER em listarAlertasPendentesTabela:", error);
    }
}

// Outros

function buscarKpiTotal(req, res) {
    let idAgencia = req.params.idAgencia;

    gerenteModel.buscarKpiTotal(idAgencia)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura da kpi total:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarKpiAlerta(req, res) {
    let idAgencia = req.params.idAgencia;

    gerenteModel.buscarKpiAlerta(idAgencia)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura da kpi de alerta:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function carregarCards(req, res) {

    let idAgencia = req.params.idAgencia;

    gerenteModel.carregarCards(idAgencia)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function search(req, res) {

    let escrito = req.params.escrito;
    let idAgencia = req.params.idAgencia;

    gerenteModel.search(escrito, idAgencia)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarModelos(req, res) {
    const id = req.params.idAgencia;

    gerenteModel.buscarModelos(id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de modelos:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarSO(req, res) {
    const id = req.params.idAgencia;

    gerenteModel.buscarSO(id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de sistemas operacionais:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarAtmsPorAgencia(req, res) {
    const idAgencia = req.params.idAgencia;
    gerenteModel.listarAtmsPorAgencia(idAgencia)
        .then(resultado => {
            res.status(200).json(resultado);
        })
        .catch(erro => {
            console.error("Erro ao buscar ATMs por agência:", erro);
            res.status(500).json({
                mensagem: "Erro ao consultar ATMs da agência.",
                erro: erro.sqlMessage || erro
            });
        });
}

function filtrar(req, res) {
    const primeiro = req.params.selecionado;
    const segundo = req.params.opcao;
    const id = req.params.idAgencia;

    gerenteModel.filtrar(primeiro, segundo, id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na filtragem:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function procurarComponentes(req, res) {
    let idAtm = req.params.idAtm;

    gerenteModel.procurarComponentes(idAtm)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de sistemas operacionais:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizar(req, res) {
    const json = req.body.lista;

    gerenteModel.atualizar(json)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrarATM(req, res) {
    const modelo = req.body.modeloServer;
    const hostname = req.body.hostnameServer;
    const ip = req.body.ipServer;
    const macdress = req.body.macadressServer;
    const so = req.body.soServer;
    const status = req.body.statusServer;
    const fkAgencia = req.body.fkAgenciaServer;

    gerenteModel.cadastrarATM(modelo, hostname, ip, macdress, so, status, fkAgencia)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function pesquisarConfiguracao(req, res) {
    let componente = req.params.componenteAtual;
    let idAtm = req.params.idAtm;

    gerenteModel.procurarConfiguracao(componente, idAtm)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarParametro(req, res) {
    let limite = req.params.limiteAtual;
    let id = req.params.idConfig;

    gerenteModel.atualizarParametro(limite, id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function procurarConfigDisponivel(req, res) {
    let componente = req.params.comp;
    console.log(componente);

    gerenteModel.procurarConfigDisponivel(componente)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrarConfig(req, res) {
    let limite = req.body.limiteServer;
    let medida = req.body.medidaServer;
    let idAtm = req.body.idAtmServer;

    gerenteModel.cadastrarConfig(limite, medida, idAtm)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro no cadastro de configuração:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function removerAtm(req, res) {
    let id = req.params.idAtm;

    gerenteModel.removerAtm(id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function removerConfig(req, res) {
    let id = req.params.id;

    gerenteModel.removerConfig(id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

// Página de funcionário
function buscarKpiFuncionarios(req, res) {
    let id = req.params.idAgencia;

    gerenteModel.buscarKpiFuncionarios(id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura da kpi total:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function carregarCardsFuncionario(req, res) {
    let id = req.params.idAgencia;

    gerenteModel.carregarCardsFuncionario(id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de funcionarios:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarCargo(req, res) {

    let id = req.params.idAgencia;

    gerenteModel.buscarCargo(id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de cargos:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarEmail(req, res) {

    let id = req.params.idAgencia;

    gerenteModel.buscarEmail(id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de emails:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarTelefone(req, res) {
    let id = req.params.idAgencia;

    console.log("teste")

    gerenteModel.buscarTelefone(id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de telefones:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function searchFuncionario(req, res) {
    let id = req.params.idAgencia;
    let pesquisa = req.params.pesquisa;

    gerenteModel.searchFuncionario(pesquisa, id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na pesquisa de funcionarios:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function filtrarFuncionario(req, res) {
    const primeiro = req.params.selecionado;
    const segundo = req.params.opcao;
    const id = req.params.idAgencia;

    gerenteModel.filtrarFuncionario(primeiro, segundo, id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na filtragem:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrarFuncionario(req, res) {
    let nome = req.body.nomeServer;
    let telefone = req.body.telefoneServer;
    let cargo = req.body.cargoServer;
    let email = req.body.emailServer;
    let senha = req.body.senhaServer;
    let idAgencia = req.body.idAgenciaServer;

    gerenteModel.cadastrarFuncionario(nome, telefone, cargo, email, senha, idAgencia)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarFuncionario(req, res) {
    let json = req.body.jsonEnvio;

    gerenteModel.atualizarFuncionario(json)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function removerFuncionario(req, res) {
    let id = req.params.idUsuario;

    gerenteModel.removerFuncionario(id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    // Pagina da dash
    buscarKpiCriticos,
    buscarKpiPercentual,
    buscarGraficoTop5,
    buscarGraficoSituacao,
    downloadCSV,
    listarAtmsPorAgencia,
    historico,
    mostrarCountTotal,
    mostrarCount,

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
    pesquisarConfiguracao,
    atualizarParametro,
    procurarConfigDisponivel,
    cadastrarConfig,
    removerAtm,
    removerConfig,

    //Página de Funcionário
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
    buscarDadosJira,
    formatarDuracaoPendenteTabela,
    listarAlertasPendentesTabela
}