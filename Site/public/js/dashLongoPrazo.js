let dados = [];
let telas = [];
let url;
var tempoReal;
function carregarDados() {
    aquecerLambda();
    carregarKPIsAlerta();
    carregarATMS();
}

function aquecerLambda() {
    url = `https://r7rjph7au4.execute-api.us-east-1.amazonaws.com/redirecionadorAPIStreamline_v5/bclient-streamline/ATM_0/0/0/aquecer`

    fetch(url)
    .then(res => res.json())
    .then(dados => {
        console.log(dados)})

    let dataAtual = Date.now()
    let date = new Date(dataAtual)
    console.log(dataAtual)

    let dt = "";
    let ms = "";
    if(date.getDate() < 10) {
        dt = `0${date.getDate()}`;
    } else {
        dt = date.getDate();
    }

    if(date.getMonth() < 10) {
        ms = `0${date.getMonth() + 1}`;
    } else {
        ms = date.getMonth() + 1;
    }

    let dta = `${date.getFullYear()}-${ms}-${dt}`;
    console.log(dta)
    
    let dia = document.getElementById('ipt_dia');
    let de = document.getElementById('ipt_de');
    dia.max = dta
    de.max = dta
}

function carregarKPIsAlerta() {
    
    let fkAgencia = sessionStorage.ID_AGENCIA;

    fetch(`/dashLongoPrazo/buscarKPI1`, {
        method: "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: fkAgencia
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
        let kpi = document.getElementById("total_filtrado");
        kpi.innerHTML = componente[0].qtd;
    })
    .catch(function (erro) {
        console.log("Erro no fetch do total filtrado:", erro);
    });

    fetch(`/dashLongoPrazo/buscarKPI2`, {
        method: "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: fkAgencia
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
        let kpi2 = document.getElementById("total_criticos");
        kpi2.innerHTML = componente[0].qtd;
    })
    .catch(function (erro) {
        console.log("Erro no fetch do total criticos:", erro);
    });

    fetch(`/dashLongoPrazo/buscarGraficoAlertas`, {
        method: "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: fkAgencia
        })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json();
        } else {
            console.log("Erro ao buscar alertas.");
        }
    })
    .then(function (componente) {
        dados = componente;
        gerarCards(componente)
    })
    .catch(function (erro) {
        console.log("Erro no fetch dos componentes:", erro);
    });
}

function gerarCards(lista) {
    let listagem = document.getElementById("listagem");
    let maior;
    let acCPUP;
    let acCPUF;
    let acRAMD;
    let acRAMP;
    let acDISKD;
    let acPROCD;
    let acPROCA;
    let acREDEE;
    let acREDER;
    let vetor = [];
    let componentes = ["CPU Porcentagem", "CPU Frequência", "RAM Disponivel", "Porcentagem RAM", "Disco Disponivel", "Processos Desativados", "Processos Ativos", "Pacotes Enviados", "Pacotes Recebidos"];
    let componente = "";
    
    for(let i = 0; i < lista.length; i++) {
        maior = 0
        acCPUP = parseInt(lista[i].alertasCriticosCPUPercent)
        acCPUF = parseInt(lista[i].alertasCriticosCPUFreq)
        acRAMD = parseInt(lista[i].alertasCriticosRAMDisponivel)
        acRAMP = parseInt(lista[i].alertasCriticosRAMPercentual)
        acDISKD = parseInt(lista[i].alertasCriticosDISKDisponivel)
        acPROCD = parseInt(lista[i].alertasCriticosPROCESSODesativado)
        acPROCA = parseInt(lista[i].alertasCriticosPROCESSOSAtivos)
        acREDEE = parseInt(lista[i].alertasCriticosREDEEnviada)
        acREDER = parseInt(lista[i].alertasCriticosREDERecebida)
        
        vetor.push(acCPUP, acCPUF, acRAMD, acRAMP, acDISKD, acPROCD, acPROCA, acREDEE, acREDER)

        console.log(lista[i])
        for(let j = 0; j < vetor.length; j++) {
            if(maior <= vetor[j]) {
                maior = vetor[j];
                componente = componentes[j];
            }
        }

        if(maior != 0) {

        console.log(componente)
        console.log(maior)

        listagem.innerHTML += `
            <div class="card" style="width: 90%; height: 12vh; display: flex; flex-direction: column; justify-content: space-between; padding: 2vh">
                <span class="cabecalho-listagem" style="color: #FFFFFF; font-size: 2.3vh;">ATM: <span> ${lista[i].hostname}</span></span>
                <span class="cabecalho-listagem" style="color: #FFFFFF; font-size: 1.8vh;">Componente: <span> ${componente}</span></span>
                <div class="descricao-listagem" style="display: flex; flex-direction: row; width: 100%; gap: 5%;">
                    <div class="dados-listagem" style="display: flex; flex-direction: column; width: 70%;">
                        <span class="texto-listagem" style="color: #FFFFFF; font-size: 1.8vh;"> Número de alertas: <span> ${maior}</span></span>
                    </div>
                </div>
                <div class="button-listagem" onclick="pesquisar('${componente}', ${lista[i].idAtm})">Verificar</div>
            </div>
        `;
        if(i < lista.length) {
            listagem.innerHTML += `<div class="linha-listagem"></div>`;
        }
        }


        vetor = [];
        componente = ""
    }
    graficoAlertas(lista)
}

