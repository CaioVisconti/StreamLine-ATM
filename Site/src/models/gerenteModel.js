const database = require("../database/config");


function carregarCards(idAgencia) {
    let instrucaoSql = `SELECT atm.* FROM agencia AS ag JOIN atm ON ag.idAgencia = atm.fkAgencia WHERE fkAgencia = ${idAgencia};`;
  
    return database.executar(instrucaoSql);
}

function search(escrito, idAgencia) {

    let instrucaoSql = `SELECT atm.* FROM agencia AS ag JOIN atm ON ag.idAgencia = atm.fkAgencia WHERE fkAgencia = ${idAgencia} AND hostname = "%${escrito}%" ORDER BY hostname ASC";`;
  
    return database.executar(instrucaoSql);
}

function filtrar(formato, idAgencia, ordenacao) {

    let instrucaoSql = `SELECT atm.* FROM agencia AS ag JOIN atm ON ag.idAgencia = atm.fkAgencia WHERE fkAgencia = ${idAgencia} ORDER BY ${formato} ${ordenacao}";`;
  
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

    let instrucaoSql = `UPDATE atm SET hostname = "${hostname}", ip = "${ip}", macAdress = "${macAdress}", modelo = "${modelo}", sistemaOperacional = "${sistemaOperacional}", status = "${status} WHERE idAtm = ${idAtm}";`;
  
    return database.executar(instrucaoSql);
}

function cadastrarATM(modelo, hostname, ip, macdress, so, status, fkAgencia) {
    let instrucaoSql = `INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES (${hostname}, ${modelo}, ${ip}, ${macdress}, ${so}, ${status}, ${fkAgencia});`;
  
    return database.executar(instrucaoSql);
}

module.exports = {
    carregarCards,
    search,
    filtrar,
    atualizar,
    cadastrarATM
};