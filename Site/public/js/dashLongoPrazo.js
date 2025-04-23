function exibirAlertas(){
    let oi = document.querySelector(".organizar-compontentes");
    let dois = document.querySelector(".organizar");
    oi.style.display = "flex";
    dois.style.display = "none";

    let valorAlertaInput_kpi_cpu_disponivel;
    let valorAlertaInput_kpi_cpu_porcentagem;
    let valorAlertaInput_kpi_ram_disponivel;
    let valorAlertaInput_kpi_ram_porcentagem;
    let valorAlertaInput_kpi_disco_disponivel;
    let valorAlertaInput_kpi_disco_porcentagem;
    let valorAlertaInput_kpi_pacotes_disponivel;
    let valorAlertaInput_kpi_pacotes_porcentagem;

    const ctx = document.getElementById('meuGrafico2').getContext('2d');

    // Destroi o gráfico antigo se ele já existir
    if (window.meuGraficoInstance) {
        window.meuGraficoInstance.destroy();
    }

    // Criação do gráfico com linha de alerta (linha vermelha no 75)
    window.meuGraficoInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['CPUPercent', 'CPUFreq', 'RAMPercent', 'Processos', 'DISKPercent'],
            datasets: [{
                label: 'Número de alertas',
                data: [53, 80, 83, 70, 73],
                borderColor: 'rgb(126, 20, 255)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // ⬅️ Isso é essencial para o gráfico respeitar o CSS
            plugins: {
                legend: {
                    display: false 
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

    

function gerarGraficos(){
    let oi = document.querySelector(".organizar-compontentes");
    let dois = document.querySelector(".organizar");
    oi.style.display = "none";
    dois.style.display = "flex";

    const ctx = document.getElementById('meuGrafico').getContext('2d');

    // Destroi o gráfico antigo se ele já existir
    if (window.meuGraficoInstance) {
        window.meuGraficoInstance.destroy();
    }

    // Criação do gráfico com linha de alerta (linha vermelha no 75)
    window.meuGraficoInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['01/04', '02/04', '03/04', '04/04', '05/04', '06/04', '07/04'],
            datasets: [{
                label: 'Uso da CPU (%)',
                data: [53, 80, 83, 70, 73, 83, 70],
                borderColor: 'rgba(141, 52, 249, 1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, //  o gráfico respeita o CSS
            plugins: {
                legend: {
                    display: false 
                },
                annotation: {
                    annotations: {
                        linhaLimite: {
                            type: 'line',
                            yMin: 75,
                            yMax: 75,
                            borderColor: 'red',
                            borderWidth: 2
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}


function carregarATMS() {

    let nomeUsuario = sessionStorage.NOME_USUARIO;
    document.getElementById("nomeFunc").innerHTML = `Olá, ${nomeUsuario}`

    let fkAgencia = sessionStorage.ID_AGENCIA;

    fetch("/dashLongoPrazo/listarAtm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idAgenciaServer: fkAgencia
        })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json();
        } else {
            console.log("Erro ao buscar componentes.");
        }
    })
    .then(function (atm) {
        console.log("atm recebidos:", atm);

        var selectatm = document.getElementById("select_atm");
        var options = `<option disabled selected value="#">Selecione um ATM</option>;`;

        atm.forEach(function (atms) {
            options += `<option value="${atms.idAtm}">${atms.nome}</option>`;
        });

        selectatm.innerHTML = options;
        selectatm.disabled = false; // habilita o select
    })
    .catch(function (erro) {
        console.log("Erro no fetch dos atms:", erro);
    });
}


function carregarComponentes(){

    let fkAtm = document.getElementById("select_atm").value;

    fetch("/dashLongoPrazo/listarComponentes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idAtmServer: fkAtm
        })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json();
        } else {
            console.log("Erro ao buscar componentes.");
        }
    })
    .then(function (componente) {
        console.log("componente recebidos:", componente);

        var selectcomponente = document.getElementById("select_componentes");
        var buttonAlertas = document.getElementById("button_alertas");
        var options = `<option disabled selected value="#">Selecione um Componente</option>;`;

        componente.forEach(function (componentes) {
            options += `<option value="${componentes.nome}">${componentes.nome}</option>`;
        });

        selectcomponente.innerHTML = options;
        selectcomponente.disabled = false; // habilita o select
        buttonAlertas.disabled = false;
        buttonAlertas.style = "background-color: #2A5277;"
    })
    .catch(function (erro) {
        console.log("Erro no fetch dos componentes:", erro);
    });

}

function carregarMetricas(){
    let fkComponente = document.getElementById("select_componentes").value;
    let fkAtm = document.getElementById("select_atm").value;

    fetch("/dashLongoPrazo/listarMetricas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idComponenteServer: fkComponente,
            idAtmServer: fkAtm
        })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json();
        } else {
            console.log("Erro ao buscar componentes.");
        }
    })
    .then(function (metrica) {
        console.log("metrica recebidos:", metrica);

        var selectmetrica = document.getElementById("select_metricas");
        var options = `<option disabled selected value="#">Selecione uma Métrica</option>;`;

        metrica.forEach(function (metricas) {
            options += `<option value="${metricas.metricas}">${metricas.metricas}</option>`;
        });

        selectmetrica.innerHTML = options;
        selectmetrica.disabled = false; // habilita o select
    })
    .catch(function (erro) {
        console.log("Erro no fetch dos metricas:", erro);
    });

}