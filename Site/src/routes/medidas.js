var express = require("express");
var router = express.Router();

var medidaController = require("../controllers/medidaController");

router.get("/kpis", function (req, res) {
    medidaController.buscarKPIs(req, res);
});

router.get("/pacotes", function (req, res) {
    medidaController.buscarPacotes(req, res);
});

router.get("/atms/:id", function (req, res) {
    medidaController.buscarAtms(req, res);
});

router.get("/cores", function (req, res) {
    medidaController.cores(req, res);
});

module.exports = router;