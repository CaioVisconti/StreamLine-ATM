const database = require("../database/config");

function mostrarEmpresas() {
    const instrucaoSql = `SELECT * FROM empresa;`;
  
    return database.executar(instrucaoSql);
}

module.exports = {
    mostrarEmpresas
};