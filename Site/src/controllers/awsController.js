const database = require("../models/awsModel");

const buscarDados = async (req, res) => {
    try{
        const select = await database.buscarDados();
        return res.status(200).json(select);
    } catch (error){
        return res.status(500).json(error.message);
    }
}

const buscarKpi1 = async (req, res) => {
    try{
        const select = await database.buscarKpi1();
        return res.status(200).json(select);
    } catch (error){
        return res.status(400).json(error.message);
    }
}

const buscarIndicadores = async (req, res) => {
    try{
        const select = await database.buscarIndicadores();
        const selectMensal = await database.buscarIndicadoresMensal();
        return res.status(200).json({select, selectMensal});
    } catch (error){
        return res.status(400).json(error.message);
    }
}

const buscarGastoMensal = async (req, res) => {
    try{
        const select = await database.buscarGastoMensal();
        return res.status(200).json(select);
    } catch (error){
        return res.status(400).json(error.message);
    }
}

const buscarGastoTotal = async (req, res) => {
    try{
        const select = await database.buscarGastoTotal();
        return res.status(200).json(select);
    } catch (error){
        return res.status(400).json(error.message);
    }
}

const buscarDadosCadaMes = async (req, res) => {
    try{
        const select = await database.buscarDadosCadaMes();
        return res.status(200).json(select);
    } catch (error){
        return res.status(400).json(error.message);
    }
}

module.exports = {
    buscarDados,
    buscarKpi1,
    buscarIndicadores,
    buscarGastoMensal,
    buscarGastoTotal,
    buscarDadosCadaMes
}