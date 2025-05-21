const gerenteModel = require("../models/gerenteModel");
const { get } = require("../routes/gerente");

// Dashboard

function buscarKpiCriticos(req, res) {
    let idAgencia = req.params.idAgencia;

    gerenteModel.buscarKpiCriticos(idAgencia)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado); 
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch((erro) => {
            console.error("Erro na captura da kpi de total criticos:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarKpiPercentual(req, res) {
    let idAgencia = req.params.idAgencia;

    gerenteModel.buscarKpiPercentual(idAgencia)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado); 
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch((erro) => {
            console.error("Erro na captura da kpi de percentual:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarGraficoTop5(req, res) {
    let idAgencia = req.params.idAgencia;

    gerenteModel.buscarGraficoTop5(idAgencia)
        .then((resultado) => {
            if (resultado.length > 0) {
                console.log("resultado: " + resultado)
                res.status(200).json(resultado); 
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch((erro) => {
            console.error("Erro na captura do top 5:", erro);
            console.error("Erro completo:", JSON.stringify(erro));
            res.status(500).json(erro.sqlMessage);
        });
}

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
            console.error("Erro na filtragem:", erro);
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

// Página de funcionário
function buscarKpiFuncionarios(req, res) {
    let id = req.params.idAgencia;

    gerenteModel.buscarKpiFuncionarios(id)
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

function carregarCardsFuncionario(req, res) {
    let id =  req.params.idAgencia;

    gerenteModel.carregarCardsFuncionario(id)
    .then((resultado) => {
        res.json({
            lista: resultado
        })
    })
    .catch(erro => {
        console.error("Erro na captura de funcionarios:", erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarCargo(req, res) {

    let id =  req.params.idAgencia;

    gerenteModel.buscarCargo(id)
    .then((resultado) => {
        res.json({
            lista: resultado
        })
    })
    .catch(erro => {
        console.error("Erro na captura de cargos:", erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarEmail(req, res) {

    let id =  req.params.idAgencia;

    gerenteModel.buscarEmail(id)
    .then((resultado) => {
        res.json({
            lista: resultado
        })
    })
    .catch(erro => {
        console.error("Erro na captura de emails:", erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarTelefone(req, res) {
    let id = req.params.idAgencia;

    console.log("teste")

    gerenteModel.buscarTelefone(id)
    .then((resultado) => {
        res.json({
            lista: resultado
        })
    })
    .catch(erro => {
        console.error("Erro na captura de telefones:", erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function searchFuncionario(req, res) {
    let id = req.params.idAgencia;
    let pesquisa = req.params.pesquisa;

    gerenteModel.searchFuncionario(pesquisa, id)
    .then((resultado) => {
        res.json({
            lista: resultado
        })
    })
    .catch(erro => {
        console.error("Erro na pesquisa de funcionarios:", erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function filtrarFuncionario(req, res) {
    const primeiro = req.params.selecionado;
    const segundo = req.params.opcao;
    const id = req.params.idAgencia;

    gerenteModel.filtrarFuncionario(primeiro, segundo, id)
        .then((resultado) => {
            res.json({
                lista: resultado
            })
        })
        .catch(erro => {
            console.error("Erro na filtragem:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrarFuncionario(req, res) {
    let nome = req.body.nomeServer;
    let telefone = req.body.telefoneServer;
    let cargo = req.body.cargoServer;
    let email = req.body.emailServer;
    let senha = req.body.senhaServer;
    let idAgencia = req.body.idAgenciaServer;

    gerenteModel.cadastrarFuncionario(nome, telefone, cargo, email, senha, idAgencia)
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

function atualizarFuncionario(req, res) {
    let json = req.body.jsonEnvio;

    gerenteModel.atualizarFuncionario(json)
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

function removerFuncionario(req, res) {
    let id = req.params.idUsuario;

    gerenteModel.removerFuncionario(id)
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
// Pagina da dash
buscarKpiCriticos,
buscarKpiPercentual,
buscarGraficoTop5,

// Página de ATM
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
    removerConfig,

//Página de Funcionário
    buscarKpiFuncionarios,
    carregarCardsFuncionario,
    buscarCargo,
    buscarEmail,
    buscarTelefone,
    searchFuncionario,
    filtrarFuncionario,
    cadastrarFuncionario,
    atualizarFuncionario,
    removerFuncionario
}