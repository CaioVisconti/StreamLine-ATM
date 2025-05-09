var express = require("express");
var router = express.Router();

const path = require("path");

var dados = [
    {
        maquina_id: NaN,
        dados: []
    }
]

router.get("/monitoramento/:id", (req,res) => {
    
    const id = req.params.id
    
    let response = "OOK"
    //serve para diferenciar se o python esta mandando dados ou se eu qeuero visualizar os dados
    if(req.body.maquina && id == 0){
        // tem que verificar se ja existe o id da maquina no json global
        
        let existe = false;
        let id_recebido = req.body.maquina
        dados.forEach((dado) => {
            if(dado.maquina_id == id_recebido){
                existe = true
                let registrosQtd = dado.dados.length
                if(registrosQtd == 7){
                    dado.dados.shift()
                    
                }
                dado.dados.push(req.body.dados)
            }
        })
        if(!existe){
            let dados_array = []
            dados_array.push(req.body.dados)
            dados.push({
                maquina_id: id_recebido,
                dados: dados_array
            })
            // console.log(dados)
            
        }
        //se ja existir  verifica se ja passou do limite
            // se passou, limpa os dados e adiciona apenas o novo

            // se nao, faz o append
        
        //  da um append nos dados desse json 




        // dados['maquina'].push(req.body)
    }else if (id != 0){
        response = "No data"
        console.log("entrou web")
        dados.forEach((dado) => {
            if(dado.maquina_id == id){
                response = dado
            }
        })
    }
    res.json(response)
    
})

module.exports = router;