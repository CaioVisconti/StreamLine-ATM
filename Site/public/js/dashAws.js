
const nomeUsuario = sessionStorage.NOME_USUARIO;

window.onload = async () => {
    plotarDadosNoGrafico();
    plotarDadosMensais();
    buscarKpi();
    buscarIndicadores();
    buscarGastoMensal();
    buscarCustoPorServico();
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

let servicoAtual = null

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
            kpiServico.innerHTML += `<span style="color:rgb(169, 213, 255); font-size: 15px">${porcentagem.toFixed(2)}% do gasto total</span>`
        })
    })
    fetch("/aws/buscarGastoTotalPorMes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        res.json().then((json) => {
            let cor = "white"
            console.log(json)
            if (json.length > 1) {
                gastoMesAtual = json[json.length - 1].custo
                console.log(gastoMesAtual)
                gastoMesAnterior = json[json.length - 2].custo
                console.log(gastoMesAnterior)
                if (gastoMesAnterior > 1) {
                    comparacao = ((gastoMesAtual - gastoMesAnterior) / gastoMesAnterior) * 100
                    console.log(comparacao)
                    mensagem = "a menos"
                    if (comparacao > 0) {
                        mensagem = "a mais"
                    }
                    if ((gastoMesAtual - gastoMesAnterior) > 100) {
                        cor = "#ff0000"
                    }
                    kpiIndicador.innerHTML += `<span style="color:rgb(169, 213, 255); font-size: 15px">${Math.abs(comparacao).toFixed(2)}% ${mensagem} que no mês anterior`
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
            let cor = "white"
            for (let i = 0; i < json.select.length; i++) {
                comparacao = ((json.select[i].custo - json.selectSemanaAnterior[i].custo) / json.selectSemanaAnterior[i].custo) * 100
                gasto = json.select[i].custo
                if (json.selectSemanaAnterior[i] == null) {
                    const custoKey = '{"custo": 0.00}';
                    json.selectSemanaAnterior[i] = JSON.parse(custoKey)
                }
                custoTotal += json.select[i].custo
                if (json.select[i].servico == "EC2 - Other") {
                    json.select[i].servico = "EC2"
                }
                if (json.select[i].servico == "Amazon Simple Storage Service") {
                    json.select[i].servico = "S3"
                }
                if (json.select[i].servico == "AmazonCloudWatch") {
                    json.select[i].servico = "CloudWatch"
                }
                if (json.select[i].servico == "AWS Lambda") {
                    json.select[i].servico = "Lambda"
                }
                if (json.select[i].servico == "Lambda" || json.select[i].servico == "EC2" || json.select[i].servico == "S3") {
                    if ((json.select[i].custo - json.selectSemanaAnterior[i].custo) > 50) {
                        cor = "#FF4444"
                    } else if ((json.select[i].custo - json.selectSemanaAnterior[i].custo) < 1) {
                        cor = "#00FF88"
                    }

                    indicadores.innerHTML += `<div class="valores-servicos">
                    <div class="servico-coluna">
                    <span>${json.select[i].servico}</span>
                    </div>
                    <div class="gasto-coluna">
                    <span style="color: ${cor}">R$${json.select[i].custo.toFixed(2)}</span>
                    </div>
                    <div class="gasto-coluna">
                    <span>R$${json.selectSemanaAnterior[i].custo.toFixed(2)}</span>
                    </div>
                    <div class="gasto-coluna">
                    <button onclick="mostrarModalServico(servico='${json.select[i].servico}')">Ver detalhes</button>
                    </div>
                    </div>`
                }
            }
            gastoTotal.innerHTML += custoTotal.toFixed(2);
            // kpiSemana.innerHTML += `<span>${Math.abs(comparacao).toFixed(2)}% ${mensagem} que no mês anterior</span>`
        })
    })
}

