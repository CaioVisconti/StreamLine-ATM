const gerenteModel = require("../models/gerenteModel");
const { get } = require("../routes/gerente");

function buscarKpiTotal(req, res) {
    let idAgencia = req.params.idAgencia;
    
    gerenteModel.buscarKpiTotal(idAgencia)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura da kpi total:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarKpiAlerta(req, res) {
    let idAgencia = req.params.idAgencia;
    
    gerenteModel.buscarKpiAlerta(idAgencia)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura da kpi de alerta:", erro);
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

function buscarModelos(req, res) {
    const id = req.params.idAgencia;

    gerenteModel.buscarModelos(id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de modelos:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarSO(req, res) {
    const id = req.params.idAgencia;

    gerenteModel.buscarSO(id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de sistemas operacionais:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function filtrar(req, res) {
    const primeiro = req.params.selecionado;
    const segundo = req.params.opcao;
    const id = req.params.idAgencia;

    gerenteModel.filtrar(primeiro, segundo, id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na captura de sistemas operacionais:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function procurarComponentes(req, res) {
    let idAtm = req.params.idAtm;

    gerenteModel.procurarComponentes(idAtm)
    .then((resultado) => {
        res.json({
            lista:resultado
        })
    })
    .catch(erro => {
        console.error("Erro na captura de sistemas operacionais:", erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function atualizar(req, res) {
    const json = req.body.lista;

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

    gerenteModel.cadastrarATM(modelo, hostname, ip, macdress, so, status, fkAgencia)
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

function pesquisarConfiguracao(req, res) {
    let componente = req.params.componenteAtual;
    let idAtm = req.params.idAtm;

    gerenteModel.procurarConfiguracao(componente, idAtm)
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

function atualizarParametro(req, res) {
    let limite = req.params.limiteAtual;
    let id = req.params.idConfig;

    gerenteModel.atualizarParametro(limite, id)
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

function procurarConfigDisponivel(req, res) {
    let componente = req.params.comp;
    console.log(componente);

    gerenteModel.procurarConfigDisponivel(componente)
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

function cadastrarConfig(req, res) {
    let limite = req.body.limiteServer;
    let medida = req.body.medidaServer;
    let idAtm = req.body.idAtmServer;

    gerenteModel.cadastrarConfig(limite, medida, idAtm)
    .then((resultado) => {
        res.json({
            lista: resultado
        })
    })
    .catch(erro => {
        console.error("Erro no cadastro de configuração:", erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function removerAtm(req, res) {
    let id = req.params.idAtm;

    gerenteModel.removerAtm(id)
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

function removerConfig(req, res) {
    let id = req.params.id;

    gerenteModel.removerConfig(id)
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
    buscarKpiTotal,
    buscarKpiAlerta,
    carregarCards,
    search,
    buscarModelos,
    buscarSO,
    filtrar,
    procurarComponentes,
    atualizar,
    cadastrarATM,
    pesquisarConfiguracao,
    atualizarParametro,
    procurarConfigDisponivel,
    cadastrarConfig,
    removerAtm,
    removerConfig
}