const { Router } = require("express");
const agenciaController = require("../controllers/agenciaController");

const router = Router();

router.get('/mostrarAgencias', (req, res) => {
    agenciaController.mostrarCards(req, res);
})

module.exports = router;