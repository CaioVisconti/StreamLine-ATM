const { Router } = require("express");
const empresaController = require("../controllers/empresaController");

const router = Router();

router.get('/mostrarEmpresas', (req, res) => {
    empresaController.mostrarEmpresas(req, res);
})

module.exports = router;