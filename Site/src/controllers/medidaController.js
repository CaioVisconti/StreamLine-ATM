var medidaModel = require("../models/medidaModel");

function buscarKPIs(req, res) {
    console.log(`Recuperando KPIs gerais`);

    medidaModel.buscarKPIs().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as KPIs.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarPacotes(req, res) {
    console.log(`Recuperando distribuição de pacotes`);

    medidaModel.buscarPacotes().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os pacotes.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    buscarKPIs,
    buscarPacotes
}