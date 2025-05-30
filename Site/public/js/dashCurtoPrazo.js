window.onload = function () {
    exibirKPIs();
    exibirAtms();
    exibirCores();
    quantidadeATM();
    
    setInterval(function () {
        exibirKPIs();
        exibirCores();
        listaAlertas();
        graficoAlertasPorATM();
        limparRota()
    }, 5000);
    
    setTimeout(function () {
        listaAlertas();
    }, 1000);

    setTimeout(function () {
        graficoAlertasPorATM()
    }, 1100);
    
    
};

function recarregarPagina() {
    document.getElementById("graficoAtms").style.display = "flex";
    document.getElementById("metricasdiv").style.display = "none";
    document.getElementById("graficoComponentes").style.display = "none";
    document.getElementById("corpo").style.display = "none";
}

const lista = [];
let dado1;
let data1;
let intervaloColeta = null;
let intervaloGrafico = null;
let intervaloDatas = null;
let hora;
let minutos;
let segundos;
let dia;
let mes;
let ano;
let nomeComponente;
let spanMetrica;
let diaMetrica;
let limite;
const idAgencia = sessionStorage.ID_AGENCIA
let idAtmAtual;
let valorSelecionado = null;
let AtmsMedios = 0;
let AtmsRuins = 0;
let AtmsBons = 0;
let listaAtms; 
let listaAtmsRetirar; 
let listaFiltrada;

function limparRota() {
    for (let l = 0; l < listaFiltrada.length; l++) {
        const AtmAtualLimpar = listaFiltrada[l]
        fetch(`http://localhost:3333/dadosInsert/limpar/${AtmAtualLimpar}`)
    }
}

// Exibe KPIs Gerais
function exibirKPIs() {
    fetch('/medidas/kpis')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Erro ao obter KPIs');
            }
        })
        .then(data => {

            let pisca = document.getElementById('critico');
            if (data && data.length > 0) {
                const kpiData = data[0];

                AtmsBons = kpiData.atmsSemAlertas
                AtmsMedios = kpiData.atmsMedios
                AtmsRuins = kpiData.atmsCritico

                document.getElementById('kpi1').innerText = kpiData.atmsSemAlertas;
                document.getElementById('kpi2').innerText = kpiData.atmsMedios;
                document.getElementById('kpi3').innerText = kpiData.atmsCritico;
                if (kpiData.atmsCritico > 0) {
                    pisca.classList.add('pulsar');
                }
            }
        })
        .catch(error => {
            console.error('Erro ao obter KPIs:', error);
        });
}

// Exibe a lista lateral de ATMs
function exibirAtms() {

    let nomeUsuario = sessionStorage.NOME_USUARIO;
    document.getElementById("nomeFunc").innerHTML = `Olá, ${nomeUsuario}`

    console.log("Cheguei")

    fetch(`/medidas/atms/${idAgencia}`, {
        method: "GET",
        headers: {
            "content-Type": "application/json"
        }
    })
        .then((res) => {
            console.log(res)
            res.json()
                .then(json => {
                    console.log(json)
                    const menu = document.getElementById('menuATM');
                    const temScroll = menu.scrollHeight > menu.clientHeight;

                    for (let i = 0; i < json.length; i++) {
                        console.log(json[i])
                        lista.push(i)
                        // divAtms.innerHTML += `<li><button onclick="graficoEspecifico(this)" data-valor=${i + 1}>ATM ${i + 1}</button> <div id="${i + 1}"></div></li>`
                        divAtms.innerHTML += `<li><button onclick="obterDados(this)" data-valor=${i + 1}>ATM ${i + 1}</button> <div id="${i + 1}" class="status bom"></div></li>`
                    }

                    if (temScroll) {
                        menu.style.justifyContent = 'flex-start';
                    } else {
                        menu.style.justifyContent = 'center';
                    }

                })
        })
        .catch(error => {
            console.error('Erro ao obter atms:', error);
        });
}

// Exibe as cores ao lado da Lista lateral de ATMs
function exibirCores() {
    listaAtmsRetirar = [];
    fetch(`/medidas/cores`, {
        method: "GET",
        headers: {
            "content-Type": "application/json"
        }
    })
        .then((res) => res.json())
        .then(json => {
            console.log("json recebido:", json);

            const criticos = json[0];
            const medios = json[1];


            // resetar elementos
            for (let atm = 1; atm <= lista.length; atm++) {
                const elemento = document.getElementById(`${atm}`);
                if (elemento) {
                    elemento.classList.remove("critico", "medio");
                    elemento.classList.add("bom");
                }
            }

            //  estilos dos críticos
            for (let i = 0; i < criticos.length; i++) {
                const atm = criticos[i].fkAtmCritico;
                const nivel = document.getElementById(`${atm}`);
                if (nivel) {
                    nivel.classList.remove("bom", "medio");
                    nivel.classList.add("critico");
                }
                listaAtmsRetirar.push(atm)
            }

            //  os estilos dos médios
            for (let i = 0; i < medios.length; i++) {
                const atm = medios[i].fkAtmMedio;
                const nivel2 = document.getElementById(`${atm}`);
                if (nivel2) {
                    nivel2.classList.remove("bom", "critico");
                    nivel2.classList.add("medio");
                }
                listaAtmsRetirar.push(atm)
            }

            listaFiltrada = listaAtms.filter(item => !listaAtmsRetirar.includes(item));
        })
        .catch(error => {
            console.error('Erro ao obter dados:', error);
        });
}

// Após selecionar um ATM, obtém os dados do mesmo (gera os cards)
function obterDados(button) {

    const metricas = document.getElementById("metricasdiv");
    const graficos = document.getElementById("graficoAtms");
    const componentes = document.getElementById("graficoComponentes");

    metricas.style.display = "flex";
    graficos.style.display = "none";
    componentes.style.display = "none";


    const valor = button.getAttribute("data-valor");
    idAtmAtual = button.getAttribute("data-valor");
    valorSelecionado = valor; // Guarda para reutilizar no intervalo
    console.log("Valor selecionado:", valor);


    CardTempoReal();

}

