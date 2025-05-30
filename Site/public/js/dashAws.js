const nomeUsuario = sessionStorage.NOME_USUARIO;

window.onload = async () => {
    plotarDadosNoGrafico();
    plotarDadosMensais();
    buscarKpi();
    buscarIndicadores();
    buscarGastoMensal();
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
let gastoMensalEc2 = 0
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
            let cor = "white"
            if (json.length > 1) {
                gastoMesAtual = json[json.length - 1].gastoMensal
                gastoMesAnterior = json[json.length - 2].gastoMensal
                gastoMensalEc2 = "R$" + gastoMesAtual.toFixed(2)
                if (gastoMesAnterior >= 1) {
                    comparacao = ((gastoMesAtual - gastoMesAnterior) / gastoMesAnterior) * 100
                    mensagem = "a menos"
                    if (comparacao > 0) {
                        mensagem = "a mais"
                    }
                    if ((gastoMesAtual - gastoMesAnterior) > 100) {
                        cor = "#ff5d5d"
                    }
                    kpiIndicador.innerHTML += `<span>${Math.abs(comparacao).toFixed(2)}% ${mensagem} que no mês anterior`

                    indicadores_custos.innerHTML += `<div class="valores-servicos">
                            <div class="modal-coluna">
                                <span>R$${gastoMesAtual.toFixed(2)}</span>
                            </div>
                            <div class="modal-coluna">
                                <span>R$${gastoMesAnterior.toFixed(2)}</span>
                            </div>
                            <div class="modal-coluna">
                                <span style="color: ${cor}">R$${(gastoMesAtual - gastoMesAnterior).toFixed(2)} ${mensagem} que no mês anterior</span>
                            </div>
                            </div>`

                }
            }
        })
    })
}

function carregarGraficoServico() {
    let titulo1 = "Nome";
    let titulo2 = "Tipo";
    let titulo3 = "Status";
    if (servicoAtual == "s3") {
        titulo1 = "Nome";
        titulo2 = "Armazenamento Usado";
        titulo3 = "% do total";
    }
    if (servicoAtual == "lambda") {
        titulo1 = "Nome";
        titulo2 = "Linguagem";
        titulo3 = "Timeout";
    }
    graficoModal.innerHTML = `<div class="container-servicos" id="indicadores_modal">
    <div class="listagem-modal" id="listagem_modal">
    <div class="gasto-coluna">
    <span>${titulo1}</span>
    <div class="valor-servico">
    </div>
    </div>
    <div class="gasto-coluna">
    <span>${titulo2}</span>
    </div>
    <div class="gasto-coluna">
    <span>${titulo3}</span>
    </div>
    </div>
    </div>`
    if (servicoAtual == "lambda") {
        listagem_modal.innerHTML += `<div class="gasto-coluna">
                                <span>Memória Usada</span>
                            </div>`
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
            let comparacao = 0
            let porcentagem = 0
            console.log(json)
            console.log(json.selectSemanaAnterior)
            for (let i = 0; i < json.selectMensal.length; i++) {
                comparacao = ((json.select[i].custo - json.selectSemanaAnterior[i].custo) / json.selectSemanaAnterior[i].custo) * 100
                console.log(json.selectMensal[i])
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
                if (json.selectMensal[i].servico == "AWS Lambda") {
                    json.selectMensal[i].servico = "Lambda"
                }

                indicadores.innerHTML += `<div class="valores-servicos">
                            <div class="servico-coluna">
                                <span>${json.selectMensal[i].servico}</span>
                            </div>
                            <div class="gasto-coluna">
                                <span>R$${json.select[i].custo.toFixed(2)}</span>
                            </div>
                            <div class="gasto-coluna">
                                <span>R$${json.selectSemanaAnterior[i].custo.toFixed(2)}</span>
                            </div>
                            <div class="gasto-coluna">
                            <button onclick="mostrarModalServico(servico='${json.selectMensal[i].servico}')">Ver detalhes</button>
                            </div>
                            </div>`
            }
            gastoTotal.innerHTML += custoTotal.toFixed(2);
            // kpiSemana.innerHTML += `<span>${Math.abs(comparacao).toFixed(2)}% ${mensagem} que no mês anterior</span>`
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
        modal_kpi3.innerHTML = "Gasto Mensal EC2"
        document.getElementById("container_custos").style.display = "block"
    }
    if (servico == "S3") {
        servico = "Amazon S3"
        modal_kpi1.innerHTML = "Quantidade de Buckets"
        modal_kpi2.innerHTML = "Objetos Totais"
        modal_kpi3.innerHTML = "Tamanho Total"
        document.getElementById("container_custos").style.display = "none"
    }
    if (servico == "Lambda") {
        servico = "Lambda"
        modal_kpi1.innerHTML = "Quantidade de Funções"
        modal_kpi2.innerHTML = "Armazenamento de Código"
        modal_kpi3.innerHTML = ""
        document.getElementById("container_custos").style.display = "none"
    }
    if (servico == "CloudWatch") {
        modal_kpi1.innerHTML = "CloudWatch"
        modal_kpi2.innerHTML = ""
        modal_kpi3.innerHTML = ""
        document.getElementById("container_custos").style.display = "none"

    }

    titulo_modal.innerHTML = servico
    if (modal.style.display == "none") {
        modal.style.display = "block"
        buscarDadosServicos()
        carregarGraficoServico()
        setInterval(() => {
            buscarDadosServicos()
        }, 3000)
    } else {
        modal.style.display = "none"
    }

}

