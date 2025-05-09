var database = require("../database/config");

function buscarKPIs() {
    var instrucaoSql = `
    SELECT * FROM viewCritico, viewMedia, viewBom;
    `;
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPacotes() {
    var instrucaoSql = `
    select * from viewRedesBytes;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarAtms(idAgencia) {
    var instrucaoSql = `
    select idAtm as "ID" from atm
    join agencia on agencia.idAgencia = atm.fkAgencia
    where fkAgencia = ${idAgencia};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cores() {
    var instrucaoSql = `
    SELECT * from viewCriticoLista;
    SELECT * from viewMediaLista;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarKPIs,
    buscarPacotes,
    buscarAtms,
    cores
};
