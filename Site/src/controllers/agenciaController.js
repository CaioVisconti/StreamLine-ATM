const database = require("../models/agenciaModel");

const mostrarCards = async (req, res) => {
    try{
        const select = await database.mostrarCards();
        if(!select){
            return res.status(400).send("Não há nenhuma empresa cadastrada no sistema!");
        }
        return res.status(200).json(select);
    } catch (error){
        return res.status(500).json(error.message);
    }
}

module.exports = {
    mostrarCards
}