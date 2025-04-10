const { Router } = require("express");
const agenciaController = require("../controllers/agenciaController");
const enderecoController = require("../controllers/enderecoController");
const router = Router();

router.get('/mostrarAgencias', (req, res) => {
    agenciaController.mostrarCards(req, res);
})
router.get('/pesquisarAgencias/:nome', (req, res) => {
    agenciaController.pesquisarAgencias(req, res);
})
router.post('/cadastrarAgencia', async (req, res) => {
    try {
        const insert = await enderecoController.cadastrarEndereco(req, res);
        console.log("AAAAAAAAAAAAAAA", insert)
        const fkEndereco = insert.insertId;
        agenciaController.cadastrarAgencia(req, res, fkEndereco);
    } catch (error) {
        console.log(error)
    }
})
router.delete('/deletarAgencia/:idAgencia', async (req, res) => {
    agenciaController.deletarAgencia(req, res);
})


module.exports = router;