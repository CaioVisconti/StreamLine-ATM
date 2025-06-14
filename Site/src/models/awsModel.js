const database = require("../database/config");

function buscarDados() {
    const instrucaoSql = `SELECT servico, sum(custo) as custo FROM awsCusto GROUP BY servico ORDER BY custo DESC;`;
  
    return database.executar(instrucaoSql);
}

function buscarKpi1() {
    const instrucaoSql = `SELECT sum(custo) as custoTotal, (SELECT servico FROM awsCusto GROUP BY servico ORDER BY SUM(custo) DESC LIMIT 1) AS servico, (SELECT SUM(custo) FROM awsCusto WHERE servico = (SELECT servico FROM awsCusto GROUP BY servico ORDER BY SUM(custo) DESC LIMIT 1)) as custoServico FROM awsCusto;`
    
    return database.executar(instrucaoSql);
}

function buscarIndicadores() {
    const instrucaoSql = `SELECT SUM(custo) as custo, servico FROM awsCusto WHERE inicio >= DATE(NOW() - INTERVAL 7 DAY) GROUP BY servico ORDER BY servico;`

    return database.executar(instrucaoSql);
}

function buscarSemanaAnterior() {
    const instrucaoSql = `SELECT SUM(custo) as custo, servico FROM awsCusto WHERE inicio >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) + 7 DAY) AND inicio < DATE_SUB(CURDATE(),INTERVAL WEEKDAY(CURDATE()) DAY) GROUP BY servico ORDER BY servico;`

    return database.executar(instrucaoSql);
}

function buscarIndicadoresMensal() {
    const instrucaoSql = `SELECT SUM(custo) as custo, servico FROM awsCusto WHERE MONTH(inicio) = MONTH(CURDATE()) GROUP BY servico ORDER BY servico;`

    return database.executar(instrucaoSql);
}

function buscarGastoTotalPorMes(){
    const instrucaoSql = `SELECT SUM(custo) AS custo, MONTH(inicio) AS mes FROM awsCusto GROUP BY mes ORDER BY mes;`

    return database.executar(instrucaoSql)
}

function buscarIndicadoresMesAnterior() {
    const instrucaoSql = `SELECT SUM(custo) as custo, servico FROM awsCusto WHERE MONTH(inicio) = MONTH(CURDATE()) - 1 GROUP BY servico ORDER BY servico;`

    return database.executar(instrucaoSql);
}

function buscarGastoMensal() {
    const instrucaoSql = `SELECT SUM(custo) as gastoMensal, MONTH(inicio) AS mes FROM awsCusto WHERE MONTH(inicio) = MONTH(CURDATE()) AND YEAR(inicio) = YEAR(CURDATE()) GROUP BY mes;`

    return database.executar(instrucaoSql);
}

function buscarGastoTotal() {
    const instrucaoSql = `SELECT SUM(custo) as gastoTotal FROM awsCusto;`

    return database.executar(instrucaoSql);
}

function buscarDadosCadaMes() {
    const instrucaoSql = `SELECT custo, servico, mes FROM (SELECT SUM(custo) AS custo, servico, MONTHNAME(inicio) AS mes FROM awsCusto GROUP BY servico, mes) AS subquery ORDER BY FIELD(mes, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");`

    return database.executar(instrucaoSql)
}

function buscarMMP(){
    const instrucaoSql = `SELECT  servico, MONTH(inicio) AS mes,  SUM(custo) AS custo FROM awsCusto WHERE inicio >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH) AND inicio <= CURDATE() GROUP BY servico, mes ORDER BY servico, mes;`
    
    return database.executar(instrucaoSql)
}

function buscarGastosIndividuais(){
    const instrucaoSql = ` SELECT  servico, MONTH(inicio) AS mes,  SUM(custo) AS custo FROM awsCusto WHERE inicio >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND inicio <= CURDATE() GROUP BY servico, mes ORDER BY servico, mes;`

    return database.executar(instrucaoSql)
}

module.exports = {
buscarDados,
buscarKpi1,
buscarSemanaAnterior,
buscarIndicadores,
buscarIndicadoresMensal,
buscarGastoTotalPorMes,
buscarIndicadoresMesAnterior,
buscarGastoMensal,
buscarMMP,
buscarGastoTotal,
buscarGastosIndividuais,
buscarDadosCadaMes
};