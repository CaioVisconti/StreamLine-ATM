
window.onload = () => {
    carregarGraficos()
    document.getElementById("default").click()

}

function carregarGraficos() {
    const graficoTotal = document.getElementById('graficoTotal');
    new Chart(graficoTotal, {
        type: 'bar',
        data: {
            labels: ['EC2', 'S3', 'Lambda'],
            datasets: [{
                data: [100, 34, 18],
                borderWidth: 1
            }]
        },
        options: {
            backgroundColor: ['#c0353c7a', '#c5cc5f7a', '#78dd5c7a'],
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

    const custoMensal = document.getElementById('custoMensal');
    new Chart(custoMensal, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
            datasets: [{
                data: [250, 230, 400, 320, 380],
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

    const graficoPrevisao = document.getElementById('previsao');
    new Chart(graficoPrevisao, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                data: [250, 230, 400, 320, 380, 410],
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