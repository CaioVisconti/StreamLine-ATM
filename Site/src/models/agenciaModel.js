const database = require("../database/config");

function mostrarCards() {
    const instrucaoSql = `SELECT * FROM agencia;`;
  
    return database.executar(instrucaoSql);
}

module.exports = {
    mostrarCards
};