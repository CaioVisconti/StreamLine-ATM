var express = require("express");
var router = express.Router();

var gerenteController = require("../controllers/gerenteController");

// Dashboard
router.get("/:idAgencia/buscarKpiCriticos", function (req, res) {
    gerenteController.buscarKpiCriticos(req, res);
})

router.get("/:idAgencia/buscarKpiPercentual", function (req, res) {
    gerenteController.buscarKpiPercentual(req, res);
})

router.get("/:idAgencia/buscarGraficoTop5", function (req, res) {
    gerenteController.buscarGraficoTop5(req, res);
})

router.get("/:idAgencia/buscarGraficoSituacao", function (req, res) {
    gerenteController.buscarGraficoSituacao(req, res);
})


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

// Tela de funcionários:
router.get("/:idAgencia/buscarKpiFuncionarios", function (req, res) {
    gerenteController.buscarKpiFuncionarios(req, res);
})

router.get("/:idAgencia/carregarCardsFuncionario", function (req, res) {
    gerenteController.carregarCardsFuncionario(req, res);
})

router.get("/:idAgencia/buscarCargo", function (req, res) {
    gerenteController.buscarCargo(req, res);
})

router.get("/:idAgencia/buscarEmail", function (req, res) {
    gerenteController.buscarEmail(req, res);
})

router.get("/:idAgencia/buscarTelefone", function (req, res) {
    gerenteController.buscarTelefone(req, res);
})

router.get("/:pesquisa/:idAgencia/searchFuncionario", function (req, res) {
    gerenteController.searchFuncionario(req, res);
})

router.get("/:selecionado/:opcao/:idAgencia/filtrarFuncionario", function (req, res) {
    gerenteController.filtrarFuncionario(req, res);
})

router.post("/cadastrarFuncionario", function (req, res) {
    gerenteController.cadastrarFuncionario(req, res);
})

router.put("/atualizarFuncionario", function (req, res) {
    gerenteController.atualizarFuncionario(req, res);
})

router.delete("/:idUsuario/removerFuncionario", function (req, res) {
    gerenteController.removerFuncionario(req, res);
})

module.exports = router;