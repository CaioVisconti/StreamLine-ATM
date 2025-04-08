var express = require("express");
var router = express.Router();

var medidaController = require("../controllers/medidaController");

router.get("/kpis", function (req, res) {
    medidaController.buscarKPIs(req, res);
});

router.get("/pacotes", function (req, res) {
    medidaController.buscarPacotes(req, res);
});

module.exports = router;