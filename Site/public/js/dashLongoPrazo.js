let dados = [];
function carregarDados() {
    carregarATMS();
    graficoAlertas();
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
        console.log("total:", componente);
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
        console.log("criticos:", componente);
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
        console.log("dados:", componente);
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
    let componentes = ["acCPUP", "acCPUF", "acRAMD", "acRAMP", "acDISKD", "acPROCD", "acPROCA", "acREDEE", "acREDER"];
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

        console.log(componente)
        console.log(maior)

        listagem.innerHTML += `
            <div class="card" style="width: 90%; height: 15vh; display: flex; flex-direction: column; justify-content: center;">
                <span class="cabecalho-listagem" style="color: #FFFFFF; font-size: 2.5vh;">ATM: <span> ${lista[i].hostname}</span></span>
                <span class="cabecalho-listagem" style="color: #FFFFFF; font-size: 2vh;">Componente: <span> ${componente}</span></span>
                <div class="descricao-listagem" style="display: flex; flex-direction: row; width: 100%; gap: 5%;">
                    <div class="dados-listagem" style="display: flex; flex-direction: column; width: 70%;">
                        <span class="texto-listagem" style="color: #FFFFFF; font-size: 2vh;"> Número de alertas: <span> ${maior}</span></span>
                    </div>
                    <div class="button-listagem" style="display: flex; align-items: center; justify-content: center; width: 25%; background-color: blue;color: #FFFFFF; font-size: 1.5vh; justify-self: center;">Verificar</div>
                </div>
            </div>
        `;

        if(i < lista.length) {
            listagem.innerHTML += `<div class="linha-listagem"></div>`;
        }

        vetor = [];
        componente = ""
    }
}

