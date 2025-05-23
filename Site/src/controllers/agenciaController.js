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
        console.log(error)
    }
}

const pesquisarAgenciasFiltradas = async (req, res) =>{
    try{
        console.log(req.params)
        const nome = req.params.nome;
        const select = await database.pesquisarAgenciasFiltradas(nome);
        if(select.length == 0){
            return res.status(400).send("Não foi encontrada uma agência com este nome!")
        }
        return res.status(200).json(select);
    } catch (error) {
        console.log(error)
    }
}

const contarAgencias = async (req, res) => {
    try{
        const select = await database.contarAgencias();
        return res.status(200).json(select);
    } catch (error){
        console.log("Ocorreu um erro no controller!", error);
        return res.status(400).json(error)
    }
}

const cadastrarAgencia = async (req, res, fkEndereco) => {
    try{
        var codigoAgencia = req.body.codigoAgenciaServer;
        var email = req.body.emailServer;
        var numero = req.body.numeroServer;
        var fkEmpresa = req.body.codigoEmpresaServer;

        console.log("dados recebidos", [fkEmpresa, fkEndereco, codigoAgencia, email, numero])
        
        await database.cadastrarAgencia(codigoAgencia, email, numero, fkEndereco, fkEmpresa);
        return res.status(201).send("Agência cadastrada com sucesso!");
    } catch (error) {
        console.log("Erro completo:", error);
        return res.status(400).json(error.message);
    }
}

const atualizarAgencia = async (req, res) => {
    console.log(req.params)
    try{
        const idAgencia = req.params.idAgencia;
        const email = req.body.emailServer;
        const numero = req.body.numeroServer;

        await database.atualizarAgencia(idAgencia, email, numero);
        return res.status(200).send("Agência atualizada com sucesso!");
    } catch (error) {
        console.log("Erro!", error)
        return res.status(400).json(error);
    }
}

const deletarAgencia = async (req, res) => {
    try{
        const idAgencia = req.params.idAgencia;
        console.log(req.params)

        console.log(idAgencia)

        await database.deletarAgencia(idAgencia);
        return res.status(200).send("Agência deletada com sucesso!");
    } catch (error) {
        console.log("Erro", error)
        return res.status(400).json(error.message)
    }
}

module.exports = {
    mostrarCards,
    pesquisarAgencias,
    pesquisarAgenciasFiltradas,
    contarAgencias,
    cadastrarAgencia,
    atualizarAgencia,
    deletarAgencia
}