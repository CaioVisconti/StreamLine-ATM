const nomeUsuario = sessionStorage.NOME_USUARIO;

window.onload = async () => {
    plotarDadosNoGrafico();
    plotarDadosMensais();
    buscarKpi();
    buscarIndicadores();
    buscarGastoMensal();
    buscarGastoTotal();
    document.getElementById("default").click()
    nomeFunc.innerHTML = nomeUsuario
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
            let porcentagem = 0;
            if (json[0].servico == "EC2 - Other") {
                json[0].servico = "EC2"
            }
            porcentagem = (json[0].custoServico / json[0].custoTotal) * 100
            servicoMaisCaro.innerHTML = `${json[0].servico}`;
            kpiServico.innerHTML += `<span style="color: #87C5FF">${porcentagem.toFixed(2)}% do gasto total</span>`
        })
    })
    fetch("/aws/buscarGastoCadaMes",{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        res.json().then((json) => {
            if(json.length > 1){
                gastoMesAtual = json[json.length - 1].gastoMensal
                gastoMesAnterior = json[json.length - 2].gastoMensal
                comparacao = ((gastoMesAtual - gastoMesAnterior) / gastoMesAnterior) * 100
                mensagem = "a menos"
                console.log(comparacao.toFixed(2))
                if(comparacao > 0){
                    mensagem = "a mais"

                }
                kpiIndicador.innerHTML += `<span>${Math.abs(comparacao).toFixed(2)}% ${mensagem} que no mês anterior`
            }
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
                custoTotal += json[i].custo
                if (json[i].servico == "EC2 - Other") {
                    json[i].servico = "Amazon EC2"
                }
                if (json[i].servico == "Amazon Simple Storage Service") {
                    json[i].servico = "Amazon S3"
                }
                if (json[i].servico == "AmazonCloudWatch") {
                    json[i].servico = "Amazon Cloud Watch"
                }
                indicadores.innerHTML += `<div class="coluna-servicos">
                                <div class="circulo-indicador">
                                    <span id="custo">R$${json[i].custo.toFixed(2)}</span>
                                </div>
                                <div class="rotulo-indicador">
                                    <span id="servico">${json[i].servico}</span>
                                </div>
                            </div>`
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

function plotarDadosNoGrafico() {
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
                if (json[i].servico == "AWS Lambda") {
                    json[i].servico = "Lambda"
                }
                if (json[i].servico == "AmazonCloudWatch") {
                    json[i].servico = "Amazon Cloud Watch"
                }
                dadosServicos.push(json[i].servico)
                dadosCusto.push(json[i].custo.toFixed(2))
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
}

function plotarDadosMensais() {
    const gastoMensal = []
    const mes = []
    fetch("/aws/buscarGastoCadaMes", {
        method: "GET",
        headers: {
            "Content-Type": "Application/json"
        }
    }).then((res) => {
        res.json().then((json) => {
            for (var i = 0; i < json.length; i++) {
                gastoMensal.push(json[i].gastoMensal.toFixed(2))
                mes.push(json[i].mes)
            }

            const graficoPrevisao = document.getElementById('previsao');
            new Chart(graficoPrevisao, {
                type: 'bar',
                data: {
                    labels: mes,
                    datasets: [{
                        data: gastoMensal,
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
        })
    })
}