const { Router } = require("express");
const empresaController = require("../controllers/empresaController");

const router = Router();

router.get('/mostrarEmpresas', (req, res) => {
    empresaController.mostrarEmpresas(req, res);
})

router.post('/cadastrarEmpresas', (req, res) => {
    empresaController.cadastrarEmpresas(req, res);
})

router.get('/kpiParceiras', (req, res) => {
    empresaController.kpiParceiras(req, res);
})



module.exports = router;