const database = require("../database/config");

function buscarDados() {
    const instrucaoSql = `SELECT servico, sum(custo) as custo FROM awsCusto GROUP BY servico;`;
  
    return database.executar(instrucaoSql);
}

function buscarKpi1() {
    const instrucaoSql = `SELECT servico FROM awsCusto WHERE custo = (SELECT max(custo) as maiorCusto FROM awsCusto) LIMIT 1;`

    return database.executar(instrucaoSql);
}

function buscarIndicadores() {
    const instrucaoSql = `SELECT SUM(custo) as custo, servico FROM awsCusto WHERE fim >= DATE(NOW() - INTERVAL 7 DAY) GROUP BY servico;`

    return database.executar(instrucaoSql);
}

function buscarGastoMensal() {
    const instrucaoSql = `SELECT SUM(custo) as gastoMensal FROM awsCusto WHERE fim >= CURDATE() - INTERVAL 30 DAY AND inicio <= CURDATE();`

    return database.executar(instrucaoSql);
}

function buscarGastoTotal() {
    const instrucaoSql = `SELECT SUM(custo) as gastoTotal FROM awsCusto;`

    return database.executar(instrucaoSql);
}


module.exports = {
buscarDados,
buscarKpi1,
buscarIndicadores,
buscarGastoMensal,
buscarGastoTotal
};