function fecharModal() {
    let modal = document.querySelector(".modalServico");
    modal.style.display = 'none'
}

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
        modal_kpi3.innerHTML = "Gasto do Último Mês"
        document.getElementById("container_custos").style.display = "none"
    }

    titulo.innerHTML = servico
    if (modal.style.display == "none") {
        modal.style.display = "block"
        buscarDadosServicos()
        carregarGraficoServico()
        setInterval(() => {
            buscarDadosServicos()
        }, 1000)
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

let gastoEc2 = 0
let gastoLambda = 0
function buscarCustoPorServico() {
    fetch("/aws/buscarDadosPorServico", {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    }).then((res => {
        res.json().then((json => {
            let cor = "white"
            for (let i = 0; i < json.select.length; i++) {
                if (json.select[i] == null) {
                    const custoKey = '{"custo": 0.00}';
                    json.select[i] = JSON.parse(custoKey)
                }
                if (json.selectMesAnterior[i] == null) {
                    const custoKey = '{"custo": 0.00}';
                    json.selectMesAnterior[i] = JSON.parse(custoKey)
                }
                if (json.select[i].servico == "EC2 - Other") {
                    gastoEc2 = json.select[i].custo
                    gastoEc2MesAnterior = json.selectMesAnterior[i].custo
                }
                if (json.select[i].servico == "AWS Lambda") {
                    gastoLambda = json.select[i].custo
                }
            }
            let mensagem = "a mais"
            if (gastoEc2 < gastoEc2MesAnterior) {
                mensagem = "a menos"
            }
            if ((gastoEc2 - gastoEc2MesAnterior) > 50) {
                cor = "#FF4444"
            }
            if ((gastoEc2 - gastoEc2MesAnterior) < 0) {
                cor = "#00FF88"
            }
            indicadores_custos.innerHTML += `<div class="valores-servicos">
                            <div class="modal-coluna">
                                <span>R$${gastoEc2.toFixed(2)}</span>
                            </div>
                            <div class="modal-coluna">
                                <span>R$${gastoEc2MesAnterior.toFixed(2)}</span>
                            </div>
                            <div class="modal-coluna">
                                <span style="color: ${cor}">R$${(gastoEc2 - gastoEc2MesAnterior).toFixed(2)} ${mensagem} que no mês anterior</span>
                            </div>
                            </div>`
        }))
    }))
}

function carregarDadosEc2(json) {
    let instanciasAtivas = 0
    let totalInstancias = 0
    for (let i = 0; i < json[servicoAtual].length; i++) {
        totalInstancias++
        let tamanho = 50
        let corFonte = "#FF4D4D"
        let corFundo = "#330000"
        if (json[servicoAtual][i].status == "shutting-down") {
            tamanho = 70
        }
        if (json[servicoAtual][i].status == "running") {
            corFundo = "#003320"
            corFonte = "#00FF88"
            instanciasAtivas++
        }

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
        valor_kpi3.innerHTML = "R$" + gastoEc2.toFixed(2)
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
        valor_kpi2.innerHTML = tamanhoCodigo + "KB"
        valor_kpi3.innerHTML = "R$" + gastoLambda.toFixed(2)
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
            if (json.length == 0) {
                gastoMensal.innerHTML = "Sem Dados Para Este Mês!"
            }
            console.log("AAA", json[0])
            gastoMensal.innerHTML += json[0].gastoMensal.toFixed(2)
            gastoTotalSemana.innerHTML += (json[0].gastoMensal / 30).toFixed(2)
        })
    })
}