function pesquisar(componente, id) {
    console.log(componente);
    console.log(id);

    let comp = componente.split(" ")

    let json = capturas(comp[0], comp[1])

    let filtro = document.getElementById("slt_filtro");
    let atm = document.getElementById("select_atm");
    let cpt = document.getElementById("select_componentes");
    let metrica = document.getElementById("select_metricas");
    let intervalo = document.getElementById("slt_intervalo");

    let m = json.m;
    let c = json.c

    if(m == "FREQUÊNCIA") {
        m = "FREQUENCIA";
    }

    filtro.value = "gerarGrafico"
    atm.value = id
    carregarComponentes()
    setTimeout(() => {
        cpt.value = c
        carregarMetricas()
    }, 500);
    setTimeout(() => {
        metrica.value = m
    }, 1000);
    intervalo.value = "ultimaSemana"

    setTimeout(() => {
        metrica.value = m
        gerarGraficos()
    }, 1500);
}

function graficoAlertas(lista) {
    let cpup = []
    let cpuf = []
    let ramd = []
    let ramp = []
    let diskd = []
    let procd = []
    let proca = []
    let redee = []
    let reder = []
    let nomes = []

    for(let i = 0; i < lista.length; i++) {
        nomes.push(lista[i].hostname)
        cpup.push(lista[i].alertasCriticosCPUPercent)
        cpuf.push(lista[i].alertasCriticosCPUFreq)
        ramd.push(lista[i].alertasCriticosRAMDisponivel)
        ramp.push(lista[i].alertasCriticosRAMPercentual)
        diskd.push(lista[i].alertasCriticosDISKDisponivel)
        procd.push(lista[i].alertasCriticosPROCESSODesativado)
        proca.push(lista[i].alertasCriticosPROCESSOSAtivos)
        redee.push(lista[i].alertasCriticosREDEEnviada)
        reder.push(lista[i].alertasCriticosREDERecebida)
    }

const ctx = document.getElementById('meuGraficoInit').getContext('2d');

const data = {
  labels: nomes,
  datasets: [
    {
      label: 'Porcentagem CPU',
      data: cpup,
      backgroundColor: '#ffa299'
    },
    {
      label: 'Frequência CPU',
      data: cpuf,
      backgroundColor: '#fa7064'
    },
    {
      label: 'RAM Disponivel',
      data: ramd,
      backgroundColor: '#a6a6ff'
    },
    {
      label: 'Porcentagem RAM',
      data: ramp,
      backgroundColor: '#6969fa'
    },
    {
      label: 'Disco Disponivel',
      data: diskd,
      backgroundColor: '#8fff8f'
    },
    {
      label: 'Processos Desativados',
      data: procd,
      backgroundColor: '#fbff8f'
    },
    {
      label: 'Processos Ativos',
      data: proca,
      backgroundColor: '#faff64'
    },
    {
      label: 'Pacotes Enviados',
      data: redee,
      backgroundColor: '#f7a0ff'
    },
    {
      label: 'Pacotes Recebidos',
      data: reder,
      backgroundColor: '#f15dff'
    }
  ]
};

const config = {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
    indexAxis: 'y',
    plugins: {
        datalabels: {
            anchor: 'end',
            align: 'end',
            color: 'black',
            font: {
                weight: 'bold'
            }
        },
        legend: { display: false }
    },
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      }
    }
  }
};

