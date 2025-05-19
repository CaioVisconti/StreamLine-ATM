const nomeUsuario = sessionStorage.NOME_USUARIO;

window.onload = async () => {
    porNoGrafico();
    carregarGraficos();
    buscarKpi();
    buscarIndicadores();
    buscarGastoMensal();
    buscarGastoTotal();
    document.getElementById("default").click()
    nomeFunc.innerHTML = nomeUsuario
}

function carregarGraficos() {
    const graficoPrevisao = document.getElementById('previsao');
    new Chart(graficoPrevisao, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
            datasets: [{
                data: [250, 230, 400, 320, 380, 369, 420],
                borderWidth: 1,
                borderColor: '#FFFFFF',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            backgroundColor: '#2A5277',
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Custo (R$)',
                        color: 'white',
                        font: {
                            size: 15
                        }
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    title: {
                        display: false,
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}
function mudarAba(event, nomeAba) {

    const conteudo = document.getElementsByClassName("container-grafico");
    for (let i = 0; i < conteudo.length; i++) {
        conteudo[i].style.display = "none";
    }

    const abas = document.getElementsByClassName("link-abas");
    for (let i = 0; i < abas.length; i++) {
        abas[i].id = ""
    }

    document.getElementById(nomeAba).style.display = 'flex';
    event.currentTarget.id += "atual"

}

function buscarKpi() {
    fetch("/aws/buscarKpi1", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        res.json().then((json) => {
            if (json[0].servico == "EC2 - Other") {
                json[0].servico = "EC2"
            }
            servicoMaisCaro.innerHTML = json[0].servico;
        })
    })
}

function buscarIndicadores() {
    fetch("/aws/buscarIndicadores", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        res.json().then((json) => {
            let custoTotal = 0
            for (let i = 0; i < json.length; i++) {
                custo[i].innerHTML += json[i].custo.toFixed(2)
                custoTotal += json[i].custo
                if (json[i].servico == "EC2 - Other") {
                    json[i].servico = "Amazon EC2"
                }
                if (json[i].servico == "Amazon Simple Storage Service") {
                    json[i].servico = "Amazon S3"
                }
                servico[i].innerHTML += json[i].servico
            }
            gastoTotalSemana.innerHTML += custoTotal.toFixed(2);
        })
    })
}

function buscarGastoMensal() {
    fetch("/aws/buscarGastoMensal", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        res.json().then((json) => {
            console.log(json)
            gastoMensal.innerHTML += json[0].gastoMensal.toFixed(2)
        })
    })
}
function buscarGastoTotal() {
    fetch("/aws/buscarGastoTotal", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        res.json().then((json) => {
            console.log("AAAAA", json)
            gastoTotal.innerHTML += json[0].gastoTotal.toFixed(2)
        })
    })
}

function porNoGrafico() {
    const dadosServicos = []
    const dadosCusto = []
    fetch("/aws/buscarDados", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        res.json().then((json) => {
            for (let i = 0; i < json.length; i++) {
                if (json[i].servico == "Amazon Simple Storage Service") {
                    json[i].servico = "S3"
                }
                if (json[i].servico == "EC2 - Other") {
                    json[i].servico = "EC2"
                }
                dadosServicos.push(json[i].servico)
                dadosCusto.push(json[i].custo)
            }

            const graficoTotal = document.getElementById('graficoTotal');
            new Chart(graficoTotal, {
                type: 'bar',
                data: {
                    labels: dadosServicos,
                    datasets: [{
                        data: dadosCusto,
                        borderWidth: 1
                    }]
                },
                options: {
                    backgroundColor: '#2A5277',
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Custo (R$)',
                                color: 'white',
                                font: {
                                    size: 15
                                }
                            },
                            ticks: {
                                color: 'white'
                            }
                        },
                        x: {
                            title: {
                                display: false,
                            },
                            ticks: {
                                color: 'white'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        })
    })

    return [dadosCusto, dadosServicos]
}