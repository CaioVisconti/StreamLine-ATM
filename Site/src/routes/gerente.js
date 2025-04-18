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

router.get("/:idAgencia/buscarSO", function (req, res) {
    gerenteController.buscarSO(req, res);
})

router.get("/:selecionado/:opcao/:idAgencia/filtrar", function (req, res) {
    gerenteController.filtrar(req, res);
})

router.get("/:idAtm/procurarComponentes", function (req, res) {
    gerenteController.procurarComponentes(req, res);
})

router.put("/atualizar", function (req, res) {
    gerenteController.atualizar(req, res);
})

router.post("/cadastrarATM", function (req, res) {
    gerenteController.cadastrarATM(req, res);
})

router.get("/:componenteAtual/:idAtm/pesquisarConfiguracao", function (req, res) {
    gerenteController.pesquisarConfiguracao(req, res);
})

router.put("/:limiteAtual/:idConfig/atualizarParametro", function (req, res) {
    gerenteController.atualizarParametro(req, res);
})

router.get("/:comp/procurarConfigDisponivel", function (req, res) {
    gerenteController.procurarConfigDisponivel(req, res);
})

router.post("/cadastrarConfig", function (req, res) {
    gerenteController.cadastrarConfig(req, res);
})

router.delete("/:idAtm/removerAtm", function (req, res) {
    gerenteController.removerAtm(req, res);
})

router.delete("/:id/removerConfig", function (req, res) {
    gerenteController.removerConfig(req, res);
})

module.exports = router;