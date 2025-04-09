const database = require("../models/enderecoModel");

const cadastrarEndereco = async (req, res) => {
    try{
        var cep = req.body.cepServer;
        var uf = req.body.ufServer;
        var cidade = req.body.cidadeServer;
        var bairro = req.body.bairroServer;
        var logradouro = req.body.logradouroServer;

        const insert = await database.cadastrarEndereco(cep, uf, cidade, bairro, logradouro);

        return res.status(201).json(insert);
    } catch (error){
        return res.status(500).json(error.message);
    }
}

module.exports = {
    cadastrarEndereco
}