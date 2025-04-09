const database = require("../database/config");

function cadastrarEndereco(cep, uf, cidade, bairro, logradouro) {
    const instrucaoSql = `INSERT INTO endereco (cep, uf, cidade, bairro, logradouro) VALUES ('${cep}', '${uf}', '${cidade}', '${bairro}', '${logradouro}');`;
  
    return database.executar(instrucaoSql);
}
module.exports = {
    cadastrarEndereco
};