// Cria os cards de componentes
function CardTempoReal() {

    if (!valorSelecionado) return;

    fetch(`http://localhost:3333/tempoReal/monitoramento/${valorSelecionado}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(json => {
            console.log(json);

            const circuloCpuPercentual = document.getElementById("circuloCpu")
            const circuloCpuFreq = document.getElementById("circuloCpuFrequencia")
            const circuloRamPercentual = document.getElementById("circuloRam")
            const circuloRamDisponivel = document.getElementById("circuloRamDisponivel")
            const circuloDiscoUsado = document.getElementById("circuloDiscoUsado")
            const circuloDiscoDisponivel = document.getElementById("circuloDiscoDisponivel")
            const circuloRedeEnviada = document.getElementById("circuloRedeEnviada")
            const circuloRedeRecebida = document.getElementById("circuloRedeRecebida")
            const circuloProcessosAtivos = document.getElementById("circuloProcessosAtivos")
            const circuloProcessosDesativados = document.getElementById("circuloProcessosDesativados")
            const todasAsClasses = ["circulo-verde", "circulo-amarelo", "circulo-vermelho", "circulo-cinza"];
            const divRamPercent = document.getElementById("container-indicador-ram-usado");
            const divRamDisponivel = document.getElementById("container-indicador-ram-disponivel");
            const divCpuPercent = document.getElementById("container-indicador-cpu-usado");
            const divCpuFreq = document.getElementById("container-indicador-cpu-freq");
            const divDiscoPercent = document.getElementById("container-indicador-disco-usado");
            const divDiscoDisponivel = document.getElementById("container-indicador-disco-disponivel");
            const divRedeEnviada = document.getElementById("container-indicador-rede-enviada");
            const divRedeRecebida = document.getElementById("container-indicador-rede-recebida");
            const divProcessoAtivo = document.getElementById("container-indicador-processo-ativo");
            const divProcessoDesativo = document.getElementById("container-indicador-processo-desativo");
            const colunaProcesso = document.getElementById("coluna-processos")
            const colunaRam = document.getElementById("coluna-ram")
            const colunaCpu = document.getElementById("coluna-cpu")
            const colunaDisco = document.getElementById("coluna-disco")
            const colunaRede = document.getElementById("coluna-rede")



            // ve se tem dados antes de continuar
            if (!json.dados || json.dados.length === 0) {
                circuloCpuPercentual.classList.remove(...todasAsClasses);
                circuloCpuPercentual.classList.add("circulo-indicador", "circulo-cinza")
                document.getElementById("porcentagemCpu").innerHTML = `N/A`;

                circuloCpuFreq.classList.remove(...todasAsClasses);
                circuloCpuFreq.classList.add("circulo-indicador", "circulo-cinza")
                document.getElementById("frequenciaCpu").innerHTML = `N/A`;

                circuloRamPercentual.classList.remove(...todasAsClasses);
                circuloRamPercentual.classList.add("circulo-indicador", "circulo-cinza")
                document.getElementById("porcentagemRam").innerHTML = `N/A`;

                circuloRamDisponivel.classList.remove(...todasAsClasses);
                circuloRamDisponivel.classList.add("circulo-indicador", "circulo-cinza")
                document.getElementById("disponivelRam").innerHTML = `N/A`;

                circuloDiscoUsado.classList.remove(...todasAsClasses);
                circuloDiscoUsado.classList.add("circulo-indicador", "circulo-cinza")
                document.getElementById("discoUsado").innerHTML = `N/A`;

                circuloDiscoDisponivel.classList.remove(...todasAsClasses);
                circuloDiscoDisponivel.classList.add("circulo-indicador", "circulo-cinza")
                document.getElementById("discoDisponivel").innerHTML = `N/A`;

                circuloRedeEnviada.classList.remove(...todasAsClasses);
                circuloRedeEnviada.classList.add("circulo-indicador", "circulo-cinza")
                document.getElementById("redeEnviada").innerHTML = `N/A`;

                circuloRedeRecebida.classList.remove(...todasAsClasses);
                circuloRedeRecebida.classList.add("circulo-indicador", "circulo-cinza")
                document.getElementById("redeRecebida").innerHTML = `N/A`;

                circuloProcessosAtivos.classList.remove(...todasAsClasses);
                circuloProcessosAtivos.classList.add("circulo-indicador", "circulo-cinza")
                document.getElementById("processosAtivos").innerHTML = `N/A`;

                circuloProcessosDesativados.classList.remove(...todasAsClasses);
                circuloProcessosDesativados.classList.add("circulo-indicador", "circulo-cinza")
                document.getElementById("processosDesativados").innerHTML = `N/A`;

                // alert("Sem dados para exibir.");
                return;
            }

            const ultimoDado = json.dados[json.dados.length - 1]; // pega o último item do array

            // o hasOwnProperty() verifica se o objeto (json) tem uma chave com o nome fornecido
            if (ultimoDado.hasOwnProperty("CPUPercent")) {
                const cpuPercent = ultimoDado.CPUPercent;
                const cpuPercentLimite = ultimoDado["limite CPUPercent"];
                const intervaloCpuPercent = cpuPercentLimite - (cpuPercentLimite * 0.10)
                document.getElementById("limite-cpu-percent").innerHTML = ``
                document.getElementById("limite-cpu-percent").innerHTML += `Usado - Limite: ${cpuPercentLimite}%`
                
                divCpuPercent.style.display = "flex";
                circuloCpuPercentual.classList.remove(...todasAsClasses);

                if (cpuPercent >= intervaloCpuPercent && cpuPercent <= cpuPercentLimite) {
                    console.log(" to no if do medio")
                    circuloCpuPercentual.classList.add("circulo-indicador", "circulo-amarelo")
                    document.getElementById("porcentagemCpu").innerHTML = `${cpuPercent}%`;
                }

                else if (cpuPercent > cpuPercentLimite) {
                    console.log(" to no if do  passou do limite")
                    circuloCpuPercentual.classList.add("circulo-indicador", "circulo-vermelho")
                    document.getElementById("porcentagemCpu").innerHTML = `${cpuPercent}%`;
                }

                else {
                    console.log("to no if do  suave")
                    circuloCpuPercentual.classList.add("circulo-indicador", "circulo-verde")
                    document.getElementById("porcentagemCpu").innerHTML = `${cpuPercent}%`;
                }
            }

            else {
                divCpuPercent.style.display = "none";
            }


            // CPUFREQ
            if (ultimoDado.hasOwnProperty("CPUFreq")) {
                const CPUFreq = ultimoDado.CPUFreq;
                const CPUFreqLimite = ultimoDado["limite CPUFreq"];
                const intervaloCPUFreq = CPUFreqLimite - (CPUFreqLimite * 0.10)
                document.getElementById("limite-cpu-freq").innerHTML = ``
                document.getElementById("limite-cpu-freq").innerHTML += `Frequência - Limite: ${CPUFreqLimite}GHz`

                divCpuFreq.style.display = "flex";
                circuloCpuFreq.classList.remove(...todasAsClasses);

                if (CPUFreq >= intervaloCPUFreq && CPUFreq <= CPUFreqLimite) {
                    console.log(" to no if do medio")
                    circuloCpuFreq.classList.add("circulo-indicador", "circulo-amarelo")
                    document.getElementById("frequenciaCpu").innerHTML = `${CPUFreq}GHz`;
                }

                else if (CPUFreq > CPUFreqLimite) {
                    console.log(" to no if do  passou do limite")
                    circuloCpuFreq.classList.add("circulo-indicador", "circulo-vermelho")
                    document.getElementById("frequenciaCpu").innerHTML = `${CPUFreq}GHz`;
                }

                else {
                    console.log("to no if do  suave")
                    circuloCpuFreq.classList.add("circulo-indicador", "circulo-verde")
                    document.getElementById("frequenciaCpu").innerHTML = `${CPUFreq}GHz`;
                }
            }

            else {
                divCpuFreq.style.display = "none";
            }

            if (divCpuPercent.style.display == "none" && divCpuFreq.style.display == "none") {
                colunaCpu.style.display = "none"
            } else {
                colunaCpu.style.display = "flex"
            }


            // RAMPercentual
            if (ultimoDado.hasOwnProperty("RAMPercentual")) {
                const ramPercent = ultimoDado.RAMPercentual;
                const ramPercentLimite = ultimoDado["limite RAMPercentual"];
                const intervaloramPercent = ramPercentLimite - (ramPercentLimite * 0.10)
                document.getElementById("limite-ram-percent").innerHTML = ``
                document.getElementById("limite-ram-percent").innerHTML += `Usado - Limite: ${ramPercentLimite}%`

                divRamPercent.style.display = "flex";
                circuloRamPercentual.classList.remove(...todasAsClasses);

                if (ramPercent >= intervaloramPercent && ramPercent <= ramPercentLimite) {
                    console.log(" to no if do medio")
                    circuloRamPercentual.classList.add("circulo-indicador", "circulo-amarelo")
                    // Atualizando os valores no HTML
                    document.getElementById("porcentagemRam").innerHTML = `${ramPercent}%`;
                }

                else if (ramPercent > ramPercentLimite) {
                    console.log(" to no if do  passou do limite")
                    circuloRamPercentual.classList.add("circulo-indicador", "circulo-vermelho")
                    // Atualizando os valores no HTML
                    document.getElementById("porcentagemRam").innerHTML = `${ramPercent}%`;
                }

                else {
                    console.log("to no if do  suave")
                    circuloRamPercentual.classList.add("circulo-indicador", "circulo-verde")
                    // Atualizando os valores no HTML
                    document.getElementById("porcentagemRam").innerHTML = `${ramPercent}%`;
                }
            }

            else {
                divRamPercent.style.display = "none";
            }


            // RAMDisponivel
            if (ultimoDado.hasOwnProperty("RAMDisponivel")) {
                const ramDisponivel = ultimoDado.RAMDisponivel;
                const ramDisponivelLimite = ultimoDado["limite RAMDisponivel"];
                const intervaloramDisponivel = ramDisponivelLimite + (ramDisponivelLimite * 0.10)
                document.getElementById("limite-ram-disponivel").innerHTML = ``
                document.getElementById("limite-ram-disponivel").innerHTML += `Disponível - Limite: ${ramDisponivelLimite}GB`

                divRamDisponivel.style.display = "flex";
                circuloRamDisponivel.classList.remove(...todasAsClasses);

                if (ramDisponivel <= intervaloramDisponivel && ramDisponivel >= ramDisponivelLimite) {
                    console.log(" to no if do medio")
                    circuloRamDisponivel.classList.add("circulo-indicador", "circulo-amarelo")
                    // Atualizando os valores no HTML
                    document.getElementById("disponivelRam").innerHTML = `${ramDisponivel}GB`;
                }

                else if (ramDisponivel < ramDisponivelLimite) {
                    console.log(" to no if do  passou do limite")
                    circuloRamDisponivel.classList.add("circulo-indicador", "circulo-vermelho")
                    // Atualizando os valores no HTML
                    document.getElementById("disponivelRam").innerHTML = `${ramDisponivel}GB`;
                }

                else {
                    console.log("to no if do  suave")
                    circuloRamDisponivel.classList.add("circulo-indicador", "circulo-verde")
                    // Atualizando os valores no HTML
                    document.getElementById("disponivelRam").innerHTML = `${ramDisponivel}GB`;
                }
            }

            else {
                divRamDisponivel.style.display = "none";
            }
            if (divRamDisponivel.style.display == "none" && divRamPercent.style.display == "none") {
                colunaRam.style.display = "none"
            } else {
                colunaRam.style.display = "flex"
            }


            // DISKPercentual
            if (ultimoDado.hasOwnProperty("DISKPercentual")) {
                const discoUsado = ultimoDado.DISKPercentual;
                const discoUsadoLimite = ultimoDado["limite DISKPercentual"];
                const intervalodiscoUsado = discoUsadoLimite - (discoUsadoLimite * 0.10)
                document.getElementById("limite-disco-percent").innerHTML = ``
                document.getElementById("limite-disco-percent").innerHTML += `Usado - Limite: ${discoUsadoLimite}%`



                divDiscoPercent.style.display = "flex";
                circuloDiscoUsado.classList.remove(...todasAsClasses);

                if (discoUsado >= intervalodiscoUsado && discoUsado <= discoUsadoLimite) {
                    console.log(" to no if do medio")
                    circuloDiscoUsado.classList.add("circulo-indicador", "circulo-amarelo")
                    // Atualizando os valores no HTML
                    document.getElementById("discoUsado").innerHTML = `${discoUsado}%`;
                }

                else if (discoUsado > discoUsadoLimite) {
                    console.log(" to no if do  passou do limite")
                    circuloDiscoUsado.classList.add("circulo-indicador", "circulo-vermelho")
                    // Atualizando os valores no HTML
                    document.getElementById("discoUsado").innerHTML = `${discoUsado}%`;
                }

                else {
                    console.log("to no if do  suave")
                    circuloDiscoUsado.classList.add("circulo-indicador", "circulo-verde")
                    // Atualizando os valores no HTML
                    document.getElementById("discoUsado").innerHTML = `${discoUsado}%`;
                }
            }

            else {
                divDiscoPercent.style.display = "none";
            }


            // DISKDisponivel
            if (ultimoDado.hasOwnProperty("DISKDisponivel")) {
                const discoDisponivel = ultimoDado.DISKDisponivel;
                const discoDisponivelLimite = ultimoDado["limite DISKDisponivel"];
                const intervalodiscoDisponivel = discoDisponivelLimite + (discoDisponivelLimite * 0.10)
                document.getElementById("limite-disco-disponivel").innerHTML = ``
                document.getElementById("limite-disco-disponivel").innerHTML += `Disponível - Limite: ${discoDisponivelLimite}GB`

                divDiscoDisponivel.style.display = "flex";
                circuloDiscoDisponivel.classList.remove(...todasAsClasses);

                if (discoDisponivel <= intervalodiscoDisponivel && discoDisponivel >= discoDisponivelLimite) {
                    console.log(" to no if do medio")
                    circuloDiscoDisponivel.classList.add("circulo-indicador", "circulo-amarelo")
                    // Atualizando os valores no HTML
                    document.getElementById("discoDisponivel").innerHTML = `${discoDisponivel}GB`;
                }

                else if (discoDisponivel < discoDisponivelLimite) {
                    console.log(" to no if do  passou do limite")
                    circuloDiscoDisponivel.classList.add("circulo-indicador", "circulo-vermelho")
                    // Atualizando os valores no HTML
                    document.getElementById("discoDisponivel").innerHTML = `${discoDisponivel}GB`;
                }

                else {
                    console.log("to no if do  suave")
                    circuloDiscoDisponivel.classList.add("circulo-indicador", "circulo-verde")
                    // Atualizando os valores no HTML
                    document.getElementById("discoDisponivel").innerHTML = `${discoDisponivel}GB`;
                }
            }

            else {
                divDiscoDisponivel.style.display = "none";
            }
            if (divDiscoDisponivel.style.display == "none" && divDiscoPercent.style.display == "none") {
                colunaDisco.style.display = "none"
            } else {
                colunaDisco.style.display = "flex"
            }            

            // REDEEnviada
            if (ultimoDado.hasOwnProperty("REDEEnviada")) {
                const redeEnviada = ultimoDado.REDEEnviada;
                const redeEnviadaLimite = ultimoDado["limite REDEEnviada"];
                const intervaloredeEnviada = redeEnviadaLimite - (redeEnviadaLimite * 0.10)
                document.getElementById("limite-rede-env").innerHTML = ``
                document.getElementById("limite-rede-env").innerHTML += `Enviados - Limite: ${redeEnviadaLimite}MB/s`

                divRedeEnviada.style.display = "flex";
                circuloRedeEnviada.classList.remove(...todasAsClasses);

                if (redeEnviada >= intervaloredeEnviada && redeEnviada <= redeEnviadaLimite) {
                    console.log(" to no if do medio")
                    circuloRedeEnviada.classList.add("circulo-indicador", "circulo-amarelo")
                    // Atualizando os valores no HTML
                    document.getElementById("redeEnviada").innerHTML = `${redeEnviada}MB/s`; //bytes enviados por segundo
                }

                else if (redeEnviada > redeEnviadaLimite) {
                    console.log(" to no if do  passou do limite")
                    circuloRedeEnviada.classList.add("circulo-indicador", "circulo-vermelho")
                    // Atualizando os valores no HTML
                    document.getElementById("redeEnviada").innerHTML = `${redeEnviada}MB/s`;
                }

                else {
                    console.log("to no if do  suave")
                    circuloRedeEnviada.classList.add("circulo-indicador", "circulo-verde")
                    // Atualizando os valores no HTML
                    document.getElementById("redeEnviada").innerHTML = `${redeEnviada}MB/s`;
                }
            }

            else {
                divRedeEnviada.style.display = "none";
            }

            // REDERecebida
            if (ultimoDado.hasOwnProperty("REDERecebida")) {
                const redeRecebida = ultimoDado.REDERecebida;
                const redeRecebidaLimite = ultimoDado["limite REDERecebida"];
                const intervaloredeRecebida = redeRecebidaLimite - (redeRecebidaLimite * 0.10)
                document.getElementById("limite-rede-rec").innerHTML = ``
                document.getElementById("limite-rede-rec").innerHTML += `Recebidos - Limite: ${redeRecebidaLimite}MB/s`

                divRedeRecebida.style.display = "flex";
                circuloRedeRecebida.classList.remove(...todasAsClasses);

                if (redeRecebida >= intervaloredeRecebida && redeRecebida <= redeRecebidaLimite) {
                    console.log(" to no if do medio")
                    circuloRedeRecebida.classList.add("circulo-indicador", "circulo-amarelo")
                    // Atualizando os valores no HTML
                    document.getElementById("redeRecebida").innerHTML = `${redeRecebida}MB/s`;
                }

                else if (redeRecebida > redeRecebidaLimite) {
                    console.log(" to no if do  passou do limite")
                    circuloRedeRecebida.classList.add("circulo-indicador", "circulo-vermelho")
                    // Atualizando os valores no HTML
                    document.getElementById("redeRecebida").innerHTML = `${redeRecebida}MB/s`;
                }

                else {
                    console.log("to no if do  suave")
                    circuloRedeRecebida.classList.add("circulo-indicador", "circulo-verde")
                    // Atualizando os valores no HTML
                    document.getElementById("redeRecebida").innerHTML = `${redeRecebida}MB/s`;
                }
            }

            else {
                divRedeRecebida.style.display = "none";
            }

            if (divRedeEnviada.style.display == "none" && divRedeRecebida.style.display == "none") {
                colunaRede.style.display = "none"
            } else {
                colunaRede.style.display = "flex"
            }

            // PROCESSOAtivos
            if (ultimoDado.hasOwnProperty("PROCESSOSAtivos")) {
                const processosAtivos = ultimoDado.PROCESSOSAtivos;
                const processosAtivosLimite = ultimoDado["limite PROCESSOSAtivos"];
                const intervaloprocessosAtivos = processosAtivosLimite - (processosAtivosLimite * 0.10)
                document.getElementById("limite-processo-ativo").innerHTML = ``
                document.getElementById("limite-processo-ativo").innerHTML += `Processos On - Limite: ${processosAtivosLimite}`

                divProcessoAtivo.style.display = "flex";
                circuloProcessosAtivos.classList.remove(...todasAsClasses);

                if (processosAtivos >= intervaloprocessosAtivos && processosAtivos <= processosAtivosLimite) {
                    console.log(" to no if do medio")
                    circuloProcessosAtivos.classList.add("circulo-indicador", "circulo-amarelo")
                    // Atualizando os valores no HTML
                    document.getElementById("processosAtivos").innerHTML = `${processosAtivos}`;
                }

                else if (processosAtivos > processosAtivosLimite) {
                    console.log(" to no if do  passou do limite")
                    circuloProcessosAtivos.classList.add("circulo-indicador", "circulo-vermelho")
                    // Atualizando os valores no HTML
                    document.getElementById("processosAtivos").innerHTML = `${processosAtivos}`;
                }

                else {
                    console.log("to no if do  suave")
                    circuloProcessosAtivos.classList.add("circulo-indicador", "circulo-verde")
                    // Atualizando os valores no HTML
                    document.getElementById("processosAtivos").innerHTML = `${processosAtivos}`;
                }
            }

            else {
                divProcessoAtivo.style.display = "none";
            }

            // PROCESSODesativado
            if (ultimoDado.hasOwnProperty("PROCESSOSDesativado")) {
                const processosDesativados = ultimoDado.PROCESSOSDesativado;
                const processosDesativadosLimite = ultimoDado["limite PROCESSOSDesativado"];
                const intervaloprocessosDesativados = processosDesativadosLimite - (processosDesativadosLimite * 0.10)
                document.getElementById("limite-processo-desativo").innerHTML = ``
                document.getElementById("limite-processo-desativo").innerHTML += `Processos Off - Limite: ${processosDesativadosLimite}`

                divProcessoDesativo.style.display = "flex";
                circuloProcessosDesativados.classList.remove(...todasAsClasses);

                if (processosDesativados >= intervaloprocessosDesativados && processosDesativados <= processosDesativadosLimite) {
                    console.log(" to no if do medio")
                    circuloProcessosDesativados.classList.add("circulo-indicador", "circulo-amarelo")
                    // Atualizando os valores no HTML
                    document.getElementById("processosDesativados").innerHTML = `${processosDesativados}`;
                }

                else if (processosDesativados > processosDesativadosLimite) {
                    console.log(" to no if do  passou do limite")
                    circuloProcessosDesativados.classList.add("circulo-indicador", "circulo-vermelho")
                    // Atualizando os valores no HTML
                    document.getElementById("processosDesativados").innerHTML = `${processosDesativados}`;
                }

                else {
                    console.log("to no if do  suave")
                    circuloProcessosDesativados.classList.add("circulo-indicador", "circulo-verde")
                    // Atualizando os valores no HTML
                    document.getElementById("processosDesativados").innerHTML = `${processosDesativados}`;
                }
            }

            else {
                divProcessoDesativo.style.display = "none";
            }

            if (divProcessoAtivo.style.display == "none" && divProcessoDesativo.style.display == "none") {
                colunaProcesso.style.display = "none"
                // colunaRede.style.borderRight = "none"
            } else {
                colunaProcesso.style.display = "flex"
                // colunaRede.style.borderRight = "1px solid gray"
            }

            // Define qual será o intervalo para tentar coletar outro dado
            setTimeout(CardTempoReal, 3000);

        })
        .catch(error => {
            console.error('Erro ao obter dados:', error);
        });

}


let tipoComponente;
// Função que está dentro de cada bolinha e abre o Gráfico de Linha
function verGraficos(id) {
    const metricas = document.getElementById("metricasdiv");
    const graficos = document.getElementById("graficoAtms");
    const componentes = document.getElementById("graficoComponentes");
    const carregando = document.getElementById("carregando");
    tipoComponente = id;

    // Mostrar o "Carregando..." e esconder tudo
    metricas.style.display = "none";
    graficos.style.display = "none";
    componentes.style.display = "none";
    carregando.style.display = "block";

    // Depois de 3 segundos, mostrar a div correta
    setTimeout(() => {
        carregando.style.display = "none";

        if (componentes.style.display === "none" || componentes.style.display === "") {
            componentes.style.display = "flex";
            document.getElementById("corpo").style.display = "flex";
        } else {
            graficos.style.display = "flex";
            document.getElementById("corpo").style.display = "none";
        }
    }, 4200);

    console.log(tipoComponente);

    // limpar vetores e intervals antigos
    nomeComponente = "";
    spanMetrica = "";
    dadosMetricas = [];
    dataColetas = [];
    limite = 0;
    if (intervaloColeta) clearInterval(intervaloColeta);
    if (intervaloGrafico) clearInterval(intervaloGrafico);

    // eu coleto os 6 ultimos dados de uma vez para diminuir a demora para carregar o gráfico
    primeiraColeta();
    // eu acrescento um dado e retiro o ultimo
    intervaloColeta = setInterval(coletaUm, 4000, 'tipoComponente');
    // depois da primeira, começa a coletar a cada 4 segundos normalmente
    intervaloGrafico = setInterval(atualizarGrafico, 4100);
    console.log("tipoComponente: ", id)

// setInterval(coletaUm, 4000, 'meuParametro');
}

let dadosMetricas = [];
let dataColetas = [];

// Realiza a coleta dos 6 últimos registros (Gráfico de Linha), usa o id de verGraficos(id) para saber qual a métrica atual
function primeiraColeta() {

    fetch(`http://localhost:3333/tempoReal/monitoramento/${idAtmAtual}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(json => {

            console.log("to testando: ", json.dados[0].dataHora)

            if (tipoComponente == "circuloRam") {
                for (let i = 0; i < json.dados.length; i++) {
                    const dadoAtual = json.dados[i].RAMPercentual;
                    const dataAtual = json.dados[i].dataHora;

                    let partesHora = dataAtual.split(' ')[1].split(':');
                    let partesDia = dataAtual.split(' ')[0].split('-');

                    dia = partesDia[2];
                    mes = partesDia[1];
                    ano = partesDia[0];

                    hora = partesHora[0];
                    minutos = partesHora[1];
                    segundos = partesHora[2];

                    dadosMetricas.push(dadoAtual);
                    dataColetas.push(`${minutos}Min:${segundos}Seg`);
                    diaMetrica = `${dia}/${mes}/${ano}`;
                }

            } else if (tipoComponente == "circuloRamDisponivel") {

                for (let i = 0; i < json.dados.length; i++) {
                    const dadoAtual = json.dados[i].RAMDisponivel;
                    const dataAtual = json.dados[i].dataHora;

                    let partesHora = dataAtual.split(' ')[1].split(':');
                    let partesDia = dataAtual.split(' ')[0].split('-');

                    dia = partesDia[2];
                    mes = partesDia[1];
                    ano = partesDia[0];

                    hora = partesHora[0];
                    minutos = partesHora[1];
                    segundos = partesHora[2];

                    dadosMetricas.push(dadoAtual);
                    dataColetas.push(`${minutos}Min:${segundos}Seg`);
                    diaMetrica = `${dia}/${mes}/${ano}`;
                }


            } else if (tipoComponente == "circuloCpu") {

                console.log("to aqui em")
                for (let i = 0; i < json.dados.length; i++) {
                    const dadoAtual = json.dados[i].CPUPercent;
                    const dataAtual = json.dados[i].dataHora;

                    let partesHora = dataAtual.split(' ')[1].split(':');
                    let partesDia = dataAtual.split(' ')[0].split('-');

                    dia = partesDia[2];
                    mes = partesDia[1];
                    ano = partesDia[0];

                    hora = partesHora[0];
                    minutos = partesHora[1];
                    segundos = partesHora[2];

                    dadosMetricas.push(dadoAtual);
                    dataColetas.push(`${minutos}Min:${segundos}Seg`);
                    diaMetrica = `${dia}/${mes}/${ano}`;
                }

            } else if (tipoComponente == "circuloCpuFrequencia") {

                for (let i = 0; i < json.dados.length; i++) {
                    const dadoAtual = json.dados[i].CPUFreq;
                    const dataAtual = json.dados[i].dataHora;

                    let partesHora = dataAtual.split(' ')[1].split(':');
                    let partesDia = dataAtual.split(' ')[0].split('-');

                    dia = partesDia[2];
                    mes = partesDia[1];
                    ano = partesDia[0];

                    hora = partesHora[0];
                    minutos = partesHora[1];
                    segundos = partesHora[2];

                    dadosMetricas.push(dadoAtual);
                    dataColetas.push(`${minutos}Min:${segundos}Seg`);
                    diaMetrica = `${dia}/${mes}/${ano}`;
                }


            } else if (tipoComponente == "circuloDiscoUsado") {

                for (let i = 0; i < json.dados.length; i++) {
                    const dadoAtual = json.dados[i].DISKPercentual;
                    const dataAtual = json.dados[i].dataHora;

                    let partesHora = dataAtual.split(' ')[1].split(':');
                    let partesDia = dataAtual.split(' ')[0].split('-');

                    dia = partesDia[2];
                    mes = partesDia[1];
                    ano = partesDia[0];

                    hora = partesHora[0];
                    minutos = partesHora[1];
                    segundos = partesHora[2];

                    dadosMetricas.push(dadoAtual);
                    dataColetas.push(`${minutos}Min:${segundos}Seg`);
                    diaMetrica = `${dia}/${mes}/${ano}`;
                }

            } else if (tipoComponente == "circuloDiscoDisponivel") {

                for (let i = 0; i < json.dados.length; i++) {
                    const dadoAtual = json.dados[i].DISKDisponivel;
                    const dataAtual = json.dados[i].dataHora;

                    let partesHora = dataAtual.split(' ')[1].split(':');
                    let partesDia = dataAtual.split(' ')[0].split('-');

                    dia = partesDia[2];
                    mes = partesDia[1];
                    ano = partesDia[0];

                    hora = partesHora[0];
                    minutos = partesHora[1];
                    segundos = partesHora[2];

                    dadosMetricas.push(dadoAtual);
                    dataColetas.push(`${minutos}Min:${segundos}Seg`);
                    diaMetrica = `${dia}/${mes}/${ano}`;
                }


            } else if (tipoComponente == "circuloRedeEnviada") {

                for (let i = 0; i < json.dados.length; i++) {
                    const dadoAtual = json.dados[i].REDEEnviada;
                    const dataAtual = json.dados[i].dataHora;

                    let partesHora = dataAtual.split(' ')[1].split(':');
                    let partesDia = dataAtual.split(' ')[0].split('-');

                    dia = partesDia[2];
                    mes = partesDia[1];
                    ano = partesDia[0];

                    hora = partesHora[0];
                    minutos = partesHora[1];
                    segundos = partesHora[2];

                    dadosMetricas.push(dadoAtual);
                    dataColetas.push(`${minutos}Min:${segundos}Seg`);
                    diaMetrica = `${dia}/${mes}/${ano}`;
                }


            } else if (tipoComponente == "circuloRedeRecebida") {

                for (let i = 0; i < json.dados.length; i++) {
                    const dadoAtual = json.dados[i].REDERecebida;
                    const dataAtual = json.dados[i].dataHora;

                    let partesHora = dataAtual.split(' ')[1].split(':');
                    let partesDia = dataAtual.split(' ')[0].split('-');

                    dia = partesDia[2];
                    mes = partesDia[1];
                    ano = partesDia[0];

                    hora = partesHora[0];
                    minutos = partesHora[1];
                    segundos = partesHora[2];

                    dadosMetricas.push(dadoAtual);
                    dataColetas.push(`${minutos}Min:${segundos}Seg`);
                    diaMetrica = `${dia}/${mes}/${ano}`;
                }


            } else if (tipoComponente == "circuloProcessosAtivos") {

                for (let i = 0; i < json.dados.length; i++) {
                    const dadoAtual = json.dados[i].PROCESSOSAtivos;
                    const dataAtual = json.dados[i].dataHora;


                    let partesHora = dataAtual.split(' ')[1].split(':');
                    let partesDia = dataAtual.split(' ')[0].split('-');

                    dia = partesDia[2];
                    mes = partesDia[1];
                    ano = partesDia[0];

                    hora = partesHora[0];
                    minutos = partesHora[1];
                    segundos = partesHora[2];

                    dadosMetricas.push(dadoAtual);
                    dataColetas.push(`${minutos}Min:${segundos}Seg`);
                    diaMetrica = `${dia}/${mes}/${ano}`;
                }


            } else if (tipoComponente == "circuloProcessosDesativados") {

                for (let i = 0; i < json.dados.length; i++) {
                    const dadoAtual = json.dados[i].PROCESSOSDesativado;
                    const dataAtual = json.dados[i].dataHora;

                    let partesHora = dataAtual.split(' ')[1].split(':');
                    let partesDia = dataAtual.split(' ')[0].split('-');

                    dia = partesDia[2];
                    mes = partesDia[1];
                    ano = partesDia[0];

                    hora = partesHora[0];
                    minutos = partesHora[1];
                    segundos = partesHora[2];

                    dadosMetricas.push(dadoAtual);
                    dataColetas.push(`${minutos}Min:${segundos}Seg`);
                    diaMetrica = `${dia}/${mes}/${ano}`;
                }
            }





            // console.log(dadosMetricas);
        })
        .catch(error => {
            console.error('Erro ao obter dados:', error);
        });
}

