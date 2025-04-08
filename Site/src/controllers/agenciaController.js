const database = require("../models/agenciaModel");

const mostrarCards = async (req, res) => {
    try{
        const select = await database.mostrarCards();
        if(!select){
            return res.status(400).send("Não há nenhuma agência cadastrada no sistema!");
        }
        return res.status(200).json(select);
    } catch (error){
        return res.status(500).json(error.message);
    }
}

const pesquisarAgencias = async (req, res) =>{
    try{
        const nome = req.params.nome;
        const select = await database.pesquisarAgencias(nome);
        if(select.length == 0){
            return res.status(400).send("Não foi encontrada uma agência com este nome!")
        }
        return res.status(200).json(select);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const cadastrarAgencia = async (req, res) => {
    try{
        console.log(req.body)
        var codigoAgencia = req.body.codigoAgenciaServer;
        var email = req.body.emailServer;
        var numero = req.body.numeroServer;
        
        console.log("chegou no controller", [codigoAgencia, email, numero])
        await database.cadastrarAgencia(codigoAgencia, email, numero);
        return res.status(201).send("Agência cadastrada com sucesso!");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    mostrarCards,
    pesquisarAgencias,
    cadastrarAgencia
}