const database = require("../database/config");

function mostrarEmpresas() {
    const instrucaoSql = `SELECT * FROM empresa;`;
  
    return database.executar(instrucaoSql);
}

function cadastrarEmpresas(codigoEmpresa, cnpj, nome) {
    const instrucaoSql = `INSERT INTO empresa (nome, cnpj, codigo) VALUES ('${nome}', '${cnpj}', '${codigoEmpresa}');`;

    return database.executar(instrucaoSql);
}

function kpiParceiras() {
    const instrucaoSql = `SELECT COUNT(empresa.idEmpresa) as quantidade from empresa;`;

    return database.executar(instrucaoSql);
}

function deletarEmpresa(idEmpresa){
    const instrucaoSql = `DELETE FROM empresa WHERE idEmpresa = ${idEmpresa};`

    return database.executar(instrucaoSql)
}

module.exports = {
    mostrarEmpresas,
    cadastrarEmpresas,
    kpiParceiras,
    deletarEmpresa
};