new Chart(ctx, config);
}

let listaDatas = [];
let listaCapturas = [];
let listaLimite = [];
let listaGeral = [];

let periodo = false;

let chartCount = 0;

function gerarGraficos() {
    chartCount++;

    let filtro = slt_filtro.value;
    let atm = select_atm.value;
    let componente = select_componentes.value;
    let metrica = select_metricas.value;
    let intervalo = slt_intervalo.value;

    const dash = document.getElementById("painels");

    const dashDiv = document.createElement('div');
    dashDiv.className = "dash-inicial";
    dashDiv.id = `dash${chartCount}`;
    dashDiv.style.display = "none";

    const kpis = document.createElement('div');
    kpis.className = "kpis";
    kpis.style.display = "flex";

    const kpiPrazo = document.createElement('div');
    kpiPrazo.className = "kpi-prazo";

    for (let i = 1; i <= 3; i++) {
        const kpi = document.createElement('div');
        kpi.className = "kpi";
        kpi.id = `kpi${i}_${chartCount}`;
        kpi.style.backgroundColor = "#ff0000";
        kpi.style.color = "#FFFFFF";

        const spanText = document.createElement('span');
        spanText.innerHTML = 
            i === 1 ? `MAIOR PICO DE COMPONENTE: <br><span id="pico${chartCount}">90%</span>` :
            i === 2 ? `DIA COM MAIS ALERTAS: <br><span id="momento${chartCount}">03/04/2025</span>` :
                      `NÚMEROS DE ALERTAS: <br><span id="total${chartCount}">21</span>`;

        kpi.appendChild(spanText);
        kpiPrazo.appendChild(kpi);
    }

    kpis.appendChild(kpiPrazo);
    dashDiv.appendChild(kpis);

    const organizar = document.createElement('div');
    organizar.className = "organizar";
    organizar.style.display = "flex";

    const paginacao = document.createElement('div');
    paginacao.className ="paginacao";

    const fundo = document.createElement('div');
    fundo.className = "fundo";

    const iconEsq = document.createElement('i');
    iconEsq.className = "bx bxs-play bx-flip-horizontal icone-ida";
    iconEsq.setAttribute("onclick", `retornarInicio(${chartCount})`);
    iconEsq.style.justifySelf = "center";


    const fundoGrafico = document.createElement('div');
    fundoGrafico.className = "fundo-grafico";

    const tituloGrafico = document.createElement('div');
    tituloGrafico.className = "titulo-grafico";

    const spanComp = document.createElement('div');
    spanComp.style.fontWeight = "bold";
    const spanId = document.createElement('span');
    spanId.id = `componente_grafico${chartCount}`;
    spanComp.appendChild(spanId);

    const legenda = document.createElement('div');
    legenda.className = "legenda";

    const bolinhas = document.createElement('div');
    bolinhas.className = "bolinhas";

    const red = document.createElement('div');
    red.className = "red";
    const roxo = document.createElement('div');
    roxo.className = "roxo";

    bolinhas.appendChild(red);
    bolinhas.appendChild(roxo);

    const legendaTitulo = document.createElement('div');
    legendaTitulo.className = "legenda-titulo";

    const spanLimite = document.createElement('span');
    spanLimite.textContent = "LIMITE";
    const spanCapturas = document.createElement('span');
    spanCapturas.textContent = "CAPTURAS";

    legendaTitulo.appendChild(spanLimite);
    legendaTitulo.appendChild(spanCapturas);

    legenda.appendChild(bolinhas);
    legenda.appendChild(legendaTitulo);

    tituloGrafico.appendChild(spanComp);
    tituloGrafico.appendChild(legenda);

    const graficoDiv = document.createElement('div');
    graficoDiv.className = "grafico";
    graficoDiv.id = `meuGrafico${chartCount}`;

    fundoGrafico.appendChild(tituloGrafico);
    fundoGrafico.appendChild(graficoDiv);

    const iconDir = document.createElement('i');
    iconDir.className = "bx bxs-play icone-retorno";
    iconDir.setAttribute("onclick", `direcionarProximo(${chartCount})`);

    fundo.appendChild(iconEsq);
    fundo.appendChild(fundoGrafico);
    fundo.appendChild(iconDir);

    const div_search = document.createElement('div')
    div_search.className = "div-search"

    const icon = document.createElement('i')
    icon.className = "bx  bx-menu-search icone_search"
    icon.setAttribute('onclick', `trocarPaginacao(${chartCount})`)

    const ipt = document.createElement('input')
    ipt.setAttribute('id', `input_pesquisa${chartCount}`)
    ipt.setAttribute('style', 'width: 3vw')
    ipt.setAttribute('type', "number")
    ipt.setAttribute('min', "0")
    ipt.setAttribute('max', `${chartCount}`)
    ipt.setAttribute('value', `${chartCount}`)

    div_search.appendChild(ipt)
    div_search.appendChild(icon)

    paginacao.appendChild(fundo);
    paginacao.appendChild(div_search);
    organizar.appendChild(paginacao);
    dashDiv.appendChild(organizar);

    dash.appendChild(dashDiv);

    slt_filtro.value = filtro;
    select_atm.value = atm;
    select_componentes.value = componente;
    select_metricas.value = metrica;
    slt_intervalo.value = intervalo;

    const nxtInit = document.getElementById("nxt_inicial");
    nxtInit.style.color = "blue";

    const json = capturas(componente, metrica);

    let inicio, fim, metodo;
    const atual = chartCount;

    for(let i = 1; i <= chartCount; i++) {
        const dashFiltrada = document.getElementById(`dash${i}`);
        if(dashFiltrada) dashFiltrada.style.display = "none";
    }

    let dashInit = document.querySelector(".dash-filtrada");
    dashInit.style.display = "none";

    const dashInicial = document.getElementById(`dash${atual}`);
    dashInicial.style.display = "flex";

    if(filtro == "gerarGrafico") {
        metodo = "teste";
        if(periodo) {
            inicio = ipt_de.value.split("-").reverse().join("-");
            fim = ipt_ate.value.split("-").reverse().join("-");
            metodo = "periodo";
        } else {
            inicio = fim = slt_intervalo.value;
        }
    } else {
        metodo = "tempoReal";
        inicio = ipt_dia.value.split("-").reverse().join("-");
        fim = inicio;
    }

    let dois = document.querySelector(".organizar");
    let kpis1 = document.querySelector(".kpis");
    dois.style.display = "flex";
    kpis1.style.display = "flex";

    let filtros = document.getElementById("filtros");
    let leg = document.querySelector(".titulo-grafico");
    
    if(window.innerWidth < 1030){
        filtros.style.display = "none"
        leg.style.display = "none"
    }

    url = `https://r7rjph7au4.execute-api.us-east-1.amazonaws.com/redirecionadorAPIStreamline_v5/bclient-streamline/ATM_${atm}/${fim}/${inicio}/${metodo}`;

    console.log(url);

    fetch(url)
    .then(res => res.json())
    .then(dados => {
        listaGeral = dados
        listaDatas = [];
        listaCapturas = [];
        listaLimite = [];

        if(metodo == "tempoReal") {
            graficoTempoReal(dados, json, graficoDiv);
            return;
        }

        let dataAtual = "";
        for(let i = 0; i < dados.length; i++) {

        if((inicio == fim && metodo == "periodo") || inicio == "ultimoDia") {
            dataAtual = ((dados[i].dataHora).split(" ")[1])
        } else {
            dataAtual = (dados[i].dataHora).split("-")
            dataAtual = `${dataAtual[2]}/${dataAtual[1]}/${dataAtual[0]}`;
        }

            listaDatas.push(dataAtual);
            listaCapturas.push(dados[i][json.r])
            listaLimite.push(dados[i][json.l])
        }

        spanId.innerHTML = `${json.c} - ${listaDatas[0]} até ${listaDatas[listaDatas.length - 1]} <br> (${json.m})`;
        carregarKPIS(json);

        const chartDiv = document.createElement('div');
        chartDiv.className = "fundoGrafico";

        const canvas = document.createElement('canvas');
        canvas.className = "graficos-style";
        canvas.id = `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        chartDiv.appendChild(canvas);
        graficoDiv.appendChild(chartDiv);

        const chart = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: listaDatas,
                datasets: [
                    {
                        label: 'Uso da CPU (%)',
                        data: listaCapturas,
                        borderColor: 'rgba(141, 52, 249, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Limite (%)',
                        data: listaLimite,
                        borderColor: 'red',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } }
                }
            }
        });
    })
    .catch(err => console.error('Erro:', err));
}


function carregarKPIS(json) {
    let kpi1 = document.getElementById(`pico${chartCount}`);
    let kpi2 = document.getElementById(`momento${chartCount}`);
    let kpi3 = document.getElementById(`total${chartCount}`);

    let indice = 0;
    for(let i = 1; i < listaCapturas.length; i++) {
        if(listaCapturas[indice] < listaCapturas[i]) {
            indice = i;
        }
    }

    console.log("passei")
    console.log(listaCapturas)
    console.log(listaLimite)
    console.log(listaGeral)

    let kpi1_1 = document.getElementById(`kpi1_${chartCount}`);

    if(listaCapturas[indice] > listaLimite[indice]) {
        kpi1_1.style.background = "red"
        kpi1_1.style.color = "#FFFFFF"
    } else if(listaCapturas[indice] <= listaLimite[indice] && listaCapturas[indice] > listaLimite[indice] * 0.9) {
        kpi1_1.style.background = "yellow"
        kpi1_1.style.color = "#000000"
    } else {
        kpi1_1.style.background = "green"
        kpi1_1.style.color = "#FFFFFF"
    }

    kpi1.innerHTML = Math.round(listaCapturas[indice], 2) + json.u;

    let kpi2_1 = document.getElementById(`kpi2_${chartCount}`);

    if(listaGeral[indice].qtdAlertaCPUP == 0) {
        kpi2_1.style.background = "green";
        kpi2.innerHTML = "Não houve alertas";
    } else {
        kpi2.innerHTML = listaDatas[indice];
    }
    
    let kpi3_1 = document.getElementById(`kpi3_${chartCount}`);

    if(listaGeral[indice].qtdAlertaCPUP == 0) {
        kpi3_1.style.background = "green";
        kpi3_1.style.color = "#FFFFFF"
    } else if(listaGeral[indice].qtdAlertaCPUP <= 5) {
        kpi3_1.style.background = "yellow";
        kpi3_1.style.color = "#000000"
    } else {
        kpi3_1.style.background = "red"
        kpi3_1.style.color = "#FFFFFF"
    }

    kpi3.innerHTML = listaGeral[indice].qtdAlertaCPUP;
}

function trocarAtms() {
    let txt = document.getElementById("ipt_pesquisa").value
    console.log(txt)

    if(txt == "") {
        carregarATMS()
        return
    } else {
        let fkAgencia = sessionStorage.ID_AGENCIA;
        fetch("/dashLongoPrazo/pesquisarAtm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                texto: txt,
                id: fkAgencia
            })
        }).then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Erro ao buscar componentes.");
            }
        })
        .then(function (atm) {
            console.log("atm recebidos:", atm);

            var selectatm = document.getElementById("select_atm");
            var options = "";

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

    buscarLimiteData(fkAtm);
    
    console.log(fkAtm)

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

function carregarData() {
    let slt = document.getElementById("slt_intervalo");
    let div_periodo = document.getElementById("periodo");
    if(slt.value == "personalizado") {
        div_periodo.style.display = "flex";
        periodo = true;
    } else {
        div_periodo.style.display = "none";
        periodo = false;
    }
}

function carregarSegundaInput() {
    let data = ipt_de.value;
    console.log(data);
    let dataInicial = new Date(data);
    let min = new Date()
    let max = new Date(dataInicial.getFullYear(), dataInicial.getMonth(), dataInicial.getDate() + 7);
    
    let dt = "";
    let ms = "";
    if(min.getDate() < 10) {
        dt = `0${min.getDate()}`;
    } else {
        dt = min.getDate();
    }

    if(min.getMonth() < 10) {
        ms = `0${dataInicial.getMonth() + 1}`;
    } else {
        ms = dataInicial.getMonth() + 1;
    }
    
    console.log(ms);

    let minFormatado = `${min.getFullYear()}-${ms}-${dt}`;
    
    if(max.getDate() < 10) {
        dt = `0${max.getDate()}`;
    } else {
        dt = max.getDate();
    }
    
    if(max.getMonth() < 10) {
        ms = `0${dataInicial.getMonth() + 1}`;
    } else {
        ms = dataInicial.getMonth() + 1;
    }
    console.log(ms);

    let maxFormatado = `${max.getFullYear()}-${ms}-${dt}`;

    let dataLocal = new Date()

    if(dataLocal < max) {
        if(dataLocal.getDate() < 10) {
            dt = `0${dataLocal.getDate()}`;
        } else {
            dt = dataLocal.getDate();
        }

        if(dataLocal.getMonth() < 10) {
            ms = `0${dataLocal.getMonth()}`;
        } else {
            ms = dataLocal.getMonth();
        }

        maxFormatado = `${dataLocal.getFullYear()}-${ms}-${dt}`;
    }

    segundaInputData.innerHTML = `
        <input type="date" id="ipt_ate" min="${minFormatado}" max="${maxFormatado}">
    `;
}

function capturas(componente, metrica) {
    let listaMetricas = []

    listaMetricas.push({c: "CPU", m: "PORCENTAGEM", r: "valorCpuPercent", l: "limiteCpuPercent", u: "%"});
    listaMetricas.push({c: "CPU", m: "FREQUÊNCIA", r: "valorCPUFreq", l: "limiteCPUFreq", u: "Hz"});
    listaMetricas.push({c: "RAM", m: "DISPONIVEL", r: "valorRAMDisponivel", l: "none", u: "GB"});
    listaMetricas.push({c: "RAM", m: "PORCENTAGEM", r: "valorRAMPercentual", l: "limiteRAMPercentual", u: "%"});
    listaMetricas.push({c: "DISCO", m: "TOTAL", r: "valorDISKTotal", l: "none", u: "GB"});
    listaMetricas.push({c: "DISCO", m: "DISPONIVEL", r: "valorDISKDisponivel", l: "none", u: "GB"});
    listaMetricas.push({c: "DISCO", m: "PORCENTAGEM", r: "valorDISKPercentual",  l: "limiteDISKPercentual", u: "%"});
    listaMetricas.push({c: "REDE", m: "RECEBIDA", r: "valorREDERecebida",  l: "limiteREDERecebida",u: "pacotes"});
    listaMetricas.push({c: "REDE", m: "ENVIADA", r: "valorREDEEnviada",  l: "limiteREDEEnviada", u: "pacotes"});
    listaMetricas.push({c: "PROCESSOS", m: "TOTAL", r: "alertaREDEEnviada",  l: "valorPROCESSOTotal", u: ""});
    listaMetricas.push({c: "PROCESSOS", m: "DESATIVADOS", r: "valorPROCESSODesativado",  l: "limitePROCESSODesativado", u: ""});
    listaMetricas.push({c: "PROCESSOS", m: "ATIVOs", r: "valorPROCESSOAtivos",  l: "limitePROCESSOAtivos", u: ""});

    for(let i = 0; i < listaMetricas.length; i++) {
        if((listaMetricas[i].c).toLowerCase() == componente.toLowerCase() && (listaMetricas[i].m).toLocaleLowerCase() == metrica.toLocaleLowerCase()) {
            let json = listaMetricas[i];
            return json;
        }
    }
    return null;
}

function mudarFiltros() {
    let filtro = slt_filtro.value;
    let datas = document.querySelector(".escolha-datas");
    let data = document.querySelector(".escolha-data");
    let horario = document.querySelector(".escolha-horario");
    let intervalo = document.getElementById("periodo");
    let slt = slt_intervalo.value;
    
    let maquina = document.getElementById("select_atm");

    if(filtro == "gerarGrafico") {
        data.style.display = "none";
        horario.style.display = "none";
        datas.style.display = "flex";
        if(slt == "personalizado") {
            intervalo.style.display = "flex";
        }
    } else {
        datas.style.display = "none"
        data.style.display = "flex";
        horario.style.display = "flex";
        intervalo.style.display = "none";
    }
}

function graficoTempoReal(lista, json, graficoDiv) {
    carregarKPIS(json)


    const chartDiv = document.createElement('div');
    chartDiv.className = "fundoGrafico";

    const canvas = document.createElement('canvas');
    canvas.className = "graficos-style";
    canvas.id = `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    chartDiv.appendChild(canvas);
    graficoDiv.appendChild(chartDiv);

    let inicio = ipt_horario_de.value;
    inicio = `${inicio}:00`;
    let fim = ipt_horario_ate.value;
    fim = `${fim}:00`;

    if(lista.length == 0) {
        return console.log("numfoi")
    }

    inicio = pesquisaBinaria(lista, inicio)
    fim = pesquisaBinaria(lista, fim)

    let arrayDatas = [];
    let arrayLimites = [];
    let arrayCapturas = [];

    for(let i = inicio; i < inicio + 6; i++) {
        arrayDatas.push(lista[i].dataHora)
        arrayLimites.push(lista[i][json.l])
        arrayCapturas.push(lista[i][json.r])
    }

    console.log(arrayDatas)
    console.log(arrayLimites)
    console.log(arrayCapturas)

    tempoReal = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: arrayDatas,
                datasets: [
                    {
                        label: 'Uso da CPU (%)',
                        data: arrayCapturas,
                        borderColor: 'rgba(141, 52, 249, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Limite (%)',
                        data: arrayLimites,
                        borderColor: 'red',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } }
                }
            }
        });

        inicio = inicio + 6;
    if((lista[fim].dataHora).split(" ")[1] != fim) {
        fim -= 1;
    }
    
    let criacao = setInterval(function () {
        arrayDatas.push(lista[inicio].dataHora)
        arrayDatas.shift()

        arrayLimites.push(lista[inicio][json.l])
        arrayLimites.shift()

        arrayCapturas.push(lista[inicio][json.r])
        arrayCapturas.shift()

        tempoReal.data.labels = arrayDatas;
        tempoReal.data.datasets[0].data = arrayCapturas
        tempoReal.data.datasets[1].data = arrayLimites
        tempoReal.update()
       
       if(inicio == fim) {
           clearInterval(criacao)
        }
        inicio++;
    }, 5000)
}

