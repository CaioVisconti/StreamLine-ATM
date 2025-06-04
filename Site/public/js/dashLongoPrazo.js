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
    url = `https://v628rlk7v0.execute-api.us-east-1.amazonaws.com/TESTE1GUI/bclientstreamline/ATM_0/0/0/aquecer`

    fetch(url)
    .then(res => res.json())
    .then(dados => {
        console.log(dados)})

    let dataAtual = Date.now()
    let date = new Date(dataAtual)

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
    
    let componentes = ["PORCENTAGEM CPU", "FREQUÊNCIA CPU", "DISPONIVEL RAM", "PORCENTAGEM RAM", "DISPONIVEL DISCO", "TOTAL DISCO", "PORCENTAGEM DISCO","DESATIVADOS PROCESSOS", "ATIVOS PROCESSOS", "TOTAL PROCESSOS", "ENVIADA REDE", "RECEBIDA REDE"];
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

        listagem.innerHTML += `
            <div class="card">
                <span class="cabecalho-listagem" style="color: #FFFFFF; font-size: 2.3vh;">ATM: <span> ${lista[i].hostname}</span></span>
                <span class="cabecalho-listagem">Componente: <span> ${componente}</span></span>
                <div class="descricao-listagem">
                    <div class="dados-listagem">
                        <span class="texto-listagem"> Número de alertas: <span> ${maior}</span></span>
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

    let comp = componente.split(" ")

    let json = capturas(comp[1], comp[0])

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
    
    let filtro = slt_filtro.value;
    let atm = select_atm.value;
    let componente = select_componentes.value;
    let metrica = select_metricas.value;
    let intervalo = slt_intervalo.value
    
    if(metrica == "FREQUENCIA") {
        metrica = "FREQUÊNCIA";
    }

    const json = capturas(componente, metrica);
    
    let inicio, fim, metodo;
    const atual = chartCount;
    
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
    
    let filtros = document.getElementById("filtros");
    let leg = document.querySelector(".titulo-grafico");
    
    if(window.innerWidth < 1030){
        filtros.style.display = "none"
        leg.style.display = "none"
    }
    
    url = `https://v628rlk7v0.execute-api.us-east-1.amazonaws.com/TESTE1GUI/bclientstreamline/ATM_${atm}/${fim}/${inicio}/${metodo}`;
    
    fetch(url)
    .then(res => res.json())
    .then(dados => {
        chartCount++;
        listaGeral = dados
        console.log("dados")
        console.log(dados)
        listaDatas = [];
        listaCapturas = [];
        listaLimite = [];
        
        const dash = document.getElementById("painels");
        
        const dashDiv = document.createElement('div');
        dashDiv.className = "dash-inicial";
        dashDiv.id = `dash${chartCount}`;
        dashDiv.style.display = "none";

    const kpis = document.createElement('div');
    kpis.className = "kpis";
    kpis.style.display = "flex";
    kpis.id = `kpis${chartCount}`

    const kpiPrazo = document.createElement('div');
    kpiPrazo.className = "kpi-prazo";

    for (let i = 1; i <= 3; i++) {
        const kpi = document.createElement('div');
        kpi.className = "kpi-filtrado-titulo";
        kpi.id = `kpi${i}_${chartCount}`;
        kpi.style.backgroundColor = "#3C3F40";
        kpi.style.color = "#FFFFFF";

        const spanText = document.createElement('span');
        spanText.innerHTML = 
            i === 1 ? `MÉDIA MAIS ALTA DE CAPTURA: <br><span class="kpi_filtrado" id="pico${chartCount}"></span>` :
            i === 2 ? `MOMENTO COM MAIS ALERTAS: <br><span class="kpi_filtrado" id="momento${chartCount}"></span>` :
                      `NÚMEROS DE ALERTAS: <br><span class="kpi_filtrado" id="total${chartCount}"></span>`;

        kpi.appendChild(spanText);
        kpiPrazo.appendChild(kpi);
    }

    kpis.appendChild(kpiPrazo);
    dashDiv.appendChild(kpis);

    const organizar = document.createElement('div');
    organizar.className = "organizar-filtrado";
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
    spanId.style.fontSize = "2.5vh"
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

    const nxtInit = document.getElementById("nxt_inicial");
    nxtInit.style.color = "blue";

    for(let i = 1; i <= chartCount; i++) {
        const dashFiltrada = document.getElementById(`dash${i}`);
        if(dashFiltrada) dashFiltrada.style.display = "none";
    }

    let dashInit = document.querySelector(".dash-filtrada");
    dashInit.style.display = "none";

    
    const dashInicial = document.getElementById(`dash${atual}`);
    dashInicial.style.display = "flex";

    
    let dois = document.querySelector(".organizar");
    let kpis1 = document.querySelector(".kpis");
    dois.style.display = "flex";
    kpis1.style.display = "flex";
    

        if(metodo == "tempoReal") {
            graficoTempoReal(dados, json, graficoDiv, spanId);
            return;
        }
        
        let max = 100
        let min = 0
        let dataAtual = "";
        for(let i = 0; i < dados.length; i++) {
            
            let valor = dados[i][json.r]
            let limite = dados[i][json.l]

            
            if(json.m == "DISPONIVEL" || json.c == ("REDE" || "PROCESSOS")) {
                valor = valor * 1000;
                limite = limite * 1000;
            }

            if((inicio == fim && metodo == "periodo") || inicio == "ultimoDia") {
                dataAtual = ((dados[i].dataHora).split(" ")[1])
            } else if(inicio == "ultimaSemana") {
                dataAtual = (dados[i].dataHora).split("-")
                dataAtual = `${dataAtual[2]}/${dataAtual[1]}/${dataAtual[0]}`;
            } else {
                dataAtual = dados[i].dataHora
            }
    
            if(max <= valor || i == 0) {
                max = valor * 1.1
            }

            if(max <= limite) {
                max = limite * 1.1
            }

            if(min >= valor || i == 0) {
                min = valor * 0.8
            }

            if(min >= limite) {
                min = limite * 0.8
            }


            listaDatas.push(dataAtual);
            listaCapturas.push(Math.ceil(valor))
            if(limite != undefined) {
                listaLimite.push(limite)
            }
        }

        if(metrica == "PORCENTAGEM") {
            min = 0
            max = 100
        } else {
            min = Math.floor(min)
            max = Math.floor(max)
        }

        let tamanho = (min + max) / 5
        
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
                        label: 'Uso',
                        data: listaCapturas,
                        borderColor: 'rgba(141, 52, 249, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Limite',
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
                    x: { ticks: {color: "black"}},
                    y: { beginAtZero: false, min: min, max: max, ticks: { stepSize: tamanho,  color: 'black' }}
                }
            }
        });

        

        slt_filtro.value = filtro;
        select_atm.value = atm;
        select_componentes.value = componente;
        select_metricas.value = metrica;
        slt_intervalo.value = intervalo;
    })
    .catch(err => console.error('Erro:', err));
}


