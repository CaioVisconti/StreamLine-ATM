const { Router } = require("express");
const agenciaController = require("../controllers/agenciaController");

const router = Router();

router.get('/mostrarAgencias', (req, res) => {
    agenciaController.mostrarCards(req, res);
})
router.get('/pesquisarAgencias/:nome', (req, res) => {
    agenciaController.pesquisarAgencias(req, res);
})


module.exports = router;