function pesquisaBinaria(lista, tempo) {
    let inn = 0;
    let fmm = lista.length - 1;
    let meio;
    let termo;
    let dtHora;
    let termoModificado = new Date(2025, 1, 12, tempo.split(":")[0], tempo.split(":")[1], tempo.split(":")[2])
    
    while(inn < fmm) {
        meio = Math.ceil((inn + fmm) / 2);
        termo = lista[meio];
        dtHora = (termo.dataHora).split(" ")[1]

        if(dtHora == tempo) {
            return meio;
        } else {
            let data = new Date(2025, 1, 12, dtHora.split(":")[0], dtHora.split(":")[1], dtHora.split(":")[2]);

            if(data > termoModificado) {
                fmm = meio - 1
            } else {
                inn = meio + 1
            }
        }
    }

    return Math.floor(meio)
}


function retornarInicio(termo) {
    trocarPaginacao()
    let dashAtual = document.querySelector(".dash-filtrada");
    let dashFiltrada;

    for(let i = 1; i <= chartCount; i++) {
        dashFiltrada = document.getElementById(`dash${i}`);
        dashFiltrada.style.display = "none";
    }

    dashAtual.style.display = "none";

    if(termo == 1) {
        dashAtual.style.display = "flex";
    } else {
        dashFiltrada = document.getElementById(`dash${termo-1}`);
        dashFiltrada.style.display = "flex";
    }
}

