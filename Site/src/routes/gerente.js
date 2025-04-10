var express = require("express");
var router = express.Router();

var gerenteController = require("../controllers/gerenteController");

//Recebendo os dados do html e direcionando para a função cadastrar de gerenteController.js
router.get("/:idAgencia/buscarKpiTotal", function (req, res) {
    gerenteController.buscarKpiTotal(req, res);
})

router.get("/:idAgencia/buscarKpiAlertas", function (req, res) {
    gerenteController.buscarKpiAlerta(req, res);
})

router.get("/:idAgencia/carregarCards", function (req, res) {
    gerenteController.carregarCards(req, res);
})

router.get("/:escrito/:idAgencia/search", function (req, res) {
    gerenteController.search(req, res);
})

router.get("/:idAgencia/buscarModelos", function (req, res) {
    gerenteController.buscarModelos(req, res);
})

router.put("/:listaAtm/atualizar", function (req, res) {
    gerenteController.atualizar(req, res);
})

router.post("/cadastrarATM", function (req, res) {
    gerenteController.cadastrarATM(req, res);
})

module.exports = router;