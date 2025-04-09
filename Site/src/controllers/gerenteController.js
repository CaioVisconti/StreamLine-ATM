const gerenteModel = require("../models/gerenteModel");

function buscarKpis(req, res) {
    let idAgencia = req.params.idAgencia;
    
    gerenteModel.buscarKpis(idAgencia)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura das kpis:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function carregarCards(req, res) {
    
    let idAgencia = req.params.idAgencia;
    
    gerenteModel.carregarCards(idAgencia)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function search(req, res) {
    
    let escrito = req.params.escrito;
    let idAgencia = req.params.idAgencia;

    gerenteModel.search(escrito, idAgencia)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function filtrar(req, res) {
    
    let formato = req.params.formato;
    let opcao = req.params.opcao;
    let idAgencia = req.params.idAgencia;
    let ordenacao = "";

    if((formato == "hostname" || formato == "ip" || formato == "macdress" || formato == "sistemaOperacional") && opcao == "norm") {
        ordenacao = "ASC"
    } else if((formato == "hostname" || formato == "ip" || formato == "macdress" || formato == "sistemaOperacional") && opcao == "inv") {
        ordenacao = "DESC"
    }

    gerenteModel.search(formato, idAgencia, ordenacao)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizar(req, res) {
    const json = req.params.listaAtm;

    gerenteModel.atualizar(json)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrarATM(req, res) {
    const modelo = req.body.modeloServer;
    const hostname = req.body.hostnameServer;
    const ip = req.body.ipServer;
    const macdress = req.body.macadressServer;
    const so = req.body.soServer;
    const status = req.body.statusServer;
    const fkAgencia = req.body.fkAgenciaServer;

    gerenteModel.cadastrar(modelo, hostname, ip, macdress, so, status, fkAgencia)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de atms:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    buscarKpis,
    carregarCards,
    search,
    filtrar,
    atualizar,
    cadastrarATM
}