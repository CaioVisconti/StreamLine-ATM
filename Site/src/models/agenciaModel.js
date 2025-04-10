const database = require("../database/config");

function mostrarCards() {
    const instrucaoSql = `SELECT * FROM agencia;`;
  
    return database.executar(instrucaoSql);
}

function pesquisarAgencias(nome) {
    const instrucaoSql = `SELECT * FROM agencia JOIN empresa ON agencia.fkEmpresa = empresa.idEmpresa WHERE empresa.nome LIKE '${nome}%';`;
  
    return database.executar(instrucaoSql);
}

function contarAgencias(){
    const instrucaoSql = `SELECT COUNT(codigoAgencia) AS agencias FROM agencia;`

    return database.executar(instrucaoSql);
}

function cadastrarAgencia(codigoAgencia, email, numero, fkEndereco, fkEmpresa) {
    const instrucaoSql = `INSERT INTO agencia (codigoAgencia, email, telefone, fkEndereco, fkEmpresa) VALUES ('${codigoAgencia}', '${email}', '${numero}', ${fkEndereco}, ${fkEmpresa});`;

    return database.executar(instrucaoSql);
}

function deletarAgencia(idAgencia){
    const instrucaoSql = `DELETE agencia FROM agencia WHERE idAgencia = ${idAgencia};`

    return database.executar(instrucaoSql)
}

module.exports = {
    mostrarCards,
    pesquisarAgencias,
    contarAgencias,
    cadastrarAgencia,
    deletarAgencia
};