var express = require("express");
var router = express.Router();

var gerenteController = require("../controllers/gerenteController");

//Recebendo os dados do html e direcionando para a função cadastrar de gerenteController.js
router.get("/:idAgencia/buscarKpis", function (req, res) {
    gerenteController.buscarKpis(req, res);
})

router.get("/:idAgencia/carregarCards", function (req, res) {
    gerenteController.carregarCards(req, res);
})

router.get("/:escrito/:idAgencia/search", function (req, res) {
    gerenteController.search(req, res);
})

router.get("/:formato/:opcao/:idAgencia/filtrar", function (req, res) {
    gerenteController.search(req, res);
})

router.put("/:listaAtm/atualizar", function (req, res) {
    gerenteController.atualizar(req, res);
})

router.post("/cadastrarATM", function (req, res) {
    gerenteController.cadastrar(req, res);
})

module.exports = router;