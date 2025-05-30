var express = require("express");
var router = express.Router();
var awsController = require("../controllers/awsController");
var dadosAws = null
var capturasAws = null


router.post("/enviarDetalhesAws", function (req, res) {
    res.status(200).send("Dados Enviados com sucesso");
    dadosAws = req.body;
})

router.post("/enviarCapturasAws", function (req, res) {
    res.status(200).send("Dados Enviados com sucesso");
    capturasAws = req.body;
})

router.get("/buscarDetalhesAws", function (req, res) {
    res.status(200).json(dadosAws);
})

router.get("/buscarDadosPorServico", function (req, res) {
    awsController.buscarDadosPorServico(req, res);
})

router.get("/buscarCapturasAws", function (req, res) {
    res.status(200).json(capturasAws);
})

router.get("/buscarDados", function (req, res) {
    awsController.buscarDados(req, res);
})
router.get("/buscarGastoCadaMes", function (req, res) {
    awsController.buscarDadosCadaMes(req, res);
})

router.get("/buscarKpi1", function (req, res) {
    awsController.buscarKpi1(req, res);
})

router.get("/buscarIndicadores", function (req, res) {
    awsController.buscarIndicadores(req, res);
})

router.get("/buscarGastoMensal", function (req, res) {
    awsController.buscarGastoMensal(req, res);
})

router.get("/buscarGastoTotal", function (req, res) {
    awsController.buscarGastoTotal(req, res);
})



module.exports = router;