function graficoAlertas(lista) {

    const ctx = document.getElementById('meuGrafico2').getContext('2d');

const data = {
  labels: ['Janeiro', 'Fevereiro', 'Março','Abril', 'Junho'],
  datasets: [
    {
      label: 'Porcentagem CPU',
      data: [3, 5, 7, 9, 11],
      backgroundColor: 'rgba(255, 99, 132, 0.7)'
    },
    {
      label: 'Frequência CPU',
      data: [4, 6, 8, 10, 12],
      backgroundColor: 'rgba(54, 162, 235, 0.7)'
    },
    {
      label: 'RAM Disponivel',
      data: [2, 3, 5, 6, 8],
      backgroundColor: 'rgba(75, 192, 192, 0.7)'
    }
  ]
};

const config = {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
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

function exibirAlertas(){
    let dois = document.querySelector(".organizar");
    dois.style.display = "none";

    let painel = document.getElementById("painels");
    let filtros = document.getElementById("filtros");
    let legenda = document.querySelector(".titulo-grafico");
    
    if(window.innerWidth < 1030){
        filtros.style.display = "none"
        legenda.style.display = "none"
    }

    painel.classList.remove("painel")
    painel.classList.add("painel2")

    filtros.classList.remove("kpis")
    filtros.classList.add("kpis2")

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
                data: [7, 4, 2, 3, 5],
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
                    max: 10,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

let listaDatas = [];
let listaCapturas = [];
let listaLimite = [];
let listaGeral = [];

let periodo = false;

function gerarGraficos(){
    let filtro = slt_filtro.value;
    let atm = select_atm.value;
    let componente = select_componentes.value;
    let metrica = select_metricas.value;
    
    let json = capturas(componente, metrica);
    
    let inicio;
    let fim;
    
    let metodo;

    let dashFiltrada = document.querySelector(".dash-filtrada");
    let dashInicial = document.querySelector(".dash-inicial");

    dashFiltrada.style.display = "none"
    dashInicial.style.display = "flex"
    
    if(filtro == "gerarGrafico") {
        metodo = "teste"
        if(periodo) {
            inicio = ipt_de.value.split("-");
            inicio = `${inicio[2]}-${inicio[1]}-${inicio[0]}`;
            fim = ipt_ate.value.split("-");
            fim = `${fim[2]}-${fim[1]}-${fim[0]}`;
            metodo = "periodo";
        } else {
            inicio = fim = slt_intervalo.value;
        }
        console.log("GRAFICONORMAL")
    } else {
        metodo = "tempoReal"
        inicio = ipt_dia.value.split("-");
        inicio = `${inicio[2]}-${inicio[1]}-${inicio[0]}`;
        fim = inicio;
    }

    listaDatas = [];
    listaCapturas = [];
    listaLimite = [];
    listaGeral = [];
    
    let dois = document.querySelector(".organizar");
    let kpis = document.getElementById("kpis");
    dois.style.display = "flex";
    kpis.style.display = "flex";

    let painel = document.getElementById("painels");
    let filtros = document.getElementById("filtros");
    let legenda = document.querySelector(".titulo-grafico");
    
    if(window.innerWidth < 1030){
        filtros.style.display = "none"
        legenda.style.display = "none"
    }
    
    painel.classList.remove("painel")
    painel.classList.add("painel2")
    
    filtros.classList.remove("kpis")
    filtros.classList.add("kpis2")
    
    const ctx = document.getElementById('meuGrafico').getContext('2d');
    
    if (window.meuGraficoInstance) {
        window.meuGraficoInstance.destroy();
    }

    let url = `https://r7rjph7au4.execute-api.us-east-1.amazonaws.com/redirecionadorAPIStreamline_v5/bclient-streamline/ATM_${atm}/${fim}/${inicio}/${metodo}`

    console.log(url);

  fetch(url)
  .then(resposta => {
    return resposta.json();
  })
  .then(dados => {
    listaGeral = dados;

    if(metodo == "tempoReal") {
        graficoTempoReal(dados, json);
        return
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

    componente_grafico.innerHTML = `${json.c} - ${listaDatas[0]} até ${listaDatas[listaDatas.length - 1]} <br> (${json.m})`;

    window.meuGraficoInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: listaDatas,
            datasets: [{
                label: 'Uso da CPU (%)',
                data: listaCapturas,
                borderColor: 'rgba(141, 52, 249, 1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            },{
                label: 'Limite (%)',
                data: listaLimite,
                borderColor: 'red',
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

    carregarKPIS(json);
  })
  .catch(erro => {
    console.error('Erro:', erro);
  });

  console.log(listaDatas)
  console.log(listaCapturas)
  console.log(listaLimite)

}

function carregarKPIS(json) {
    let kpi1 = document.getElementById("pico");
    let kpi2 = document.getElementById("momento");
    let kpi3 = document.getElementById("total");

    let indice = 0;
    for(let i = 1; i < listaCapturas.length; i++) {
        if(listaCapturas[indice] < listaCapturas[i]) {
            indice = i;
        }
    }

    let kpi1_1 = document.querySelector(".kpi-1");

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

    let kpi2_1 = document.querySelector(".kpi-2");

    if(listaGeral[indice].qtdAlertaCPUP == 0) {
        kpi2_1.style.background = "green";
        kpi2.innerHTML = "Não houve alertas";
    } else {
        kpi2.innerHTML = listaDatas[indice];
    }
    
    let kpi3_1 = document.querySelector(".kpi-3");

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
    let min = new Date(dataInicial.getFullYear(), dataInicial.getMonth(), dataInicial.getDate() - 5);
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
    listaMetricas.push({c: "CPU", m: "FREQUENCIA", r: "valorCPUFreq", l: "limiteCPUFreq", u: "Hz"});
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
        if(listaMetricas[i].c == componente && listaMetricas[i].m == metrica) {
            let json = listaMetricas[i];
            return json;
        }
        return null;
    }
}

function formatacaoDataKPI(inicio) {
    
}

function mudarFiltros() {
    let filtro = slt_filtro.value;
    let datas = document.querySelector(".escolha-datas");
    let data = document.querySelector(".escolha-data");
    let horario = document.querySelector(".escolha-horario");
    
    let maquina = document.getElementById("select_atm");

    if(filtro == "gerarGrafico") {
        data.style.display = "none";
        horario.style.display = "none";
        datas.style.display = "flex";
    } else {
        datas.style.display = "none"
        data.style.display = "flex";
        horario.style.display = "flex";
    }

    maquina.value = "#"
}

function graficoTempoReal(lista, json) {

    let inicio = ipt_horario_de.value;
    inicio = `${inicio}:00`;
    let fim = ipt_horario_ate.value;
    fim = `${fim}:00`;

    if(lista.length == 0) {
        return console.log("numfoi")
    }

    inicio = pesquisaBinaria(lista, inicio)
    fim = pesquisaBinaria(lista, fim)

    console.log('(lista[fim].dataHora).split(" ")[1]')
    console.log((lista[fim].dataHora).split(" ")[1])

    if((lista[fim].dataHora).split(" ")[1] != fim) {
        fim -= 1;
    }
    
    let criacao = setInterval(function () {
       console.log(lista[inicio].dataHora);
       console.log(lista[inicio][json.r]);
       console.log(lista[inicio][json.l]);
       
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

function retornarInicio() {
    let dashInicial = document.querySelector(".dash-inicial");
    let dashAtual = document.querySelector(".dash-filtrada");

    dashInicial.style.display = "none"
    dashAtual.style.display = "flex"
}