function direcionarProximo(termo) {
    trocarPaginacao()
    let dashAtual = document.querySelector(".dash-filtrada");
    let dashFiltrada;

    if(termo >= chartCount) {
        return alert("Não há mais telas para ver!")
    }

    for(let i = 1; i <= chartCount; i++) {
        dashFiltrada = document.getElementById(`dash${i}`);
        dashFiltrada.style.display = "none";
    }

    dashAtual.style.display = "none";

    dashFiltrada = document.getElementById(`dash${termo + 1}`);
    dashFiltrada.style.display = "flex";
}

function trocarPaginacao(id) {
    let dash;
    let pag;
    for(let i = 0; i <= chartCount; i++) {
        if(i == 0) {
            dash = document.querySelector(".dash-filtrada")
            pag = document.querySelector(".dash-filtrada")
        } else {
            pag = document.getElementById(`input_pesquisa${i}`);
            dash = document.getElementById(`dash${i}`)
        }
        
        pag.max = chartCount
        dash.style.display = "none"
    }
    
    if(id == undefined) {
        return
    }

    let ipt = document.getElementById(`input_pesquisa${id}`).value;
    
    if(ipt != 0) {
        dash = document.getElementById(`dash${ipt}`)
    } else {
        dash = document.querySelector(".dash-filtrada")
    }
    
    dash.style.display = "flex"
}

function buscarLimiteData(fkAtm) {
    console.log("teste")
    let lista;

    url = `https://r7rjph7au4.execute-api.us-east-1.amazonaws.com/redirecionadorAPIStreamline_v5/bclient-streamline/ATM_${fkAtm}/0/0/pegarData`
    fetch(url)
    .then(res => res.json())
    .then(dados => {
        let mensagem = dados.message
        mensagem = `${mensagem.split("_")[3].split(".")[0].split("-")[2]}-${mensagem.split("_")[3].split(".")[0].split("-")[1]}-${mensagem.split("_")[3].split(".")[0].split("-")[0]}`;
        
        let dia = document.getElementById('ipt_dia');
        let de = document.getElementById('ipt_de');
        dia.min = mensagem
        de.min = mensagem
    })
}