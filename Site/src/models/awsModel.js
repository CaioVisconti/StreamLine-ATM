const database = require("../database/config");

function buscarDados() {
    const instrucaoSql = `SELECT servico, sum(custo) as custo FROM awsCusto GROUP BY servico;`;
  
    return database.executar(instrucaoSql);
}

function buscarKpi1() {
    const instrucaoSql = `SELECT sum(custo) as custoTotal, (SELECT servico FROM awsCusto ORDER BY custo DESC LIMIT 1) AS servico, (SELECT SUM(custo) FROM awsCusto WHERE servico = (SELECT servico FROM awsCusto ORDER BY custo DESC LIMIT 1)) as custoServico FROM awsCusto;`
    
    return database.executar(instrucaoSql);
}

function buscarIndicadores() {
    const instrucaoSql = `SELECT SUM(custo) as custo, servico FROM awsCusto WHERE fim >= DATE(NOW() - INTERVAL 7 DAY) GROUP BY servico;`

    return database.executar(instrucaoSql);
}

function buscarGastoMensal() {
    const instrucaoSql = `SELECT SUM(custo) as gastoMensal, MONTH(fim) AS mes FROM awsCusto WHERE MONTH(fim) = MONTH(CURDATE()) AND YEAR(fim) = YEAR(CURDATE()) GROUP BY mes;`

    return database.executar(instrucaoSql);
}

function buscarGastoTotal() {
    const instrucaoSql = `SELECT SUM(custo) as gastoTotal FROM awsCusto;`

    return database.executar(instrucaoSql);
}

function buscarDadosCadaMes() {
    const instrucaoSql = `SELECT gastoMensal, mes FROM (SELECT SUM(custo) AS gastoMensal, MONTHNAME(fim) AS mes FROM awsCusto GROUP BY mes) AS subquery ORDER BY FIELD(mes, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");`

    return database.executar(instrucaoSql)
}


module.exports = {
buscarDados,
buscarKpi1,
buscarIndicadores,
buscarGastoMensal,
buscarGastoTotal,
buscarDadosCadaMes
};