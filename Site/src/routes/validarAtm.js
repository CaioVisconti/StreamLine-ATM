var express = require("express");
var router = express.Router();
const { pool } = require("../database/config");

// rota para devolver os dados com base no mac
router.get("/mac/:mac", async (req, res) => {
    const mac = req.params.mac;

    try {
        const [rows] = await pool.execute(  //db.execute retorna uma tupla com dois elementos [resultado dos dados, nome de colunas etc], por isso é um rows
            "SELECT * FROM parametrizacao WHERE macAdress = ?",
            [mac]
        );

        if (rows.length > 0) {
            res.json(rows); // AQUI retorna todas as linhas
        } else {
            res.status(404).json({ erro: "MAC Address não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao consultar o banco:", error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
});

router.get("/atms/1", async (req, res) => {

    try {
        const [rows] = await pool.execute(  //db.execute retorna uma tupla com dois elementos [resultado dos dados, nome de colunas etc], por isso é um rows
            "SELECT count(idAtm) FROM atm;",
        );

        if (rows.length > 0) {
            res.json(rows); // AQUI retorna todas as linhas
        } else {
            res.status(404).json({ erro: "MAC Address não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao consultar o banco:", error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
});

module.exports = router;
