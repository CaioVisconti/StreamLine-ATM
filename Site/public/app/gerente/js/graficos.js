window.onload = function () {
    exibirKPICriticos();
    exibirKPIPercentual();
    plotTop5();
    buscarGraficoSituacao();
    exibirHistorico();
    exibirUser();
    mostrarCount10();
    mostrarCountTotal();
    graficoResolucaoJira();
    listagemPendentes();
};

const idAgencia = sessionStorage.ID_AGENCIA;

function exibirUser() {
    let nomeUsuario = sessionStorage.NOME_USUARIO;
    document.getElementById("nomeFunc").innerHTML = `Olá, ${nomeUsuario}`;
}

function sair() {
    sessionStorage.clear()
    window.location.href = "../../../login.html";
}

document.getElementById('bnt-download').addEventListener('click', download);

function download() {
    console.log('download chamado');

    fetch(`/gerente/${idAgencia}/downloadCSV`, { method: "GET" }) 
        .then((response) => {
            console.log('Status:', response.status);
            if (response.ok) {
                return response.blob();
            } else {
                console.error("Erro ao obter downloadCSV", response.statusText);
                throw new Error('Resposta não OK');
            }
        })
        .then((blob) => {
            if (blob && blob.size > 0) {
                // Cria URL temporária e dispara o link
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;

                // Altere o nome para algo.zip:
                a.download = 'arquivos_ultimoDia.zip';

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                console.log("blob vazioooo");
            }
        })
        .catch((error) => {
            console.error("Erro ao obter downloadCSV:", error);
        });
}

function exibirHistorico() {
    fetch(`/gerente/${idAgencia}/historico`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Erro ao obter historico")
            }
        })
        .then((data) => {
            if (data && data.length > 0) {
                const kpiData = data[0];
                // hist = getElementById("divHistorico")

                for (let i = 0; i < data.length; i++) {
                    console.log("AAA", data[i])
                    let atm = data[i].ATM
                    let componente = data[i].Componente
                    let valor = data[i].Valor
                    let tipo = data[i].Tipo
                    // let dataHora = data[i].DataHora

                    if (tipo == "Medium") {
                        tipo = "Médio"
                    }
                    else if (tipo == "High") {
                        tipo = "Crítico"
                    }

                    const d = new Date(data[i].DataHora);
                    const dataFormatada = d.toLocaleDateString("pt-BR") + ' ' + d.toTimeString().slice(0, 5);

                    divHistorico.innerHTML += `<div class="row py-2 border-bottom border-secondary align-items-center text-center">
                                <div class="col-2">${atm}</div>
                                <div class="col-3">${componente}</div>
                                <div class="col-2">${valor}</div>
                                <div class="col-3">${tipo}</div>
                                <div class="col-2">${dataFormatada}</div>
                            </div>`
                }

            }
        })
        .catch((erro) => {
            console.error("Erro na captura de historico:", erro);
        });

}

function mostrarCountTotal() {
    fetch(`/gerente/${idAgencia}/mostrarCountTotal`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Erro ao obter KPIs");
            }
        })
        .then((data) => {
            if (data && data.length > 0) {

                console.log(data)

                const kpiData = data[0];

                document.getElementById("mostrandoTotal").innerText = kpiData.total;

            }
        })
        .catch((error) => {
            console.error("Erro ao obter total alertas:", error);
        });
}

function mostrarCount10() {
    fetch(`/gerente/${idAgencia}/mostrarCount`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Erro ao obter KPIs");
            }
        })
        .then((data) => {
            if (data && data.length > 0) {

                const kpiData = data[0];

                document.getElementById("mostrando10").innerText = kpiData.total;

            }
        })
        .catch((error) => {
            console.error("Erro ao obter total alertas:", error);
        });
}

