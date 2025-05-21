let qtdAtms;
const { pool } = require("../database/config");

function coletaVariavel() {
    fetch(`http://localhost:3333/validarAtm/atms/1`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(json => {
        qtdAtms = json[0]["count(idAtm)"];
        console.log("Quantidade de ATMs:", qtdAtms);

        for (let i = 1; i <= qtdAtms; i++) {
            const atmAtual = i;

            fetch(`http://localhost:3333/dadosInsert/alerta/${atmAtual}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(async res => {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return res.json();
                } else {
                    const text = await res.text();
                    throw new Error(text || "Resposta não JSON");
                }
            })
            .then(json => {
                if ( // valida estrutura do json
                    json && 
                    Array.isArray(json.dados) &&  // se é um array
                    json.dados.length > 0 && // se é maior que zero
                    Array.isArray(json.dados[json.dados.length - 1]) // verifica que o último item dentro do array dados é outro array.
                ) {
                    const ultimoRegistro = json.dados[json.dados.length - 1];
                    console.log(`--- Dados recebidos do ATM ${atmAtual} ---`);
                    ultimoRegistro.forEach(param => {
                        console.log(`${param.dataHora} | ${param.parametro}: ${param.valor} (Limite: ${param.limite})`);
                    
                        try {
                            pool.execute(  //db.execute retorna uma tupla com dois elementos [resultado dos dados, nome de colunas etc], por isso é um rows
                                "INSERT INTO alerta (valor, dtHoraAbertura, fkParametro) VALUES (?, NOW(), ?)",
                                [param.valor, param.fkParametro]
                            );
                            
                        } catch (error) {
                            console.error("Erro ao consultar o banco:", error);
                            res.status(500).json({ erro: "Erro interno do servidor" });
                        }
                        
                        
                    });

                } else {
                    console.warn(`Resposta inválida do ATM ${atmAtual}:`, json);
                }
            })
            .catch(error => {
                console.warn(`Resposta inválida do ATM ${atmAtual}: ${error.message}`);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao obter a quantidade de ATMs:', error);
    });
}


intervaloColeta = setInterval(coletaVariavel, 2000)
