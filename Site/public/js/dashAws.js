const nomeUsuario = sessionStorage.NOME_USUARIO;

window.onload = async () => {
    plotarDadosNoGrafico();
    plotarDadosMensais();
    buscarKpi();
    buscarIndicadores();
    buscarGastoMensal();
    buscarGastoTotal();
    document.getElementById("default").click();
    nomeFunc.innerHTML = nomeUsuario;
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
    fetch("/aws/buscarGastoCadaMes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        res.json().then((json) => {
            if (json.length > 1) {
                gastoMesAtual = json[json.length - 1].gastoMensal
                gastoMesAnterior = json[json.length - 2].gastoMensal
                if (gastoMesAnterior >= 1) {
                    comparacao = ((gastoMesAtual - gastoMesAnterior) / gastoMesAnterior) * 100
                    mensagem = "a menos"
                    if (comparacao > 0) {
                        mensagem = "a mais"
                    }
                    kpiIndicador.innerHTML += `<span>${Math.abs(comparacao).toFixed(2)}% ${mensagem} que no mês anterior`
                }
            }
        })
    })
}

function carregarGraficoServico() {
    if (servicoAtual == "ec2") {
        graficoModal.innerHTML = `<div class="container-servicos" id="indicadores_modal">
        <div class="listagem-modal">
                            <div class="gasto-coluna">
                                <span>Nome</span>
                                <div class="valor-servico">
                                </div>
                            </div>
                            <div class="gasto-coluna">
                                <span>Tipo</span>
                            </div>
                            <div class="gasto-coluna">
                                <span>Status</span>
                            </div>
                        </div>
                        </div>`
    }

    if (servicoAtual == "s3") {
        graficoModal.innerHTML = ``
    }

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
            for (let i = 0; i < json.selectMensal.length; i++) {
                if (json.select[i] == null) {
                    const custoKey = '{"custo": 0.00}';
                    json.select[i] = JSON.parse(custoKey)
                }
                custoTotal += json.select[i].custo
                if (json.selectMensal[i].servico == "EC2 - Other") {
                    json.selectMensal[i].servico = "EC2"
                }
                if (json.selectMensal[i].servico == "Amazon Simple Storage Service") {
                    json.selectMensal[i].servico = "S3"
                }
                if (json.selectMensal[i].servico == "AmazonCloudWatch") {
                    json.selectMensal[i].servico = "CloudWatch"
                }

                indicadores.innerHTML += `<div class="valores-servicos">
                            <div class="servico-coluna">
                                <span>${json.selectMensal[i].servico}</span>
                            </div>
                            <div class="gasto-coluna">
                                <span>R$${json.select[i].custo.toFixed(2)}</span>
                            </div>
                            <div class="gasto-coluna">
                                <span>R$${json.selectMensal[i].custo.toFixed(2)}</span>
                            </div>
                            <div class="gasto-coluna">
                                <button onclick="mostrarModalServico(servico='${json.selectMensal[i].servico}')">Ver detalhes</button>
                            </div>
                        </div>`
            }
            gastoTotalSemana.innerHTML += custoTotal.toFixed(2);
        })
    })
}

let servicoAtual = null

function mostrarModalServico(servico) {
    let modal = document.querySelector(".modalServico");
    servicoAtual = servico.toLowerCase()
    if (servico == "EC2") {
        servico = "Instâncias EC2"
        modal_kpi1.innerHTML = "<span>Instâncias Ativas</span>"
        modal_kpi2.innerHTML = "Total de Instâncias"
        modal_kpi3.innerHTML = ""
    }
    if (servico == "S3") {
        servico = "Amazon S3"
        modal_kpi1.innerHTML = ""
        modal_kpi2.innerHTML = "Objetos Totais"
        modal_kpi3.innerHTML = "Quantidade de Buckets"
    }
    if (servico == "AWS Lambda") {
        servico = "Amazon Lambda"
        modal_kpi1.innerHTML = "Lambda"
        modal_kpi2.innerHTML = ""
        modal_kpi3.innerHTML = ""
    }
    if (servico == "CloudWatch") {
        modal_kpi1.innerHTML = "CloudWatch"
        modal_kpi2.innerHTML = ""
        modal_kpi3.innerHTML = ""

    }

    titulo_modal.innerHTML = servico
    if (modal.style.display == "none") {
        modal.style.display = "block"
        buscarDadosServicos()
        carregarGraficoServico()
    } else {
        modal.style.display = "none"
    }

}

function carregarDadosEc2(json) {
    let instanciasAtivas = 0
    let totalInstancias = 0
    for (let i = 0; i < json[servicoAtual].length; i++) {
        let corFonte = "#ff5d5d"
        let corFundo = "#400000"

        if (json[servicoAtual][i].status !== "stopped") {
            corFundo = "#104000"
            corFonte = "#5dff73"
            instanciasAtivas++
        }

        totalInstancias++

        indicadores_modal.innerHTML += `<div class="valores-servicos">
                            <div class="modal-coluna">
                                <span>${json[servicoAtual][i].nome}</span>
                            </div>
                            <div class="modal-coluna">
                                <span>${json[servicoAtual][i].tipo}</span>
                            </div>
                            <div class="modal-coluna">
                                <span id="status" style="color: ${corFonte}; background-color: ${corFundo}">${json[servicoAtual][i].status}</span>
                            </div>
                        </div>`
    }

    if (servicoAtual == "ec2") {
        valor_kpi1.innerHTML = instanciasAtivas
        valor_kpi2.innerHTML = totalInstancias
        valor_kpi3.innerHTML = instanciasAtivas
    }
}

function carregarDadosS3(json) {
    let totalObjs = 0
    let totalBuckets = 0
    for (let i = 0; i < json[servicoAtual].length; i++) {
        totalBuckets++
        totalObjs += json[servicoAtual][i].quantidadeArquivos
    }

    if (servicoAtual == "s3") {
        // valor_kpi1.innerHTML 
        valor_kpi2.innerHTML = totalBuckets
        valor_kpi3.innerHTML = totalObjs
    }


}

function buscarDadosServicos() {
    fetch("/aws/buscarDetalhesAws", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        res.json().then((json) => {
            carregarGraficoServico()
            if(servicoAtual == "ec2"){
                carregarDadosEc2(json)
            }
            if(servicoAtual == "s3"){
                carregarDadosS3(json)
            }

        })
    }).catch((erro) => console.error(erro))
}


function buscarGastoMensal() {
    fetch("/aws/buscarGastoMensal", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        res.json().then((json) => {
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