function exibirKPICriticos() {
    fetch(`/gerente/${idAgencia}/buscarKpiCriticos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Erro ao obter KPIs");
            }
        })
        .then((data) => {
            if (data && data.length > 0) {
                const kpiData = data[0];
                document.getElementById("kpi1").innerText = kpiData.totalCriticos;

                const total = parseInt(kpiData.totalCriticos);
                console.log(total);

                if (total >= 1) {
                    document.querySelector(".kpiDiv1").style.backgroundColor = "#D9AA2A";
                } else {
                    document.querySelector(".kpiDiv1").style.backgroundColor = "#65AE50";
                }
            }
        })
        .catch((error) => {
            console.error("Erro ao obter KPI totalCriticos:", error);
        });
}

function exibirKPIPercentual() {
    fetch(`/gerente/${idAgencia}/buscarKpiPercentual`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Erro ao obter KPIs");
            }
        })
        .then((data) => {
            if (data && data.length > 0) {
                const kpiData = data[0];
                document.getElementById("kpi3").innerText = kpiData.percentualBons;

                const percentual = parseFloat(kpiData.percentualBons);
                console.log(percentual);

                if (percentual >= 75) {
                    document.querySelector(".kpiDiv3").style.backgroundColor = "#65AE50";
                } else if (percentual >= 60) {
                    document.querySelector(".kpiDiv3").style.backgroundColor = "#D9AA2A";
                } else {
                    document.querySelector(".kpiDiv3").style.backgroundColor = "#A12929";
                }
            }
        })
        .catch((error) => {
            console.error("Erro ao obter KPI percentual de atms bons:", error);
        });
}

function plotTop5() {
    const atm = [];
    const qtdAlertas = [];

    fetch(`/gerente/${idAgencia}/buscarGraficoTop5`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => {
        res.json().then((json) => {
            for (var i = 0; i < json.length; i++) {
                atm.push(json[i].atm);
                qtdAlertas.push(json[i].qtdAlertas);
                // console.log("push ok")
            }

            // console.log(atm)

            const graficoTop5 = document.getElementById("chartIncidentes");

            new Chart(graficoTop5, {
                type: "bar",
                data: {
                    labels: atm,
                    datasets: [
                        {
                            label: "Quantidade de alertas",
                            data: qtdAlertas,
                            backgroundColor: "#2A5277",
                            borderRadius: 5,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                            align: "center",
                            labels: {
                                color: "#FFFFFF",
                                boxWidth: 10,
                                boxHeight: 10,
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "#FFFFFF",
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                        },
                        y: {
                            ticks: {
                                color: "#FFFFFF",
                                stepSize: 1,
                                precision: 0,
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            beginAtZero: true,
                        },
                    },
                },
            });
        });
    });
}

let dia
let total_atms
let datasFormatadas
let criticos
let medios
let lista
let bons

function buscarGraficoSituacao() {
    dia = []
    total_atms = []
    datasFormatadas = []
    criticos = []
    medios = []
    bons = []

    fetch(`/gerente/${idAgencia}/buscarGraficoSituacao`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => {
        res.json().then((json) => {
            lista = json;

            for (var i = 0; i < json.length; i++) {
                const data = new Date(json[i].dia);
                const dataFormatada = data.toLocaleDateString("pt-BR");

                if (!datasFormatadas.includes(dataFormatada)) {
                    console.log("dataFormatada");
                    console.log(dataFormatada);
                    datasFormatadas.push(dataFormatada);
                }

                total_atms.push(json[i].total_atms);
            }

            console.log("lista");
            console.log(lista.length);

            console.log("datasFormatadas");
            console.log(datasFormatadas.length);

            for (let i = 0; i < datasFormatadas.length; i++) {
                let qtd_medios = 0
                let qtd_criticos = 0
                let qtd_bons = 0

                for (let j = 0; j < lista.length; j++) {
                    let dataItem = new Date(lista[j].dia).toLocaleDateString("pt-BR");

                    if (datasFormatadas[i] == dataItem) {
                        if (lista[j].situacao == "Crítico") {
                            qtd_criticos += lista[j].total_atms
                        }
                        if (lista[j].situacao == "Médio") {
                            qtd_medios += lista[j].total_atms
                        }
                        if (lista[j].situacao == "Bom") {
                            qtd_bons += lista[j].total_atms
                        }
                    }
                }

                criticos.push(qtd_criticos)
                medios.push(qtd_medios)
                bons.push(qtd_bons)
            }

            console.log(medios);
            console.log(criticos);

            const graficoSituacao = document.getElementById("chartCategoria");

            new Chart(graficoSituacao, {
                type: "line",
                data: {
                    labels: datasFormatadas,
                    datasets: [
                        {
                            label: "Crítico",
                            data: criticos,
                            borderColor: "#A12929",
                            backgroundColor: "#A12929",
                            fill: false,
                            tension: 0.2,
                        },
                        {
                            label: "Médio",
                            data: medios,
                            borderColor: "#D9AA2A",
                            backgroundColor: "#D9AA2A",
                            fill: false,
                            tension: 0.2,
                        },
                        { 
                            label: "Bom",
                            data: bons,
                            borderColor: "#28A745", 
                            backgroundColor: "#28A745",
                            fill: false,
                            tension: 0.2,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                            labels: {
                                color: "#FFFFFF",
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "#FFFFFF",
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                precision: 0,
                                color: "#FFFFFF",
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                        },
                    },
                },
            });
        });
    });
}

// JIRA
async function graficoResolucaoJira() {
    const tempoChamados = document.getElementById("chartChamados");
    const kpi2 = document.getElementById("kpi2");

    try {
        const response = await fetch('/gerente/jira/resolution-data');
        const result = await response.json();

        const chartData = result.data.chartData;
        const stats = result.data.stats;

        if (kpi2 && stats && stats.avgResolution) {

            const tempoMedioHoras = stats.avgResolutionInHours;

            kpi2.innerHTML = stats.avgResolution;

            if (tempoMedioHoras < 3.0) {
                document.querySelector(".kpiDiv2").style.backgroundColor = "#65AE50";
            } else if (tempoMedioHoras >= 3.0 && tempoMedioHoras <= 5.0) {
                document.querySelector(".kpiDiv2").style.backgroundColor = "#D9AA2A";
            } else {
                document.querySelector(".kpiDiv2").style.backgroundColor = "#A12929";
            }

        } else if (kpi2) {
            kpi2.innerHTML = "N/A";
        }

        new Chart(tempoChamados, {
            type: "bar",
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: "Qtd de alertas resolvidos",
                        data: chartData.ticketCounts,
                        backgroundColor: "#F19D5E",
                        yAxisID: 'yTickets',
                    },
                    {
                        label: "Tempo médio de resolução (h/min)",
                        data: chartData.avgResolutionTimes,
                        backgroundColor: "#2A5277",
                        yAxisID: 'yTime',
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                        align: "center",
                        labels: {
                            color: "#FFFFFF",
                            boxWidth: 10,
                            boxHeight: 10,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: "#FFFFFF",
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                    },
                    yTickets: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Quantidade de Tickets', color: "#FFFFFF" },
                        beginAtZero: true,
                        ticks: {
                            color: "#FFFFFF",
                            stepSize: 1,
                            precision: 0,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },

                    },
                    yTime: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Tempo Médio (h/min/s)', color: "#FFFFFF" },
                        beginAtZero: true,
                        ticks: {
                            color: "#FFFFFF",
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                },
            },
        });

    } catch (error) {
        console.error("Falha ao buscar ou mostrar gráfico de resolução Jira:", error);
        if (kpi2) kpi2.innerHTML = "Erro";
    }
}

async function listagemPendentes() {
    const listagemJira = document.getElementById("listagemJira");
    const mensagem = document.getElementById('mensagem');

    listagemJira.innerHTML = '<div class="row py-2 text-center"><div class="col-12" style="font-style:italic;">Carregando alertas pendentes...</div></div>';

    if (listagemJira) { // Limpa mensagem geral anterior
        listagemJira.innerHTML = '';
    }

    try {
        const response = await fetch('/gerente/jira/tabela-cards');
        const result = await response.json();

        console.log('Dados dos alertas pendentes recebidos:', result);

        if (!response.ok || !result.success) {
            throw new Error(result.error || result.details || `Erro ${response.status} ao buscar alertas.`);
        }

        if (result.data) {
            if (result.data.length == 0) {
                listagemJira.innerHTML = '<div class="row py-2 text-center"><div class="col-12" style="font-style:italic;">Nenhum alerta pendente encontrado criado nos últimos 7 dias.</div></div>';
            } else {
                result.data.forEach(item => {
                    const divLinha = document.createElement('div');
                    divLinha.className = 'row py-2 border-bottom border-secondary align-items-center text-center';
                    divLinha.innerHTML = `
                        <div class="col-2">${item.atm || 'N/A'}</div>
                        <div class="col-3">${item.problema || 'N/A'}</div>
                        <div class="col-2"><span class="">${item.tipo || 'N/A'}</span></div>
                        <div class="col-3">${item.duracao || 'N/A'}</div> 
                        <div class="col-2">
                            <a href="${item.link || '#'}" target="_blank" rel="noopener noreferrer" class="btn" title="Ver card no Jira" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;">
                                <i class="bi bi-box-arrow-up-right"></i>
                            </a>
                        </div>
                    `;
                    listagemJira.appendChild(divLinha); // Adiciona linhas ao novo container
                });
            }
            if (mensagem) {
                mensagem.innerHTML = result.message || 'Alertas pendentes carregados com sucesso!';
            }
        } else {
            throw new Error('Formato de dados inesperado para a tabela de alertas.');
        }
    } catch (error) {
        console.error('Erro ao buscar ou exibir alertas pendentes:', error);
        listagemJira.innerHTML = `<div class="row py-2 text-center"><div class="col-12" style="color:red;">Erro ao carregar alertas: ${error.message}</div></div>`;
    }
}