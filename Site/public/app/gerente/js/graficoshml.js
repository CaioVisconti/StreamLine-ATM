// Variáveis globais para instâncias de gráficos do Jira, se necessário para atualizações
let chartChamadosInstance;
const kpi2Element = document.getElementById("kpi2"); // KPI para "Tempo médio de resolução"

// FUNÇÃO PARA O GRÁFICO DE RESOLUÇÃO DO JIRA
async function fetchAndRenderJiraResolutionChart() {
    const tempoChamadosCanvas = document.getElementById("chartChamados");
    if (!tempoChamadosCanvas) {
        console.error("Elemento canvas 'chartChamados' não encontrado para o gráfico Jira.");
        return;
    }

    try {
        const response = await fetch('/gerente/jira/resolution-data');
        const result = await response.json();

        if (!result.success || !result.data || !result.data.chartData) {
            console.error("Erro ao buscar dados do gráfico de resolução Jira ou formato inválido:", result.message || result);
            if (kpi2Element) kpi2Element.textContent = "Erro";
            return;
        }

        const chartData = result.data.chartData;
        const stats = result.data.stats;

        if (kpi2Element && stats && stats.avgResolution) {
            kpi2Element.textContent = stats.avgResolution;
        } else if (kpi2Element) {
            kpi2Element.textContent = "N/A";
        }

        if (chartChamadosInstance) {
            chartChamadosInstance.destroy();
        }

        chartChamadosInstance = new Chart(tempoChamadosCanvas, {
            type: "bar",
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: "Quantidade de alertas resolvidos",
                        data: chartData.ticketCounts,
                        backgroundColor: "#F19D5E", // Cor do seu mock original
                        borderRadius: 5,
                        yAxisID: 'yTickets',
                    },
                    {
                        label: "Tempo médio de resolução (h/min)",
                        data: chartData.avgResolutionTimes,
                        backgroundColor: "#2A5277", // Cor do seu mock original
                        borderRadius: 5,
                        type: 'bar',
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
                            color: "#FFFFFF", // Assumindo que o fundo do seu CSS/gráfico é escuro
                            boxWidth: 10,
                            boxHeight: 10,
                            font: { size: 14, weight: 'bold' }
                        }
                    },
                    title: {
                        display: false,
                        text: 'Resolução de Chamados e Tempo Médio (Jira - Últimos 7 Dias)',
                        color: '#FFFFFF', // Ajuste conforme seu tema
                        font: { size: 16, weight: 'bold' }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: "#FFFFFF",
                            font: { size: 14, weight: 'bold' }
                        },
                        title: { display: true, text: 'Data da Resolução', color: "#FFFFFF" }
                    },
                    yTickets: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Quantidade de Tickets', color: "#FFFFFF" },
                        beginAtZero: true,
                        ticks: { color: "#FFFFFF", font: { size: 14, weight: 'bold' } },
                        grid: { drawOnChartArea: false },
                    },
                    yTime: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Tempo Médio (h/min/s)', color: "#FFFFFF" },
                        beginAtZero: true,
                        ticks: { color: "#FFFFFF", font: { size: 14, weight: 'bold' } },
                        grid: { drawOnChartArea: true },
                    }
                },
            },
        });

    } catch (error) {
        console.error("Falha ao buscar ou renderizar gráfico de resolução Jira:", error);
        if (kpi2Element) kpi2Element.textContent = "Erro";
    }
}

