const { Router } = require("express");
const enderecoController = require("../controllers/enderecoController");

const router = Router();

router.post('/cadastrarEndereco', (req, res) => {
    enderecoController.cadastrarEndereco(req, res);
})

module.exports = router;