var database = require("../database/config");

function buscarKPIs() {
    var instrucaoSql = `
    SELECT 
        viewCritico.atmsCritico,
        viewMedio.atmsMedios,
        viewBom.atmsSemAlerta
    FROM viewCritico, viewMedio, viewBom;
    `;
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPacotes() {
    var instrucaoSql = `
    select * from viewRedesBytes;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarKPIs,
    buscarPacotes,
};
