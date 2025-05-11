window.onload = function () {
    exibirKPIs();
    exibirAtms();
    exibirCores();


    setInterval(function () {
        exibirKPIs();
        exibirCores()
    }, 5000);

    graficoAlertasPorATM()

};

const lista = [];
let dado1;
let data1;
let intervaloColeta = null;
let intervaloGrafico = null;
let intervaloDatas = null;
let dadosMetricas = [];
let dataColetas = [];
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



const id = sessionStorage.ID_AGENCIA

function exibirAtms() {

    let nomeUsuario = sessionStorage.NOME_USUARIO;
    document.getElementById("nomeFunc").innerHTML = `Olá, ${nomeUsuario}`

    console.log("Cheguei")

    fetch(`/medidas/atms/${id}`, {
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
                    for (let i = 0; i < json.length; i++) {
                        console.log(json[i])
                        lista.push(i)
                        // divAtms.innerHTML += `<li><button onclick="graficoEspecifico(this)" data-valor=${i + 1}>ATM ${i + 1}</button> <div id="${i + 1}"></div></li>`
                        divAtms.innerHTML += `<li><button onclick="graficoEspecifico(this)" data-valor=${i + 1}>ATM ${i + 1}</button> <div id="${i + 1}" class="status bom"></div></li>`
                    }
                })
        })
        .catch(error => {
            console.error('Erro ao obter atms:', error);
        });
}

function exibirCores() {
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
            }

            //  os estilos dos médios
            for (let i = 0; i < medios.length; i++) {
                const atm = medios[i].fkAtmMedio;
                const nivel2 = document.getElementById(`${atm}`);
                if (nivel2) {
                    nivel2.classList.remove("bom", "critico");
                    nivel2.classList.add("medio");
                }
            }
        })
        .catch(error => {
            console.error('Erro ao obter dados:', error);
        });
}

