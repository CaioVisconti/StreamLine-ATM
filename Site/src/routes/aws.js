var express = require("express");
var router = express.Router();
var awsController = require("../controllers/awsController");

router.get("/buscarDados", function (req, res) {
    awsController.buscarDados(req, res);
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