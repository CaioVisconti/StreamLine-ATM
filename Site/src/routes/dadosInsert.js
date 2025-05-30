var express = require("express");
var router = express.Router();

var dados = [
    {
        maquina_id: NaN,
        dataHora: NaN,
        alertas: []
    }
]

router.get("/alerta/:id", (req, res) => {
    const id = Number(req.params.id);
    let response = "OOK";
    // console.log(id)


    if (req.body.fkAtm && id == 0) {
        let existe = false;
        let id_recebido = req.body.fkAtm;
        let data_recebida = req.body.dataHora;

        // console.log(id_recebido)
        // console.log(data_recebida)
        // let oi = req.body.alertas
        // console.log("to em", oi)


        dados.forEach((alertas) => {
            if (alertas.maquina_id == id_recebido) {
                // let teste = alertas.maquina_id;
                // console.log("to aqui", teste)
            // if (alertas.fkAtm == id_recebido) {
                existe = true;
                let registrosQtd = alertas.dados.length;
                if (registrosQtd == 7) {
                    alertas.dados.shift();
                }
                alertas.dados.push(req.body.alertas);

            }
        });

        if (!existe) {
            let dados_array = [];
            dados_array.push(req.body.alertas);
            dados.push({
                maquina_id: id_recebido,
                dataHora: data_recebida,
                dados: dados_array
            });
        }
    } else if (id != 0) {
        response = "No data";
        dados.forEach((dado) => {
            if (dado.maquina_id == id) {
                response = dado;
            }
        });
    }

    res.json(response);

});

router.get("/limpar/:id", (req, res) => {
    const id = Number(req.params.id);

    //  índice da máquina que eh pra limpar
    const indice = dados.findIndex((d) => d.maquina_id === id);

    if (indice !== -1) {
        // tira os antigos e deixa vazio
        dados[indice] = {
            maquina_id: NaN,
            dataHora: NaN,
            dados: [] 
        };

        res.json({ message: `Dados da máquina ${id} foram limpos.` });
    } else {
        res.json({ message: `Máquina ${id} não encontrada.` });
    }
});

// router.get("/limpar/:id", (req, res) => {
    
//     dados = [
//         {
//         maquina_id: NaN,
//         dataHora: NaN,
//         alertas: []
//         }
//     ]

//     res.json({"mesage": "dados-limpados"});

// });

// router.get("/limpar", (req, res) => {
    
//     dados = [
//         {
//         maquina_id: NaN,
//         dataHora: NaN,
//         alertas: []
//         }
//     ]

//     res.json({"mesage": "dados-limpados"});

// });

module.exports = router;
