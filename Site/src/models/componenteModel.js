const database = require("../database/config");

function deletarComponentes(idAgencia){
    const instrucaoSql = `DELETE componentes FROM componentes JOIN atm ON componentes.fkAtm = atm.idAtm JOIN agencia ON atm.fkAgencia = agencia.idAgencia WHERE agencia.idAgencia = ${idAgencia};`

    return database.executar(instrucaoSql)
}

module.exports = {
    deletarComponentes
};