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

module.exports = {
    listarAtm,
    listarComponentes,
    listarMetricas
};