// Realiza a coleta, inclui no vetor e exclui o registro mais antigo (Gráfico de Linha), usa o id de verGraficos(id) para saber qual a métrica atual
function coletaUm() {
    console.log("Atm Atual: ", idAtmAtual)
    fetch(`http://localhost:3333/tempoReal/monitoramento/${idAtmAtual}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(json => {
            const ultimoDado = json.dados[json.dados.length - 1];

            if (tipoComponente == "circuloRam") {
                dado1 = ultimoDado.RAMPercentual;
                data1 = ultimoDado.dataHora;
                nomeComponente = "RAM";
                spanMetrica = "(Porcentagem)";
                limite = ultimoDado["limite RAMPercentual"];

            } else if (tipoComponente == "circuloRamDisponivel") {
                dado1 = ultimoDado.RAMDisponivel;
                data1 = ultimoDado.dataHora;
                nomeComponente = "RAM";
                spanMetrica = "(Disponível)";
                limite = ultimoDado["limite RAMDisponivel"];


            } else if (tipoComponente == "circuloCpu") {
                dado1 = ultimoDado.CPUPercent;
                data1 = ultimoDado.dataHora;
                nomeComponente = "CPU";
                spanMetrica = "(Porcentagem)";
                limite = ultimoDado["limite CPUPercent"];

            } else if (tipoComponente == "circuloCpuFrequencia") {
                dado1 = ultimoDado.CPUFreq;
                data1 = ultimoDado.dataHora;
                nomeComponente = "CPU";
                spanMetrica = "(GHz)";
                limite = ultimoDado["limite CPUFreq"];


            } else if (tipoComponente == "circuloDiscoUsado") {
                dado1 = ultimoDado.DISKPercentual;
                data1 = ultimoDado.dataHora;
                nomeComponente = "DISCO";
                spanMetrica = "(Porcentagem)";
                limite = ultimoDado["limite DISKPercentual"];

            } else if (tipoComponente == "circuloDiscoDisponivel") {
                dado1 = ultimoDado.DISKDisponivel;
                data1 = ultimoDado.dataHora;
                nomeComponente = "DISCO";
                spanMetrica = "(Disponível)";
                limite = ultimoDado["limite DISKDisponivel"];


            } else if (tipoComponente == "circuloRedeEnviada") {
                dado1 = ultimoDado.REDEEnviada;
                data1 = ultimoDado.dataHora;
                nomeComponente = "REDE";
                spanMetrica = "(Enviada MB/s)";
                limite = ultimoDado["limite REDEEnviada"];


            } else if (tipoComponente == "circuloRedeRecebida") {
                dado1 = ultimoDado.REDERecebida;
                data1 = ultimoDado.dataHora;
                nomeComponente = "REDE";
                spanMetrica = "(Recebida MB/s)";
                limite = ultimoDado["limite REDERecebida"];


            } else if (tipoComponente == "circuloProcessosAtivos") {
                dado1 = ultimoDado.PROCESSOSAtivos;
                data1 = ultimoDado.dataHora;
                nomeComponente = "PROCESSOS";
                spanMetrica = "(Ativos)";
                limite = ultimoDado["limite PROCESSOSAtivos"];


            } else if (tipoComponente == "circuloProcessosDesativados") {
                dado1 = ultimoDado.PROCESSOSDesativado;
                data1 = ultimoDado.dataHora;
                nomeComponente = "PROCESSOS";
                spanMetrica = "(Desativados)";
                limite = ultimoDado["limite PROCESSOSDesativado"];
            }

            if (dadosMetricas.length >= 6) {
                dadosMetricas.shift();
            }

            if (dataColetas.length >= 6) {
                dataColetas.shift();
            }


            // split(' ') separa a data da hora → ["2025-05-05", "17:53:02"]
            // [1] pega a parte da hora (':' define as separações)
            let partesHora = data1.split(' ')[1].split(':');
            let partesDia = data1.split(' ')[0].split('-');

            dia = partesDia[2];
            mes = partesDia[1];
            ano = partesDia[0];

            hora = partesHora[0];
            minutos = partesHora[1];
            segundos = partesHora[2];

            dadosMetricas.push(dado1);
            dataColetas.push(`${minutos}Min:${segundos}Seg`);
            diaMetrica = `${dia}/${mes}/${ano}`;

            // console.log(dadosMetricas);
        })
        .catch(error => {
            console.error('Erro ao obter dados:', error);
        });
}

// Função que atualiza o gráfico após ele ser exibido
function atualizarGrafico() {

    let nomeMetrica = document.getElementById("nomeMetrica");
    let tipoMetrica = document.getElementById("tipoMetrica");
    let dataMetrica = document.getElementById("dataMetrica");
    let horaMetrica = document.getElementById("horaMetrica");

    nomeMetrica.innerHTML = `${nomeComponente}`;
    tipoMetrica.innerHTML = `- ${spanMetrica}`;
    dataMetrica.innerHTML = `- ${diaMetrica}`;
    horaMetrica.innerHTML = `- Horário: ${hora}h`;

    const ctx = document.getElementById('meuGrafico10').getContext('2d');

    if (window.meuGrafico) {
        window.meuGrafico.destroy();
    }

    
    let maximoY;
    
    let maxY = Math.max(...dadosMetricas);  // mesmo que Math.max(10, 20, 5, 30) pega 30
    
    if (maxY > limite) {
        maximoY = maxY + (maxY * 0.20);
    } else {
        maximoY = limite + (limite * 0.30);
    }
    
    if (spanMetrica == "(Porcentagem)") {
        maximoY = 100
    }

    if (nomeComponente == "RAM" && spanMetrica == "(Disponível)") {
        maximoY = 16
    }

    let minimoY;

    let minY = Math.min(...dadosMetricas);

    if (maxY > limite) {
        minimoY = limite - (limite * 0.10)
    }
    else if (minimoY < 0) {
        minimoY = 0
    }
    else {
        minimoY = minY - (minY * 0.20)
    }




    window.meuGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataColetas,
            datasets: [{
                label: 'Uso da CPU (%)',
                data: dadosMetricas,
                borderColor: 'rgba(141, 52, 249, 1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                backgroundColor: 'rgba(141, 52, 249, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                annotation: {
                    annotations: {
                        linhaLimite: {
                            type: 'line',
                            yMin: limite,
                            yMax: limite,
                            borderColor: 'red',
                            borderWidth: 2
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'black',
                        font: { size: 16 }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: maximoY,
                    min: minimoY,
                    ticks: {
                        stepSize: 5,
                        color: 'black',
                        font: { size: 16 }
                    }
                }
            }
        }
    });
}


let qtd = 0
let qtdAtms = 0;

function quantidadeATM() {
    listaAtms = [];
    fetch(`http://localhost:3333/validarAtm/atms/1`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(json => {
            qtdAtms = json[0]["count(idAtm)"];
            // console.log("Quantidade de ATMs:", qtdAtms);
            for (let i = 1; i <= qtdAtms; i++) {
                listaAtms.push(i); 
            }
        })
        .catch(error => {
            console.error('Erro ao obter a quantidade de ATMs:', error);
        });
}



