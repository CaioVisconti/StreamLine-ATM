const database = require("../models/empresaModel");

const mostrarEmpresas = async (req, res) => {
    try{
        const select = await database.mostrarEmpresas();
        if(!select){
            return res.status(400).send("Não há nenhuma empresa cadastrada no sistema!");
        }
        return res.status(200).json(select);
    } catch (error){
        return res.status(500).json(error.message);
    }
}

module.exports = {
    mostrarEmpresas
}