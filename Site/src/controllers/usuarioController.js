var usuarioModel = require("../models/usuarioModel");
// var casaModel = require("../models/casaModel");

function autenticar(req, res) {
    
        var email = req.body.emailServer;
        var senha = req.body.senhaServer;
    
        if (!email || !senha) {
            res.status(400).send("Email ou senha indefinidos!");
            return;
        }
    
        usuarioModel.autenticar(email, senha)
            .then(resultado => {
                if (resultado.length == 1) {
                    res.status(200).json(resultado[0]); // Retorna o objeto do usuário corretamente
                } else if (resultado.length == 0) {
                    res.status(403).send("Email e/ou senha inválidos");
                } else {
                    res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                }
            })
            .catch(erro => {
                console.error("Erro no login:", erro);
                res.status(500).json(erro.sqlMessage);
            });
    }




function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var fkEmpresa = req.body.codServer;
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var telefone = req.body.telefoneServer;
    var cargo = req.body.cargoServer;
    var cpf = req.body.cpfServer;
    var senha = req.body.senhaServer;


    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    }
    else if (cpf == undefined) {
        res.status(400).send("Seu cpf está undefined!");
    }
    else if (telefone == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    }
    else if (cargo == undefined) {
        res.status(400).send("Seu cargo está undefined!");
    }
    else if (fkEmpresa == undefined) {
        res.status(400).send("Seu codigo da empresa está undefined!");
    }
    else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, cpf, email, telefone, senha, cargo , fkEmpresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function listar(req, res) {
    empresaModel.listar().then((resultado) => {
      res.status(200).json(resultado);
    });
  }

module.exports = {
    cadastrar,
    autenticar,
    listar
}