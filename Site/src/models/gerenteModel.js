const database = require("../database/config");

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

    let instrucaoSql = `SELECT DISTINCT sistemaOperacional AS SO FROM atm WHERE fkAgencia = ${id};`;
  
    return database.executar(instrucaoSql);
}

function atualizar(listaAtm) {
    let hostname = listaAtm.hostname;
    let idAtm = listaAtm.idAtm;
    let ip = listaAtm.ip;
    let macAdress = listaAtm.macAdress;
    let modelo = listaAtm.modelo;
    let sistemaOperacional = listaAtm.sistemaOperacional;
    let status = listaAtm.status;

    let instrucaoSql = `UPDATE atm SET hostname = "${hostname}", ip = "${ip}", macAdress = "${macAdress}", modelo = "${modelo}", sistemaOperacional = "${sistemaOperacional}", status = ${status} WHERE idAtm = ${idAtm};`;
  
    return database.executar(instrucaoSql);
}

function cadastrarATM(modelo, hostname, ip, macdress, so, status, fkAgencia) {
    let instrucaoSql = `INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES ("${hostname}", "${modelo}", "${ip}", "${macdress}", "${so}", ${status}, ${fkAgencia});`;
  
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarKpiTotal,
    buscarKpiAlerta,
    carregarCards,
    search,
    buscarModelos,
    buscarSO,
    atualizar,
    cadastrarATM
};