function descreverTiposInstancias() {
    tipos = []
    t2micro = {
        "vcpus": 1,
        "ram": 1,
        "preco": 0.0116
    }
    t2small = {
        "vcpus": 1,
        "ram": 2,
        "preco": 0.023
    }
    t2medium = {
        "vcpu": 2,
        "ram": 4,
        "preco": 0.0464
    }

    tipos["t2.micro"] = t2micro
    tipos["t2.small"] = t2small
    tipos["t2.medium"] = t2medium

    return tipos
}

function carregarDadosEc2(json) {
    let instanciasAtivas = 0
    let totalInstancias = 0
    let instancias = descreverTiposInstancias()
    for (let i = 0; i < json[servicoAtual].length; i++) {
        let tamanho = 50
        let corFonte = "#ff5d5d"
        let corFundo = "#400000"
        let tipoInstancia = String(json[servicoAtual][i].tipo)
        if (json[servicoAtual][i].status == "shutting-down") {
            tamanho = 70
        }

        if (json[servicoAtual][i].status == "running") {
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
                                <span id="status" style="color: ${corFonte}; background-color: ${corFundo}; width: ${tamanho}%">${json[servicoAtual][i].status}</span>
                            </div>
                        </div>`

    }

    if (servicoAtual == "ec2") {
        valor_kpi1.innerHTML = instanciasAtivas
        valor_kpi2.innerHTML = totalInstancias
        valor_kpi3.innerHTML = gastoMensalEc2

    }
}

function carregarDadosS3(json) {
    let totalObjs = 0
    let totalBuckets = 0
    let tamanhoTotal = 0
    let porcentagem = 0
    for (let i = 0; i < json[servicoAtual].length; i++) {
        tamanhoTotal += json[servicoAtual][i].tamanhoBucket
    }
    for (let i = 0; i < json[servicoAtual].length; i++) {
        porcentagem = json[servicoAtual][i].tamanhoBucket / tamanhoTotal * 100
        totalBuckets++
        totalObjs += json[servicoAtual][i].quantidadeArquivos

        indicadores_modal.innerHTML += `<div class="valores-servicos">
        <div class="modal-coluna">
                                <span>${json[servicoAtual][i].nome}</span>
                            </div>
                            <div class="modal-coluna">
                            <span>${json[servicoAtual][i].tamanhoBucket}KB</span>
                            </div>
                            <div class="modal-coluna">
                            <span id="status">${porcentagem.toFixed(2)}%</span>
                            </div>
                            </div>`
    }

    if (servicoAtual == "s3") {
        valor_kpi1.innerHTML = totalBuckets
        valor_kpi2.innerHTML = totalObjs
        valor_kpi3.innerHTML = tamanhoTotal + "KB"
    }


}

function carregarDadosLambda(json) {
    let qtdFuncoes = 0
    let tamanhoCodigo = 0
    for (let i = 0; i < json[servicoAtual].length; i++) {
        qtdFuncoes++;
        tamanhoCodigo += json[servicoAtual][i].tamanhoCodigo
        indicadores_modal.innerHTML += `<div class="valores-servicos">
        <div class="modal-coluna">
                                <span>${json[servicoAtual][i].nomeFuncao}</span>
                            </div>
                            <div class="modal-coluna">
                            <span>${json[servicoAtual][i].linguagem}</span>
                            </div>
                            <div class="modal-coluna">
                            <span id="status">${json[servicoAtual][i].timeout}</span>
                            </div>
                            <div class="modal-coluna">
                            <span id="status">${json[servicoAtual][i].memoria}</span>
                            </div>
                            </div>`
    }

    if (servicoAtual == "lambda") {
        valor_kpi1.innerHTML = qtdFuncoes
        valor_kpi2.innerHTML = tamanhoCodigo
        valor_kpi3.innerHTML = tamanhoTotal + "KB"
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
            if (servicoAtual == "ec2") {
                carregarDadosEc2(json)
            }
            if (servicoAtual == "s3") {
                carregarDadosS3(json)
            }
            if (servicoAtual == "lambda") {
                carregarDadosLambda(json)
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