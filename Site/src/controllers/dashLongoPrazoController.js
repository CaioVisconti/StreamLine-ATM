const database = require("../models/dashLongoPrazoModel");

const listarAtm = async (req, res) => {
    try{
        var idAgencia = req.body.idAgenciaServer

        console.log("dados recebidos", idAgencia)
        
        const atms = await database.listarAtm(idAgencia);
        return res.status(200).json(atms); // retorna os dados reais        
    } catch (error) {
        console.error("Erro completo:", error);
        return res.status(400).json(error.message);
    }
}

const listarComponentes = async (req, res) => {
    try{
        var idAtm = req.body.idAtmServer

        console.log("dados recebidos", idAtm)
        
        const atms = await database.listarComponentes(idAtm);
        return res.status(200).json(atms); // retorna os dados reais        
    } catch (error) {
        console.error("Erro completo:", error);
        return res.status(400).json(error.message);
    }
}

const listarMetricas = async (req, res) => {
    try{
        var hostComponente = req.body.idComponenteServer
        var idAtm = req.body.idAtmServer


        console.log("dados recebidos", hostComponente, idAtm)
        
        const atms = await database.listarMetricas(hostComponente, idAtm);
        return res.status(200).json(atms); // retorna os dados reais        
    } catch (error) {
        console.error("Erro completo:", error);
        return res.status(400).json(error.message);
    }
}

const buscarKPI1 = async (req, res) => {
    try {
        let fkAgencia = req.body.id;

        const kpi1 = await database.buscarKPI1(fkAgencia);
        return res.status(200).json(kpi1)
    } catch (error) {
        console.error("Erro completo:", error);
        return res.status(400).json(error.message);
    }
}

const buscarKPI2 = async (req, res) => {
    try {
        let fkAgencia = req.body.id;

        const kpi1 = await database.buscarKPI2(fkAgencia);
        return res.status(200).json(kpi1)
    } catch (error) {
        console.error("Erro completo:", error);
        return res.status(400).json(error.message);
    }
}

const buscarGraficoAlertas = async (req, res) => {
    try {
        let fkAgencia = req.body.id;

        const kpi1 = await database.buscarGraficoAlertas(fkAgencia);
        return res.status(200).json(kpi1)
    } catch (error) {
        console.error("Erro completo:", error);
        return res.status(400).json(error.message);
    }
}

const pesquisarAtm = async (req, res) => {
    try {
        let texto = req.body.texto;
        let fkAgencia = req.body.id;

        const kpi1 = await database.pesquisarAtm(texto, fkAgencia);
        return res.status(200).json(kpi1)
    } catch (error) {
        console.error("Erro completo:", error);
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarAtm,
    listarComponentes,
    listarMetricas,
    buscarKPI1,
    buscarKPI2,
    buscarGraficoAlertas,
    pesquisarAtm
}

