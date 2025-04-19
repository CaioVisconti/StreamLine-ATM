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

module.exports = router;