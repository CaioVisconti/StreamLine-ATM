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

router.delete('/deletarEmpresa/:idEmpresa', async (req, res) => {
    empresaController.deletarEmpresa(req, res);
})

router.get("/:pesquisa/mostrarEmpresasSearch", function (req, res) {
    empresaController.mostrarEmpresasSearch(req, res);
})

module.exports = router;