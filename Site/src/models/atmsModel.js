const database = require("../database/config");

function deletarAtms(idAgencia){
    const instrucaoSql = `DELETE atm FROM atm JOIN agencia ON atm.fkAgencia = agencia.idAgencia WHERE idAgencia = ${idAgencia};`

    return database.executar(instrucaoSql)
}

module.exports = {
    deletarAtms
};