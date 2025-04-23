const e = require("express");
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

    let instrucaoSql = `SELECT DISTINCT sistemaOperacional AS so FROM atm WHERE fkAgencia = ${id};`;
  
    return database.executar(instrucaoSql);
}

function filtrar(primeiro, segundo, id) {
    let formato = "ASC"
    let instrucaoSql = ""

    if(!segundo.includes("%")) {
        if(segundo == "ativo") {
            segundo = 1;
        } else if(segundo == "desativo") {
            segundo = 0;
        }
    
        if(segundo == "filtro_ZA") {
            formato = "DESC"
        }
    } else {  
        segundo.replace("%", " ")
    }

    if(primeiro == "statusATM") {
        instrucaoSql = `SELECT * FROM atm WHERE fkAgencia = ${id} AND ${primeiro} = ${segundo}`;
    } else if(primeiro == "hostname") {
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

    if(segundo == "filtro_ZA") {
        formato = "DESC";
    }

    if(primeiro == "nome") {
        instrucaoSql = `SELECT * FROM usuario WHERE fkAgencia = ${id} AND cargo <> "Gerente" ORDER BY ${primeiro} ${formato};`;
    } else if(primeiro == "cargo") {
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

    console.log(id);

    let instrucaoSql = `DELETE FROM usuario WHERE idUsuario = ${id}`;

    return database.executar(instrucaoSql);
}

module.exports = {
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
    removerFuncionario
};