function listaAlertas() {
    let oine = document.getElementById("conteudo_tabela");
    oine.innerHTML = "";

    if(AtmsBons === qtdAtms){
        oine.innerHTML = 
        `
            <div class="headOk"> 
                <div class="atmsBons" style="width: 50%">Todos os Atm's em Bom estado</div> 
                <div class="atmsBons">0 Alertas</div> 
                <div class="atmsBons">OK</div> 
            </div>
        `;
        return
    }

    let linhas = [];
    let totalBuscados = 0;

    for (let i = 1; i <= qtdAtms; i++) {
        const atmAtual = i;

        fetch(`http://localhost:3333/dadosInsert/alerta/${atmAtual}`)
            .then(res => res.json())
            .then(json => {
                if (
                    json &&
                    Array.isArray(json.dados) &&
                    json.dados.length > 0 &&
                    Array.isArray(json.dados[json.dados.length - 1])
                ) {
                    const ultimoRegistro = json.dados[json.dados.length - 1];
                    let qtd = ultimoRegistro.length;

                    // Começa assumindo que todos os alertas são médios
                    let tipo = "Médio";
                    let estilo = "medio";
                    for (let j = 0; j < qtd; j++) {
                        let alerta = ultimoRegistro[j];
                        let parametro = alerta.parametro;
                        let valor = alerta.valor;
                        let limite = alerta.limite;

                        if (parametro.includes("Disponivel")) {
                          
                            if (valor < limite) {
                                tipo = "Crítico";
                                estilo = "critico";
                                break;
                            }
                        } else {
                            
                            if (valor > limite) {
                                tipo = "Crítico";
                                estilo = "critico";
                                break;
                            }
                        }
                    }

                    linhas.push({
                        criticidade: tipo,
                        html: `
                            <div class="tabela"> 
                                <h1 class="corLista" id="${estilo}"></h1> 
                                <div>ATM - ${atmAtual}</div> 
                                <div>${qtd} Alertas</div> 
                                <div>${tipo}</div> 
                                <button class="btn-nav-lista" data-valor=${atmAtual} onclick="obterDados(this)">Acessar</button>
                            </div>
                        `
                    });
                }

            })
            .catch(error => {
                console.warn(`Erro ao buscar alertas do ATM ${atmAtual}:`, error);
            })
            .finally(() => {
                totalBuscados++;

                if (totalBuscados === qtdAtms) {
                    linhas.sort((a, b) => {
                        if (a.criticidade === "Crítico" && b.criticidade !== "Crítico") return -1;
                        if (a.criticidade !== "Crítico" && b.criticidade === "Crítico") return 1;
                        return 0;
                    });

                    for (let k = 0; k < linhas.length; k++) {
                        oine.innerHTML += linhas[k].html;
                    }
                }
                
            });
    }
}





