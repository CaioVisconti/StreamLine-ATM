const database = require("../models/componenteModel");

const deletarComponentes = async (req, res) => {
    try{
        const idAgencia = req.params.idAgencia;
        console.log(req.params)

        console.log(idAgencia)

        await database.deletarComponentes(idAgencia);
    } catch (error) {
        console.log("Erro", error)
        return res.status(400).json(error.message)
    }
}

module.exports = {
    deletarComponentes
}