function carregarKPIS(json) {
    let kpi1 = document.getElementById(`pico${chartCount}`);
    let kpi2 = document.getElementById(`momento${chartCount}`);
    let kpi3 = document.getElementById(`total${chartCount}`);

    console.log(listaGeral)

    let indice = 0;
    for(let i = 1; i < listaCapturas.length; i++) {
        if(listaCapturas[indice] < listaCapturas[i]) {
            indice = i;
        }
    }

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

    kpi1.innerHTML = Math.round(listaCapturas[indice], 2) + " " + json.u;

    let kpi2_1 = document.getElementById(`kpi2_${chartCount}`);

    if(listaGeral[indice].qtdAlertaCPUP == 0) {
        kpi2.innerHTML = "Nenhum alerta";
    } else {
        kpi2.innerHTML = listaDatas[indice];
    }
    
    let kpi3_1 = document.getElementById(`kpi3_${chartCount}`);

    if(listaGeral[indice].qtdAlertaCPUP <= 30) {
        kpi3_1.style.background = "green";
        kpi3_1.style.color = "#FFFFFF"
    } else if(listaGeral[indice].qtdAlertaCPUP <= 70) {
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
        selectcomponente.disabled = false;
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
    let dataInicial = new Date(data) ;
    let max = new Date(dataInicial.getFullYear(), dataInicial.getMonth(), dataInicial.getDate() + 7);

    if(max > new Date()) {
        max = new Date()
    }
    
    let dt = "";
    let ms = "";
    if(dataInicial.getDate() < 10) {
        dt = `0${dataInicial.getDate() + 1}`;
    } else {
        dt = dataInicial.getDate() + 1;
    }

    if(dataInicial.getMonth() < 10) {
        ms = `0${dataInicial.getMonth() + 1}`;
    } else {
        ms = dataInicial.getMonth() + 1;
    }

    let dataInicialFormatado = `${dataInicial.getFullYear()}-${ms}-${dt}`;
    
    if(max.getDate() < 10) {
        dt = `0${max.getDate()}`;
    } else {
        dt = max.getDate();
    }
    
    if(max.getMonth() < 10) {
        ms = `0${max.getMonth() + 1}`;
    } else {
        ms = max.getMonth() + 1;
    }

    maxFormatado = `${max.getFullYear()}-${ms}-${dt}`;
    

    segundaInputData.innerHTML = `
        <input type="date" id="ipt_ate" min="${dataInicialFormatado}" max="${maxFormatado}">
    `;
}

function capturas(componente, metrica) {
    let listaMetricas = []

    listaMetricas.push({c: "CPU", m: "PORCENTAGEM", r: "valorCpuPercent", l: "limiteCpuPercent", u: "%"});
    listaMetricas.push({c: "CPU", m: "FREQUÊNCIA", r: "valorCPUFreq", l: "limiteCPUFreq", u: "Hz"});
    listaMetricas.push({c: "RAM", m: "DISPONIVEL", r: "valorRAMDisponivel", l: "none", u: "MB"});
    listaMetricas.push({c: "RAM", m: "PORCENTAGEM", r: "valorRAMPercentual", l: "limiteRAMPercentual", u: "%"});
    listaMetricas.push({c: "DISCO", m: "TOTAL", r: "valorDISKTotal", l: "none", u: "MB"});
    listaMetricas.push({c: "DISCO", m: "DISPONIVEL", r: "valorDISKDisponivel", l: "none", u: "MB"});
    listaMetricas.push({c: "DISCO", m: "PORCENTAGEM", r: "valorDISKPercentual",  l: "limiteDISKPercentual", u: "%"});
    listaMetricas.push({c: "REDE", m: "RECEBIDA", r: "valorREDERecebida",  l: "limiteREDERecebida",u: "Mbps"});
    listaMetricas.push({c: "REDE", m: "ENVIADA", r: "valorREDEEnviada",  l: "limiteREDEEnviada", u: "Mbps"});
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
    let velocidade = document.getElementById("velocidade");

    if(filtro == "gerarGrafico") {
        data.style.display = "none";
        horario.style.display = "none";
        velocidade.style.display = "none"
        datas.style.display = "flex";
        if(slt == "personalizado") {
            intervalo.style.display = "flex";
        }
    } else {
        datas.style.display = "none"
        data.style.display = "flex";
        horario.style.display = "flex";
        intervalo.style.display = "none";
        velocidade.style.display = "flex"
    }
}

function graficoTempoReal(lista, json, graficoDiv, spanId) {

    
    let kpis = document.getElementById(`kpis${chartCount}`)
    kpis.style.display = "none"
    let velocidade = document.getElementById("slt_tempo").value;
    let data = document.getElementById("ipt_dia").value;
    
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
        return
    }

    spanId.innerHTML = `Revisão das capturas de ${inicio} até ${fim} do dia ${data.split("-")[2]}/${data.split("-")[1]}/${data.split("-")[0]}`;
    
    inicio = pesquisaBinaria(lista, inicio)
    fim = pesquisaBinaria(lista, fim)
    
    let arrayDatas = [];
    let arrayLimites = [];
    let arrayCapturas = [];

    for(let i = inicio; i < inicio + 6; i++) {
        let valor = lista[i][json.r]
        let limite = lista[i][json.l]
        arrayDatas.push(lista[i].dataHora.split(" ")[1])
        
        if(json.m == "DISPONIVEL" || json.c == ("REDE" || "PROCESSOS")) {
            valor = valor * 1000;
            limite = limite * 1000;
        }
        arrayCapturas.push(valor)
        arrayLimites.push(limite)
    }
    
    tempoReal = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: arrayDatas,
                datasets: [
                    {
                        label: 'Uso',
                        data: arrayCapturas,
                        borderColor: 'rgba(141, 52, 249, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Limite',
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
                    x: { ticks: {color: "black"}},
                    y: { ticks: {color: 'black' }}
                }
            }
        });

        inicio = inicio + 6;
    if((lista[fim].dataHora).split(" ")[1] != fim) {
        fim -= 1;
    }

    if(velocidade == "0.5x") {
        velocidade = 10000
    } else if(velocidade == "2x") {
        velocidade = 2500
    } else {
        velocidade = 5000
    }
    
    let criacao = setInterval(function () {
        arrayDatas.push(lista[inicio].dataHora.split(" ")[1])
        arrayDatas.shift()

        
        let valor = lista[inicio][json.r]
        let limite = lista[inicio][json.l]
        arrayDatas.push(lista[i].dataHora.split(" ")[1])
        
        if(json.m == "DISPONIVEL" || json.c == ("REDE" || "PROCESSOS")) {
            valor = valor * 1000;
            limite = limite * 1000;
        }

        arrayLimites.push(limite)
        arrayLimites.shift()

        arrayCapturas.push(valor)
        arrayCapturas.shift()

        tempoReal.data.labels = arrayDatas;
        tempoReal.data.datasets[0].data = arrayCapturas
        tempoReal.data.datasets[1].data = arrayLimites
        tempoReal.update()
       
       if(inicio == fim) {
           clearInterval(criacao)
        }
        inicio++;
    }, velocidade)
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
    let dashAtual = document.querySelector(".dash-filtrada");
    let dashFiltrada;
    
    if(termo >= chartCount) {
        alert("Não há mais telas para ver!")
        return
    }
    trocarPaginacao()

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

    url = `https://v628rlk7v0.execute-api.us-east-1.amazonaws.com/TESTE1GUI/bclientstreamline/ATM_${fkAtm}/0/0/pegarData`
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