async function fetchAndDisplayJiraPendingAlerts() {
    const dataRowsContainer = document.getElementById("jiraPendingAlertsDataRowsContainer"); // NOVO ALVO para linhas de dados
    const tableMessageArea = document.getElementById('tableMessageArea'); // Área de mensagens gerais da tabela

    if (!dataRowsContainer) {
        console.error("Elemento 'jiraPendingAlertsDataRowsContainer' para as linhas da tabela não encontrado.");
        if (tableMessageArea) {
            tableMessageArea.textContent = "Erro: Estrutura da tabela não encontrada no HTML.";
            tableMessageArea.className = 'error';
        }
        return;
    }

    // Limpa o container de dados e exibe mensagem de carregamento DENTRO dele
    dataRowsContainer.innerHTML = '<div class="row py-2 text-center"><div class="col-12" style="font-style:italic;">Carregando alertas pendentes...</div></div>';
    if (tableMessageArea) { // Limpa mensagem geral anterior
        tableMessageArea.textContent = '';
        tableMessageArea.className = '';
    }

    try {
        const response = await fetch('/gerente/jira/tabela-cards'); // Sua rota atualizada
        const result = await response.json();

        console.log('Dados dos alertas pendentes recebidos:', result);
        dataRowsContainer.innerHTML = ''; // Limpa a mensagem de "Carregando..."

        if (!response.ok || !result.success) {
            throw new Error(result.error || result.details || `Erro ${response.status} ao buscar alertas.`);
        }

        if (result.data && Array.isArray(result.data)) {
            if (result.data.length === 0) {
                dataRowsContainer.innerHTML = '<div class="row py-2 text-center"><div class="col-12" style="font-style:italic;">Nenhum alerta pendente encontrado (criado nos últimos 7 dias).</div></div>';
            } else {
                result.data.forEach(item => {
                    const rowDiv = document.createElement('div');
                    rowDiv.className = 'row py-2 border-bottom border-secondary align-items-center text-center';
                    rowDiv.innerHTML = `
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
                    dataRowsContainer.appendChild(rowDiv); // Adiciona linhas ao novo container
                });
            }
            if (tableMessageArea) {
                tableMessageArea.textContent = result.message || 'Alertas pendentes carregados com sucesso!';
                tableMessageArea.className = 'success';
            }
        } else {
            throw new Error('Formato de dados inesperado para a tabela de alertas.');
        }
    } catch (error) {
        console.error('Erro ao buscar ou exibir alertas pendentes:', error);
        dataRowsContainer.innerHTML = `<div class="row py-2 text-center"><div class="col-12" style="color:red;">Erro ao carregar alertas: ${error.message}</div></div>`;
        if (tableMessageArea) {
            tableMessageArea.textContent = `Erro (tabela): ${error.message}`;
            tableMessageArea.className = 'error';
        }
    }
}



window.onload = function () {
    fetchAndRenderJiraResolutionChart();
    fetchAndDisplayJiraPendingAlerts();
};

const idAgencia = sessionStorage.ID_AGENCIA;

function exibirUser() {
    let nomeUsuario = sessionStorage.NOME_USUARIO;
    const nomeFuncElement = document.getElementById("nomeFunc");
    if (nomeFuncElement) { // Adicionado null check
        nomeFuncElement.innerHTML = `Olá, ${nomeUsuario || 'Usuário'}`; // Fallback para nomeUsuario
    }
}

const bntDownloadElement = document.getElementById('bnt-download');
if (bntDownloadElement) { // Adicionado null check
    bntDownloadElement.addEventListener('click', download);
}

function download() {
    console.log('download chamado');
    const agenciaIdParaDownload = idAgencia || '1'; // Fallback se idAgencia não estiver definido

    fetch(`/gerente/${agenciaIdParaDownload}/downloadCSV`, { method: "GET" })
        .then((response) => {
            console.log('Status do download:', response.status);
            if (response.ok) {
                return response.blob();
            } else {
                console.error("Erro ao obter downloadCSV", response.statusText);
                throw new Error('Resposta do download não OK: ' + response.statusText);
            }
        })
        .then((blob) => {
            if (blob && blob.size > 0) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = 'arquivos_ultimoDia.zip';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                console.log("Blob do download vazio ou inválido.");
                // Poderia exibir uma mensagem para o usuário aqui
            }
        })
        .catch((error) => {
            console.error("Erro na requisição de downloadCSV:", error);
            // Poderia exibir uma mensagem de erro para o usuário
        });
}

const divHistorico = document.getElementById("divHistorico"); // Definindo globalmente se usado por exibirHistorico

function exibirHistorico() {
    if (!divHistorico) {
        console.error("Elemento 'divHistorico' não encontrado.");
        return;
    }
    const agenciaIdParaHistorico = idAgencia || '1'; // Fallback

    fetch(`/gerente/${agenciaIdParaHistorico}/historico`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
        if (response.ok) return response.json();
        console.error("Erro ao obter historico:", response.statusText);
        throw new Error('Falha ao buscar histórico: ' + response.statusText);
    })
    .then((data) => {
        if (data && data.length > 0) {
            // Limpa histórico anterior, exceto o cabeçalho (se o cabeçalho for o primeiro filho e fixo)
            const headerHistorico = divHistorico.querySelector(".row.py-1.text-center[style*='background-color: #374151']");
            const linhasDeDadosHistorico = divHistorico.querySelectorAll(".row:not([style*='background-color: #374151'])");
            linhasDeDadosHistorico.forEach(row => row.remove());

            data.forEach(item => { // Renomeado 'i' para 'item' para clareza
                let atm = item.ATM;
                let componente = item.Componente;
                let valor = item.Valor;
                let tipo = item.Tipo;

                if (tipo == "Medium") tipo = "Médio";
                else if (tipo == "High") tipo = "Crítico";

                const d = new Date(item.DataHora);
                const dataFormatada = d.toLocaleDateString("pt-BR") + ' ' + d.toTimeString().slice(0, 5);

                const rowHtml = `<div class="row py-2 border-bottom border-secondary align-items-center text-center">
                    <div class="col-2">${atm || 'N/A'}</div>
                    <div class="col-3">${componente || 'N/A'}</div>
                    <div class="col-2">${valor || 'N/A'}</div>
                    <div class="col-3">${tipo || 'N/A'}</div>
                    <div class="col-2">${dataFormatada}</div>
                </div>`;
                // Adiciona após o cabeçalho, ou ao final se o cabeçalho não for encontrado
                if (headerHistorico) {
                    headerHistorico.insertAdjacentHTML('afterend', rowHtml); // Insere, mas a ordem pode inverter se adicionar múltiplos. Melhor appendChild.
                                                                             // Para manter a ordem correta ao adicionar múltiplos, melhor construir todas e depois adicionar, ou usar appendChild.
                                                                             // Vamos usar appendChild para simplicidade, assumindo que o header é o primeiro.
                }
                 divHistorico.insertAdjacentHTML('beforeend', rowHtml); // Mais simples para adicionar ao final do container
            });
        } else {
            // Se não houver dados, pode adicionar uma mensagem
             const linhasDeDadosHistorico = divHistorico.querySelectorAll(".row:not([style*='background-color: #374151'])");
            linhasDeDadosHistorico.forEach(row => row.remove()); // Limpa dados antigos
            divHistorico.insertAdjacentHTML('beforeend', '<div class="row py-2 text-center"><div class="col-12">Nenhum histórico encontrado.</div></div>');
        }
    })
    .catch((erro) => {
        console.error("Erro na captura de historico:", erro);
        if (divHistorico) { // Adiciona mensagem de erro no div
            const linhasDeDadosHistorico = divHistorico.querySelectorAll(".row:not([style*='background-color: #374151'])");
            linhasDeDadosHistorico.forEach(row => row.remove());
            divHistorico.insertAdjacentHTML('beforeend', `<div class="row py-2 text-center"><div class="col-12" style="color:red;">Erro ao carregar histórico.</div></div>`);
        }
    });
}


function mostrarCountTotal() {
    const mostrandoTotalElement = document.getElementById("mostrandoTotal");
    if (!mostrandoTotalElement) return;
    const agenciaIdParaCount = idAgencia || '1';

    fetch(`/gerente/${agenciaIdParaCount}/mostrarCountTotal`, { /* ... */ })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error('Falha ao buscar count total');
    })
    .then(data => {
        if (data && data.length > 0 && data[0].total !== undefined) {
            mostrandoTotalElement.innerText = data[0].total;
        } else {
            mostrandoTotalElement.innerText = '0';
        }
    })
    .catch(error => {
        console.error("Erro ao obter total alertas:", error);
        if (mostrandoTotalElement) mostrandoTotalElement.innerText = 'Erro';
    });
}

function mostrarCount10() {
    const mostrando10Element = document.getElementById("mostrando10");
    if(!mostrando10Element) return;
    const agenciaIdParaCount10 = idAgencia || '1';

    fetch(`/gerente/${agenciaIdParaCount10}/mostrarCount`, { /* ... */ })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error('Falha ao buscar count 10');
    })
    .then(data => {
        if (data && data.length > 0 && data[0].total !== undefined) {
            mostrando10Element.innerText = data[0].total;
        } else {
            mostrando10Element.innerText = '0';
        }
    })
    .catch(error => {
        console.error("Erro ao obter count 10 alertas:", error); // Ajustado o log de erro
        if(mostrando10Element) mostrando10Element.innerText = 'Erro';
    });
}


function exibirKPICriticos() {
    const kpi1Element = document.getElementById("kpi1");
    const kpiDiv1Element = document.querySelector(".kpiDiv1");
    if (!kpi1Element || !kpiDiv1Element) return;
    const agenciaIdParaCriticos = idAgencia || '1';

    fetch(`/gerente/${agenciaIdParaCriticos}/buscarKpiCriticos`, { /* ... */ })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error('Falha ao buscar KPIs críticos');
    })
    .then(data => {
        if (data && data.length > 0 && data[0].totalCriticos !== undefined) {
            kpi1Element.innerText = data[0].totalCriticos;
            const total = parseInt(data[0].totalCriticos);
            if (total >= 1) kpiDiv1Element.style.backgroundColor = "#D9AA2A";
            else kpiDiv1Element.style.backgroundColor = "#65AE50";
        } else {
            kpi1Element.innerText = '0';
            kpiDiv1Element.style.backgroundColor = "#65AE50"; // Cor padrão
        }
    })
    .catch(error => {
        console.error("Erro ao obter KPI totalCriticos:", error);
        if (kpi1Element) kpi1Element.innerText = 'Erro';
        if (kpiDiv1Element) kpiDiv1Element.style.backgroundColor = "#A12929"; // Cor de erro
    });
}


function exibirKPIPercentual() {
    const kpi3Element = document.getElementById("kpi3");
    const kpiDiv3Element = document.querySelector(".kpiDiv3");
    if (!kpi3Element || !kpiDiv3Element) return;
    const agenciaIdParaPercentual = idAgencia || '1';

    fetch(`/gerente/${agenciaIdParaPercentual}/buscarKpiPercentual`, { /* ... */ })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error('Falha ao buscar KPI percentual');
    })
    .then(data => {
        if (data && data.length > 0 && data[0].percentualBons !== undefined) {
            kpi3Element.innerText = data[0].percentualBons;
            const percentual = parseFloat(data[0].percentualBons);
            if (percentual >= 75) kpiDiv3Element.style.backgroundColor = "#65AE50";
            else if (percentual >= 60) kpiDiv3Element.style.backgroundColor = "#D9AA2A";
            else kpiDiv3Element.style.backgroundColor = "#A12929";
        } else {
            kpi3Element.innerText = '0%';
            kpiDiv3Element.style.backgroundColor = "#A12929"; // Cor padrão para "ruim"
        }
    })
    .catch(error => {
        console.error("Erro ao obter KPI percentual de atms bons:", error);
        if (kpi3Element) kpi3Element.innerText = 'Erro';
        if (kpiDiv3Element) kpiDiv3Element.style.backgroundColor = "#808080"; // Cor de erro genérica
    });
}


function plotTop5() {
    const graficoTop5Canvas = document.getElementById("chartIncidentes");
    if(!graficoTop5Canvas) return;
    const agenciaIdParaTop5 = idAgencia || '1';

    fetch(`/gerente/${agenciaIdParaTop5}/buscarGraficoTop5`, { /* ... */ })
    .then(res => {
        if (res.ok) return res.json();
        throw new Error('Falha ao buscar Top 5');
    })
    .then(json => {
        const atm = [];
        const qtdAlertas = [];
        if (json && Array.isArray(json)) {
            for (var i = 0; i < json.length; i++) {
                atm.push(json[i].atm);
                qtdAlertas.push(json[i].qtdAlertas);
            }
        }
        new Chart(graficoTop5Canvas, {
            type: "bar",
            data: {
                labels: atm,
                datasets: [{
                    label: "Quantidade de alertas",
                    data: qtdAlertas,
                    backgroundColor: "#2A5277",
                    borderRadius: 5,
                }],
            },
            options: { /* ... suas opções de gráfico top 5 ... */ 
                responsive: true,
                plugins: { legend: { /* ... */ labels: { color: "#FFFFFF", /* ... */} } },
                scales: { x: { ticks: {color: "#FFFFFF", /* ... */} }, y: { ticks: {color: "#FFFFFF", /* ... */}, beginAtZero: true } }
            }
        });
    })
    .catch(error => console.error("Erro ao plotar Top 5:", error));
}


function buscarGraficoSituacao() {
    const graficoSituacaoCanvas = document.getElementById("chartCategoria");
    if (!graficoSituacaoCanvas) return;
    const agenciaIdParaSituacao = idAgencia || '1';

    fetch(`/gerente/${agenciaIdParaSituacao}/buscarGraficoSituacao`, { /* ... */ })
    .then(res => {
        if (res.ok) return res.json();
        throw new Error('Falha ao buscar gráfico de situação');
    })
    .then(json => {
        const datasFormatadas = [];
        const criticos = [];
        const medios = [];
        const mapData = new Map(); // Para agrupar dados por dia

        if (json && Array.isArray(json)) {
            json.forEach(item => {
                const data = new Date(item.dia);
                const dataFormatada = data.toLocaleDateString("pt-BR");
                if (!mapData.has(dataFormatada)) {
                    mapData.set(dataFormatada, { criticos: 0, medios: 0 });
                }
                if (item.situacao == "Crítico") {
                    mapData.get(dataFormatada).criticos += item.total_atms;
                }
                if (item.situacao == "Médio") {
                    mapData.get(dataFormatada).medios += item.total_atms;
                }
            });

            // Ordena as chaves (datas) para garantir a ordem no gráfico
            const sortedDates = Array.from(mapData.keys()).sort((a, b) => {
                const partsA = a.split('/');
                const dateA = new Date(partsA[2], partsA[1] - 1, partsA[0]);
                const partsB = b.split('/');
                const dateB = new Date(partsB[2], partsB[1] - 1, partsB[0]);
                return dateA - dateB;
            });

            sortedDates.forEach(dateKey => {
                datasFormatadas.push(dateKey);
                criticos.push(mapData.get(dateKey).criticos);
                medios.push(mapData.get(dateKey).medios);
            });
        }
        
        new Chart(graficoSituacaoCanvas, {
            type: "line",
            data: {
                labels: datasFormatadas,
                datasets: [
                    { label: "Crítico", data: criticos, borderColor: "#A12929", backgroundColor: "#A12929", fill: false, tension: 0.2 },
                    { label: "Médio", data: medios, borderColor: "#D9AA2A", backgroundColor: "#D9AA2A", fill: false, tension: 0.2 },
                ],
            },
            options: { /* ... suas opções de gráfico de situação ... */ 
                responsive: true,
                plugins: { legend: { /* ... */ labels: { color: "#FFFFFF", /* ... */} } },
                scales: { x: { ticks: {color: "#FFFFFF", /* ... */} }, y: { ticks: {color: "#FFFFFF", stepSize:1, precision:0 /* ... */}, beginAtZero: true } }
            }
        });
    })
    .catch(error => console.error("Erro ao buscar gráfico de situação:", error));
}

// Se a função sair() não estiver definida em outro lugar:
function sair() {
    console.log("Função sair() chamada. Implementar lógica de logout.");
    // Exemplo: sessionStorage.clear(); window.location.href = "/pagina-de-login.html";
}