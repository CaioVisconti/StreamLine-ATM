const database = require("../database/config");

function mostrarCards() {
    const instrucaoSql = `SELECT * FROM agencia;`;
  
    return database.executar(instrucaoSql);
}

function pesquisarAgencias(nome) {
    const instrucaoSql = `SELECT * FROM agencia JOIN empresa ON agencia.fkEmpresa = empresa.idEmpresa WHERE empresa.nome LIKE '${nome}%';`;
  
    return database.executar(instrucaoSql);
}

function cadastrarAgencia(fkEmpresa, fkEndereco, codigoAgencia, email, numero) {
    const instrucaoSql = `INSERT INTO agencia (fkEmpresa, fkEndereco, codigoAgencia, email, telefone) VALUES ('${fkEmpresa}', '${fkEndereco}', '${codigoAgencia}', '${email}', '${numero}');`;

    return database.executar(instrucaoSql);
}

module.exports = {
    mostrarCards,
    pesquisarAgencias,
    cadastrarAgencia
};