function verGraficos(id) {
    const metricas = document.getElementById("metricasdiv");
    const graficos = document.getElementById("graficoAtms");
    const componentes = document.getElementById("graficoComponentes");
    const carregando = document.getElementById("carregando");

    // Mostrar o "Carregando..." e esconder tudo
    metricas.style.display = "none";
    graficos.style.display = "none";
    componentes.style.display = "none";
    carregando.style.display = "block";

    // Depois de 10 segundos, mostrar a div correta
    setTimeout(() => {
        carregando.style.display = "none";

        if (componentes.style.display === "none" || componentes.style.display === "") {
            componentes.style.display = "flex";
        } else {
            graficos.style.display = "flex";
        }
    }, 4100); 

    console.log(id);

    // limpar vetores e intervals antigos
    nomeComponente = "";
    spanMetrica = "";
    dadosMetricas = [];
    dataColetas = [];
    limite = 0;
    if (intervaloColeta) clearInterval(intervaloColeta);
    if (intervaloGrafico) clearInterval(intervaloGrafico);

    // eu coleto os 6 ultimos dados de uma vez para diminuir a demora para carregar o gráfico
    function primeiraColeta() {
        fetch(`http://localhost:3333/tempoReal/monitoramento/${valorTeste}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(json => {
    
                if (id == "circuloRam") {
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
                        dataColetas.push(`${minutos}:${segundos}`);
                        diaMetrica = `${dia}/${mes}/${ano}`;
                    }
    
                } else if (id == "circuloRamDisponivel") {
    
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
                        dataColetas.push(`${minutos}:${segundos}`);
                        diaMetrica = `${dia}/${mes}/${ano}`;
                    }
    
    
                } else if (id == "circuloCpu") {
    
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
                        dataColetas.push(`${minutos}:${segundos}`);
                        diaMetrica = `${dia}/${mes}/${ano}`;
                    }
    
                } else if (id == "circuloCpuFrequencia") {
    
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
                        dataColetas.push(`${minutos}:${segundos}`);
                        diaMetrica = `${dia}/${mes}/${ano}`;
                    }
    
    
                } else if (id == "circuloDiscoUsado") {
    
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
                        dataColetas.push(`${minutos}:${segundos}`);
                        diaMetrica = `${dia}/${mes}/${ano}`;
                    }
    
                } else if (id == "circuloDiscoDisponivel") {
    
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
                        dataColetas.push(`${minutos}:${segundos}`);
                        diaMetrica = `${dia}/${mes}/${ano}`;
                    }
    
    
                } else if (id == "circuloRedeEnviada") {
    
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
                        dataColetas.push(`${minutos}:${segundos}`);
                        diaMetrica = `${dia}/${mes}/${ano}`;
                    }
    
    
                } else if (id == "circuloRedeRecebida") {
    
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
                        dataColetas.push(`${minutos}:${segundos}`);
                        diaMetrica = `${dia}/${mes}/${ano}`;
                    }
    
    
                } else if (id == "circuloProcessosAtivos") {
    
                    for (let i = 0; i < json.dados.length; i++) {
                        const dadoAtual = json.dados[i].PROCESSOAtivos;
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
                        dataColetas.push(`${minutos}:${segundos}`);
                        diaMetrica = `${dia}/${mes}/${ano}`;
                    }
    
    
                } else if (id == "circuloProcessosDesativados") {
    
                    for (let i = 0; i < json.dados.length; i++) {
                        const dadoAtual = json.dados[i].PROCESSODesativado;
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
                        dataColetas.push(`${minutos}:${segundos}`);
                        diaMetrica = `${dia}/${mes}/${ano}`;
                    }
                }
    
    
                // console.log(dadosMetricas);
            })
            .catch(error => {
                console.error('Erro ao obter dados:', error);
            });
    }

    // eu acrescento um dado e retiro o ultimo
    function coletaVariavel() {
        fetch(`http://localhost:3333/tempoReal/monitoramento/${valorTeste}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(json => {
                const ultimoDado = json.dados[json.dados.length - 1];

                if (id == "circuloRam") {
                    dado1 = ultimoDado.RAMPercentual;
                    data1 = ultimoDado.dataHora;
                    nomeComponente = "RAM";
                    spanMetrica = "(Porcentagem)";
                    limite = ultimoDado["limite RAMPercentual"];

                } else if (id == "circuloRamDisponivel") {
                    dado1 = ultimoDado.RAMDisponivel;
                    data1 = ultimoDado.dataHora;
                    nomeComponente = "RAM";
                    spanMetrica = "(Disponível)";
                    limite = ultimoDado["limite RAMDisponivel"];


                } else if (id == "circuloCpu") {
                    dado1 = ultimoDado.CPUPercent;
                    data1 = ultimoDado.dataHora;
                    nomeComponente = "CPU";
                    spanMetrica = "(Porcentagem)";
                    limite = ultimoDado["limite CPUPercent"];

                } else if (id == "circuloCpuFrequencia") {
                    dado1 = ultimoDado.CPUFreq;
                    data1 = ultimoDado.dataHora;
                    nomeComponente = "CPU";
                    spanMetrica = "(Frequência)";
                    limite = ultimoDado["limite CPUFreq"];


                } else if (id == "circuloDiscoUsado") {
                    dado1 = ultimoDado.DISKPercentual;
                    data1 = ultimoDado.dataHora;
                    nomeComponente = "DISCO";
                    spanMetrica = "(Porcentagem)";
                    limite = ultimoDado["limite DISKPercentual"];

                } else if (id == "circuloDiscoDisponivel") {
                    dado1 = ultimoDado.DISKDisponivel;
                    data1 = ultimoDado.dataHora;
                    nomeComponente = "DISCO";
                    spanMetrica = "(Disponível)";
                    limite = ultimoDado["limite DISKDisponivel"];


                } else if (id == "circuloRedeEnviada") {
                    dado1 = ultimoDado.REDEEnviada;
                    data1 = ultimoDado.dataHora;
                    nomeComponente = "REDE";
                    spanMetrica = "(Enviada)";
                    limite = ultimoDado["limite REDEEnviada"];


                } else if (id == "circuloRedeRecebida") {
                    dado1 = ultimoDado.REDERecebida;
                    data1 = ultimoDado.dataHora;
                    nomeComponente = "REDE";
                    spanMetrica = "(Recebida)";
                    limite = ultimoDado["limite REDERecebida"];


                } else if (id == "circuloProcessosAtivos") {
                    dado1 = ultimoDado.PROCESSOAtivos;
                    data1 = ultimoDado.dataHora;
                    nomeComponente = "PROCESSOS";
                    spanMetrica = "(Ativos)";
                    limite = ultimoDado["limite PROCESSOAtivos"];


                } else if (id == "circuloProcessosDesativados") {
                    dado1 = ultimoDado.PROCESSODesativado;
                    data1 = ultimoDado.dataHora;
                    nomeComponente = "PROCESSOS";
                    spanMetrica = "(Desativados)";
                    limite = ultimoDado["limite PROCESSODesativado"];
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
                dataColetas.push(`${minutos}:${segundos}`);
                diaMetrica = `${dia}/${mes}/${ano}`;

                // console.log(dadosMetricas);
            })
            .catch(error => {
                console.error('Erro ao obter dados:', error);
            });
    }

    function atualizarGrafico() {

        let nomeMetrica = document.getElementById("nomeMetrica");
        let tipoMetrica = document.getElementById("tipoMetrica");
        let dataMetrica = document.getElementById("dataMetrica");
        let horaMetrica = document.getElementById("horaMetrica");

        nomeMetrica.innerHTML = `${nomeComponente}`;
        tipoMetrica.innerHTML = `- ${spanMetrica}`;
        dataMetrica.innerHTML = `- ${diaMetrica}`;
        horaMetrica.innerHTML = `- ${hora}h`;

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

        let minimoY;
    
        let minY = Math.min(...dadosMetricas); 
        minimoY = minY - (minY * 0.20)

        if (minimoY < 0) {
            minimoY = 0
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


    primeiraColeta();

    // depois da primeira, começa a coletar a cada 4 segundos normalmente
    intervaloColeta = setInterval(coletaVariavel, 4000);
    intervaloGrafico = setInterval(atualizarGrafico, 4100);

}


let valorTeste;

function graficoEspecifico(button) {
    const metricas = document.getElementById("metricasdiv");
    const graficos = document.getElementById("graficoAtms");
    const componentes = document.getElementById("graficoComponentes");


    const valor = button.getAttribute("data-valor");
    valorTeste = button.getAttribute("data-valor");
    console.log("Valor selecionado:", valor);

    function obterDados() {
        fetch(`http://localhost:3333/tempoReal/monitoramento/${valor}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                const ultimoDado = json.dados[json.dados.length - 1]; // pega o último item do array
                const todasAsClasses = ["circulo-verde", "circulo-amarelo", "circulo-vermelho", "circulo-cinza"];
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


                // o hasOwnProperty() verifica se o objeto (json) tem uma chave com o nome fornecido
                if (ultimoDado.hasOwnProperty("CPUPercent")) {
                    const cpuPercent = ultimoDado.CPUPercent;
                    const cpuPercentLimite = ultimoDado["limite CPUPercent"];
                    const intervaloCpuPercent = cpuPercentLimite - (cpuPercentLimite * 0.10)

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
                    circuloCpuPercentual.classList.add("circulo-indicador", "circulo-cinza")
                    document.getElementById("porcentagemCpu").innerHTML = `N/A`;
                }


                // CPUFREQ
                if (ultimoDado.hasOwnProperty("CPUFreq")) {
                    const CPUFreq = ultimoDado.CPUFreq;
                    const CPUFreqLimite = ultimoDado["limite CPUFreq"];
                    const intervaloCPUFreq = CPUFreqLimite - (CPUFreqLimite * 0.10)

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
                    circuloCpuFreq.classList.add("circulo-indicador", "circulo-cinza")
                    document.getElementById("frequenciaCpu").innerHTML = `N/A`;
                }


                // RAMPercentual
                if (ultimoDado.hasOwnProperty("RAMPercentual")) {
                    const ramPercent = ultimoDado.RAMPercentual;
                    const ramPercentLimite = ultimoDado["limite RAMPercentual"];
                    const intervaloramPercent = ramPercentLimite - (ramPercentLimite * 0.10)

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
                    circuloRamPercentual.classList.add("circulo-indicador", "circulo-cinza")
                    document.getElementById("porcentagemRam").innerHTML = `N/A`;
                }


                // RAMDisponivel
                if (ultimoDado.hasOwnProperty("RAMDisponivel")) {
                    const ramDisponivel = ultimoDado.RAMDisponivel;
                    const ramDisponivelLimite = ultimoDado["limite RAMDisponivel"];
                    const intervaloramDisponivel = ramDisponivelLimite - (ramDisponivelLimite * 0.10)

                    circuloRamDisponivel.classList.remove(...todasAsClasses);

                    if (ramDisponivel >= intervaloramDisponivel && ramDisponivel <= ramDisponivelLimite) {
                        console.log(" to no if do medio")
                        circuloRamDisponivel.classList.add("circulo-indicador", "circulo-amarelo")
                        // Atualizando os valores no HTML
                        document.getElementById("disponivelRam").innerHTML = `${ramDisponivel}GB`;
                    }

                    else if (ramDisponivel > ramDisponivelLimite) {
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
                    circuloRamDisponivel.classList.add("circulo-indicador", "circulo-cinza")
                    document.getElementById("disponivelRam").innerHTML = `N/A`;
                }


                // DISKPercentual
                if (ultimoDado.hasOwnProperty("DISKPercentual")) {
                    const discoUsado = ultimoDado.DISKPercentual;
                    const discoUsadoLimite = ultimoDado["limite DISKPercentual"];
                    const intervalodiscoUsado = discoUsadoLimite - (discoUsadoLimite * 0.10)

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
                    circuloDiscoUsado.classList.add("circulo-indicador", "circulo-cinza")
                    document.getElementById("discoUsado").innerHTML = `N/A`;
                }


                // DISKDisponivel
                if (ultimoDado.hasOwnProperty("DISKDisponivel")) {
                    const discoDisponivel = ultimoDado.DISKDisponivel;
                    const discoDisponivelLimite = ultimoDado["limite DISKDisponivel"];
                    const intervalodiscoDisponivel = discoDisponivelLimite - (discoDisponivelLimite * 0.10)

                    circuloDiscoDisponivel.classList.remove(...todasAsClasses);

                    if (discoDisponivel >= intervalodiscoDisponivel && discoDisponivel <= discoDisponivelLimite) {
                        console.log(" to no if do medio")
                        circuloDiscoDisponivel.classList.add("circulo-indicador", "circulo-amarelo")
                        // Atualizando os valores no HTML
                        document.getElementById("discoDisponivel").innerHTML = `${discoDisponivel}GB`;
                    }

                    else if (discoDisponivel > discoDisponivelLimite) {
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
                    circuloDiscoDisponivel.classList.add("circulo-indicador", "circulo-cinza")
                    document.getElementById("discoDisponivel").innerHTML = `N/A`;
                }


                // REDEEnviada
                if (ultimoDado.hasOwnProperty("REDEEnviada")) {
                    const redeEnviada = ultimoDado.REDEEnviada;
                    const redeEnviadaLimite = ultimoDado["limite REDEEnviada"];
                    const intervaloredeEnviada = redeEnviadaLimite - (redeEnviadaLimite * 0.10)

                    circuloRedeEnviada.classList.remove(...todasAsClasses);

                    if (redeEnviada >= intervaloredeEnviada && redeEnviada <= redeEnviadaLimite) {
                        console.log(" to no if do medio")
                        circuloRedeEnviada.classList.add("circulo-indicador", "circulo-amarelo")
                        // Atualizando os valores no HTML
                        document.getElementById("redeEnviada").innerHTML = `${(redeEnviada / (1024 * 1024)).toFixed(2)}MB/s`; //bytes enviados por segundo
                    }

                    else if (redeEnviada > redeEnviadaLimite) {
                        console.log(" to no if do  passou do limite")
                        circuloRedeEnviada.classList.add("circulo-indicador", "circulo-vermelho")
                        // Atualizando os valores no HTML
                        document.getElementById("redeEnviada").innerHTML = `${(redeEnviada / (1024 * 1024)).toFixed(2)}MB/s`;
                    }

                    else {
                        console.log("to no if do  suave")
                        circuloRedeEnviada.classList.add("circulo-indicador", "circulo-verde")
                        // Atualizando os valores no HTML
                        document.getElementById("redeEnviada").innerHTML = `${(redeEnviada / (1024 * 1024)).toFixed(2)}MB/s`;
                    }
                }

                else {
                    circuloRedeEnviada.classList.add("circulo-indicador", "circulo-cinza")
                    document.getElementById("redeEnviada").innerHTML = `N/A`;
                }


                // REDERecebida
                if (ultimoDado.hasOwnProperty("REDERecebida")) {
                    const redeRecebida = ultimoDado.REDERecebida;
                    const redeRecebidaLimite = ultimoDado["limite REDERecebida"];
                    const intervaloredeRecebida = redeRecebidaLimite - (redeRecebidaLimite * 0.10)

                    circuloRedeRecebida.classList.remove(...todasAsClasses);

                    if (redeRecebida >= intervaloredeRecebida && redeRecebida <= redeRecebidaLimite) {
                        console.log(" to no if do medio")
                        circuloRedeRecebida.classList.add("circulo-indicador", "circulo-amarelo")
                        // Atualizando os valores no HTML
                        document.getElementById("redeRecebida").innerHTML = `${(redeRecebida / (1024 * 1024)).toFixed(2)}MB/s`;
                    }

                    else if (redeRecebida > redeRecebidaLimite) {
                        console.log(" to no if do  passou do limite")
                        circuloRedeRecebida.classList.add("circulo-indicador", "circulo-vermelho")
                        // Atualizando os valores no HTML
                        document.getElementById("redeRecebida").innerHTML = `${(redeRecebida / (1024 * 1024)).toFixed(2)}MB/s`;
                    }

                    else {
                        console.log("to no if do  suave")
                        circuloRedeRecebida.classList.add("circulo-indicador", "circulo-verde")
                        // Atualizando os valores no HTML
                        document.getElementById("redeRecebida").innerHTML = `${(redeRecebida / (1024 * 1024)).toFixed(2)}MB/s`;
                    }
                }

                else {
                    circuloRedeRecebida.classList.add("circulo-indicador", "circulo-cinza")
                    document.getElementById("redeRecebida").innerHTML = `N/A`;
                }




                // PROCESSOAtivos
                if (ultimoDado.hasOwnProperty("PROCESSOSAtivos")) {
                    const processosAtivos = ultimoDado.PROCESSOSAtivos;
                    const processosAtivosLimite = ultimoDado["limite PROCESSOSAtivos"];
                    const intervaloprocessosAtivos = processosAtivosLimite -  (processosAtivosLimite * 0.10)

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
                    circuloProcessosAtivos.classList.add("circulo-indicador", "circulo-cinza")
                    document.getElementById("processosAtivos").innerHTML = `N/A`;
                }


                // PROCESSODesativado
                if (ultimoDado.hasOwnProperty("PROCESSOSDesativado")) {
                    const processosDesativados = ultimoDado.PROCESSOSDesativado;
                    const processosDesativadosLimite = ultimoDado["limite PROCESSOSDesativado"];
                    const intervaloprocessosDesativados = processosDesativadosLimite - (processosDesativadosLimite * 0.10)

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
                    circuloProcessosDesativados.classList.add("circulo-indicador", "circulo-cinza")
                    document.getElementById("processosDesativados").innerHTML = `N/A`;
                }



            })
            .catch(error => {
                console.error('Erro ao obter dados:', error);  // Exibe o erro, caso haja algum
            });
    }


    if (metricas.style.display === "none" || metricas.style.display === "") {
        metricas.style.display = "flex";
        graficos.style.display = "none";
        componentes.style.display = "none";


        obterDados();

        setInterval(obterDados, 4000);

    } else {
        metricas.style.display = "none";
        componentes.style.display = "none";
        graficos.style.display = "flex";
    }
}


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
            if (data && data.length > 0) {
                const kpiData = data[0];
                document.getElementById('kpi1').innerText = kpiData.atmsSemAlertas;
                document.getElementById('kpi2').innerText = kpiData.atmsMedios;
                document.getElementById('kpi3').innerText = kpiData.atmsCritico;
            }
        })
        .catch(error => {
            console.error('Erro ao obter KPIs:', error);
        });
}

function graficoAlertasPorATM() {
    let fontSize = 20;
    if (window.innerWidth < 600) {
        fontSize = 12;
    }

    const ctx = document.getElementById('graficoAlertas').getContext('2d');

    const nomesATMs = ['ATM 1', 'ATM 2', 'ATM 3', 'ATM 4', 'ATM 5', 'ATM 6', 'ATM 7', 'ATM 8'];
    const alertas = [3, 1, 0, 1, 0, 2, 0, 1];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nomesATMs,
            datasets: [{
                label: 'Quantidade de Alertas',
                data: alertas,
                backgroundColor: 'grey',
                borderRadius: 5
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
            title: {
                display: true,
                text: 'Alertas',
                color: 'white',
                font: {
                    size: fontSize  // Tamanho da fonte em pixels
                } // Cor do título 
            }
        },
        x: {
            title: {
                display: true,
                text: 'ATMs',
                color: 'white',
                font: {
                    size: fontSize  // Tamanho da fonte em pixels
                }
            },
            ticks: {
                color: 'white'
            }
        }
    });

}


