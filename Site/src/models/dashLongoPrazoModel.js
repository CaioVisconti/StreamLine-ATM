const database = require("../database/config");

function listarAtm(idAgencia) {
    const instrucaoSql = `
    SELECT 
    idAtm,
    atm.hostname AS nome
    FROM atm WHERE fkAgencia = ${idAgencia};`;
  
    return database.executar(instrucaoSql);
}

function listarComponentes(idAtm) {
    const instrucaoSql = `
    SELECT DISTINCT
	    c.nome
    FROM componentes c
    JOIN parametro p ON c.idComponentes = p.fkComponente
    WHERE p.fkAtm = ${idAtm};`;
  
    return database.executar(instrucaoSql);
}


function listarMetricas(hostComponente, idAtm) {
    const instrucaoSql = `
    SELECT DISTINCT
	c.descricao as metricas
    FROM componentes c
    JOIN parametro p ON c.idComponentes = p.fkComponente
    WHERE c.nome = '${hostComponente}' and p.fkAtm = ${idAtm};

    `;
  
    return database.executar(instrucaoSql);
}

function buscarKPI1(fkAgencia) {
    const instrucaoSql = `
        SELECT COUNT(*) AS qtd FROM alerta AS a
            JOIN parametro AS p ON a.fkParametro = p.idParametro
            JOIN atm ON atm.idAtm = p.fkAtm
            WHERE dtHoraAbertura > DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
            AND dtHoraAbertura < CURDATE()
            AND fkAgencia = ${fkAgencia};
    `;

    return database.executar(instrucaoSql);
}

function buscarKPI2(fkAgencia) {
    const instrucaoSql = `
        SELECT COUNT(*) AS qtd FROM alerta AS a
            JOIN parametro AS p ON a.fkParametro = p.idParametro
            JOIN atm ON atm.idAtm = p.fkAtm
            WHERE dtHoraAbertura > DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
            AND dtHoraAbertura < CURDATE()
            AND categoria = "High"
            AND fkAgencia = ${fkAgencia};
    `;

    return database.executar(instrucaoSql);
}

function buscarGraficoAlertas(fkAgencia) {
    const instrucaoSql = `
        SELECT * FROM alertasDetalhados WHERE fkAgencia = ${fkAgencia};
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    listarAtm,
    listarComponentes,
    listarMetricas,
    buscarKPI1,
    buscarKPI2,
    buscarGraficoAlertas
};