// Gráfico tela inicial
let chartAtm = null;
let chartAtmDataCache = null; // guarda os últimos dados usados

function graficoAlertasPorATM() {
    let bom = qtdAtms - (AtmsRuins + AtmsMedios);

    let ruimPorcentagem = (AtmsRuins / qtdAtms) * 100;
    let medioPorcentagem = (AtmsMedios / qtdAtms) * 100;
    let bomPorcentagem = (bom / qtdAtms) * 100;

    const newData = [ruimPorcentagem, bomPorcentagem, medioPorcentagem];

    // Compara com os dados antigos: se forem iguais, não atualiza
    if (
        chartAtmDataCache &&
        JSON.stringify(chartAtmDataCache) === JSON.stringify(newData)
    ) {
        console.log("Os dados do gráfico não mudaram. Nenhuma atualização feita.");
        return; // sai da função sem atualizar o gráfico
    }

    // Atualiza cache com novos dados
    chartAtmDataCache = newData;

    const ctx = document.getElementById('myChart').getContext('2d');

    if (chartAtm !== null) {
        chartAtm.destroy();
    }

    chartAtm = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Ruim', 'Bom', 'Médio'],
            datasets: [{
                data: newData,
                backgroundColor: ['#b63a3a', 'rgba(120, 221, 92, 0.622)', 'rgba(210, 207, 50, 0.752)'],
                borderWidth: 0,
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#FFFFFF',
                        font: {
                            size: 14
                        }
                    }
                },
                datalabels: {
                    formatter: (value) => {
                        return value > 0 ? `${value.toFixed(1)}%` : '';
                    },
                    color: '#FFFFFF',
                    font: {
                        weight: 'bold',
                        size: 14
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}







