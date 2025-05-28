var express = require("express");
var router = express.Router();

var dashLongoPrazoController = require("../controllers/dashLongoPrazoController");

router.post("/listarAtm", function (req, res) {
    dashLongoPrazoController.listarAtm(req, res);
})

router.post("/listarComponentes", function (req, res) {
    dashLongoPrazoController.listarComponentes(req, res);
})

router.post("/listarMetricas", function (req, res) {
    dashLongoPrazoController.listarMetricas(req, res);
})

router.post("/buscarKPI1", function (req, res) {
    dashLongoPrazoController.buscarKPI1(req, res);
})

router.post("/buscarKPI2", function (req, res) {
    dashLongoPrazoController.buscarKPI2(req, res);
})

router.post("/buscarGraficoAlertas", function (req, res) {
    dashLongoPrazoController.buscarGraficoAlertas(req, res);
})

module.exports = router;