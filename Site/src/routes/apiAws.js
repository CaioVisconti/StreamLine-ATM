var express = require("express");
var router = express.Router();
let dados = null

router.post("/enviarDados", function (req, res) {
    dados = req.body
    res.status(200).send("Dados enviados com sucesso")
})

router.get("/buscarDados", function (req, res) {
    res.status(200).json(dados)
})

module.exports = router;