let qtdAtms;
const { pool } = require("../database/config");

function coletaDados() {
    fetch("http://localhost:3333/validarAtm/atms/1")
        .then(res => res.json())
        .then(dados => {
            qtdAtms = dados[0]["count(idAtm)"];
            console.log("Quantidade de ATMs:", qtdAtms);

            for (let i = 1; i <= qtdAtms; i++) {
                const idAtm = i;
                // console.log(`Buscando dados do ATM ${idAtm}`);

                fetch(`http://localhost:3333/tempoReal/monitoramento/${idAtm}`)
                    .then(res => res.json())
                    .then(json => {
                        const capturas = json.dados;
                            if (!capturas || !Array.isArray(capturas)) {
        console.warn(`Dados inválidos para ATM ${idAtm}:`, capturas);
        return;
    }
                        console.log(`Capturas recebidas do ATM ${idAtm}:`, capturas.length);

                        if (Array.isArray(capturas)) {
                            capturas.forEach(captura => {
                                const dataHora = captura.dataHora;
                                // console.log(`Captura dataHora: ${dataHora}`);

                                for (let chave in captura) {
                                    if (
                                        chave !== "dataHora" &&
                                        chave !== "fkAtm" &&
                                        !chave.startsWith("limite") &&
                                        !chave.startsWith("alerta") &&
                                        !chave.startsWith("fkParametro")
                                    ) {
                                        const nomeParametro = chave;
                                        const valor = captura[nomeParametro];
                                        const limite = captura[`limite ${nomeParametro}`];
                                        const fkParametro = captura[`fkParametro ${nomeParametro}`];

                                        if (fkParametro === undefined || valor === undefined) {
                                            console.warn(`⚠️ Parâmetro inválido: ${nomeParametro}, fkParametro=${fkParametro}, valor=${valor}`);
                                            continue;
                                        }

                                        // console.log(`Inserindo: parametro=${nomeParametro}, valor=${valor}, dataHora=${dataHora}, fkParametro=${fkParametro}`);

                                        pool.execute(
                                            "INSERT INTO captura (valor, dtHora, fkParametro) VALUES (?, ?, ?)",
                                            [valor, dataHora, fkParametro]
                                        ).catch(error => {
                                            if (error.code !== 'ER_DUP_ENTRY') {
                                                // console.error("Erro ao inserir:", error);
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            console.warn(`Dados do ATM ${idAtm} não são um array`);
                        }
                    })
                    .catch(error => {
                        console.error(`Erro ao buscar dados do ATM ${idAtm}:`, error);
                    });
            }
        })
        .catch(error => {
            console.error('Erro ao obter quantidade de ATMs:', error);
        });
}

// Executar a cada 5 segundos
setInterval(coletaDados, 5000);
