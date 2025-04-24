const database = require("../models/empresaModel");

const mostrarEmpresas = async (req, res) => {
    try{
        const select = await database.mostrarEmpresas();
        if(!select){
            return res.status(400).send("Não há nenhuma empresa cadastrada no sistema!");
        }
        console.log("to aqui")
        return res.status(200).json(select);
    } catch (error){
        return res.status(500).json(error.message);
    }
}

const cadastrarEmpresas = async (req, res) => {
    try{
        var codigoEmpresa = req.body.codigoServer;
        var cnpj = req.body.cnpjServer;
        var nome = req.body.nomeServer;


        console.log("dados recebidos", [codigoEmpresa, cnpj, nome])
        
        await database.cadastrarEmpresas(codigoEmpresa, cnpj, nome);
        return res.status(201).json({ mensagem: "Empresa cadastrada com sucesso!" });
    } catch (error) {
        console.error("Erro completo:", error);
        return res.status(400).json(error.message);
    }
}


const kpiParceiras = async (req, res) => {
    try{
        const select = await database.kpiParceiras();
        if(!select){
            return res.status(400).send("Não há nenhuma empresa cadastrada no sistema!");
        }
        console.log("to aqui")
        return res.status(200).json(select);
    } catch (error){
        return res.status(500).json(error.message);
    }
}

const deletarEmpresa = async (req, res) => {
    try{
        const idEmpresa = req.params.idEmpresa;
        console.log(req.params)

        console.log(idEmpresa)

        await database.deletarEmpresa(idEmpresa);
        return res.status(200).send("Empresa deletada com sucesso!");
    } catch (error) {
        console.log("Erro", error)
        return res.status(400).json(error.message)
    }
}

const mostrarEmpresasSearch = async (req, res) => {
    // try{
    //     let pesquisa = req.params.pesquisa;
    //     console.log(req.params.pesquisa)

    //     await database.mostrarEmpresasSearch(pesquisa);
    //     return res.status(200).send("Empresa não encontrada!");
    // } catch (error) {
    //     console.log("Erro", error)
    //     return res.status(400).json(error.message)
    // }
    let pesquisa = req.params.pesquisa;

    database.mostrarEmpresasSearch(pesquisa)
    .then((resultado) => {
        res.json({
            lista: resultado
        })
    })
    .catch(erro => {
        console.error("Erro na filtragem:", erro);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    mostrarEmpresas,
    cadastrarEmpresas,
    kpiParceiras,
    deletarEmpresa,
    mostrarEmpresasSearch
}