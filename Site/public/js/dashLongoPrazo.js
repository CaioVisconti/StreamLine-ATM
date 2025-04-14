function exibirAlertas(){
    let oi = document.querySelector(".organizar-compontentes");
    let dois = document.querySelector(".organizar");
    oi.style.display = "flex";
    dois.style.display = "none";
}

function gerarGraficos(){
    let oi = document.querySelector(".organizar-compontentes");
    let dois = document.querySelector(".organizar");
    oi.style.display = "none";
    dois.style.display = "flex";

    const ctx = document.getElementById('meuGrafico').getContext('2d');

    // Destroi o gráfico antigo se ele já existir
    if (window.meuGraficoInstance) {
        window.meuGraficoInstance.destroy();
    }

    // Criação do gráfico com linha de alerta (linha vermelha no 75)
    window.meuGraficoInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['01/04', '02/04', '03/04', '04/04', '05/04', '06/04', '07/04'],
            datasets: [{
                label: 'Uso da CPU (%)',
                data: [53, 80, 83, 70, 73, 83, 70],
                borderColor: 'rgba(141, 52, 249, 1)',
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
                annotation: { // ✅ Corrigido com vírgula aqui
                    annotations: {
                        linhaLimite: {
                            type: 'line',
                            yMin: 75,
                            yMax: 75,
                            borderColor: 'red',
                            borderWidth: 2
                        }
                    }
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
}