function calcularMMP() {
    const dados = []
    const mmp = []
    fetch("/aws/buscarMMP", {
        method: "GET"
    }).then((res) => {
        res.json().then((json) => {
            console.log("MMP", json)
            for (let i = 0; i < json.length; i++) {
                const servico = json[i].servico;
                if (!dados[servico]) {
                    dados[servico] = []
                }
                dados[servico].push({
                    mes: json[i].mes,
                    custo: json[i].custo
                })

            }
            for (let servico in dados) {
                const custos = []

                for (let i = 0; i < dados[servico].length; i++) {
                    custos.push(dados[servico][i].custo)
                }

                if (custos.length >= 3) {
                    let calculo = ((custos[custos.length - 1] * 3 + custos[custos.length - 2] * 2 + custos[custos.length - 3] * 1) / 6).toFixed(2)
                    mmp.push({
                        servico: servico,
                        respostaMmp: calculo
                    })
                }
            }
        })
    })
    return mmp
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


async function plotarDadosMensais() {
    const meses = []
    const servico = []
    const dataset = []
    const mmpRetornado = await calcularMMP()
    let custoTotal = 0
    let custoTotalMesAnterior = 0
    let porcentagemValorTotal = 0
    const coresServico = {
        "AWS Lambda": "#ffc987",
        "AmazonCloudWatch": "#ff87d1",
        "EC2 - Other": "#87C5FF",
        "Amazon Simple Storage Service": "#87ffab"
    }
    fetch("/aws/buscarGastoCadaMes", {
        method: "GET",
        headers: {
            "Content-Type": "Application/json"
        }
    }).then((res) => {
        res.json().then((json) => {
            let comparacao = 0
            let porcentagem = 0
            let mensagem = "\\002191"
            let mensagemValorTotal = "\\002191"
            let cor = "#FF4D4D"
            let corValorTotal = "#FF4D4D"
            for (var i = 0; i < json.select.length; i++) {
                if (!meses.includes(json.select[i].mes)) {
                    meses.push(json.select[i].mes)
                }
                if (!servico.includes(json.select[i].servico)) {
                    servico.push(json.select[i].servico)
                }

            }
            for (let i = 0; i < servico.length; i++) {
                const gastoMensal = []
                const servicoAtual = servico[i]

                for (let j = 0; j < meses.length; j++) {
                    const mesAtual = meses[j]
                    let custoAtual = 0

                    for (let k = 0; k < json.select.length; k++) {
                        if (json.select[k].servico == servicoAtual && json.select[k].mes == mesAtual) {
                            custoAtual = json.select[k].custo
                            break;
                        }
                    }
                    gastoMensal.push(custoAtual)
                }
                leituraDataset = {
                    label: servicoAtual,
                    data: gastoMensal,
                    backgroundColor: coresServico[servicoAtual] || '#2A5277',
                }
                dataset.push(leituraDataset)
            }
            for (let i = 0; i < mmpRetornado.length; i++) {
                const servicoMmp = mmpRetornado[i].servico
                const custoMmp = mmpRetornado[i].respostaMmp
                let servicoPlotado = ""
                custoTotal += Number(custoMmp)
                for (let j = 0; j < dataset.length; j++) {
                    if (dataset[j].label == servicoMmp) {
                        dataset[j].data.push(custoMmp)
                        break;
                    }
                }

                for(let j = 0; j < json.selectIndividuais.length; j++){
                    custoTotalMesAnterior += json.selectIndividuais[i].custo
                    if(json.selectIndividuais[j].servico == servicoMmp){
                        comparacao = custoMmp - json.selectIndividuais[j].custo
                        porcentagem = ((comparacao / json.selectIndividuais[j].custo) * 100).toFixed(2)
                    }   
                }
                
                porcentagemValorTotal = (((custoTotal - custoTotalMesAnterior) / custoTotalMesAnterior) * 100).toFixed(2)

                if (servicoMmp == "EC2 - Other") {
                    servicoPlotado = "EC2"
                }
                if (servicoMmp == "Amazon Simple Storage Service") {
                    servicoPlotado = "S3"
                }
                if (servicoMmp == "AmazonCloudWatch") {
                    servicoPlotado = "CloudWatch"
                }
                if (servicoMmp == "AWS Lambda") {
                    servicoPlotado = "Lambda"
                }
                if(porcentagem < 0){
                    mensagem = "&#8595"
                    cor = "#00FF88"
                }
                if(porcentagemValorTotal < 0){
                    mensagemValorTotal = "&#8595"
                    corValorTotal = "#00FF88"
                }
                
                listagem_previsao.innerHTML += `<div class="valores-servicos">
                <div class="servico-coluna">
                <span>${servicoPlotado}</span>
                </div>
                <div class="gasto-coluna">
                <span style="color: ${cor}">R$${custoMmp} - ${mensagem} ${Math.abs(porcentagem)}%</span>
                </div>s
                </div>`


            }
            gastoTotalProjecao.innerHTML += `<span style="color: ${cor}">R$${custoTotal.toFixed(2)} - ${mensagemValorTotal} ${Math.abs(porcentagemValorTotal)}</span>`
            meses.push("Projeção")

            const graficoPrevisao = document.getElementById('previsao');
            new Chart(graficoPrevisao, {
                type: 'bar',
                data: {
                    labels: meses,
                    datasets: dataset
                },
                options: {
                    scales: {
                        y: {
                            stacked: true,
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
                            stacked: true,
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