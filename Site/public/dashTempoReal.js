// Chart geral:

const labels = [
    'ATM 1',
    'ATM 2',
    'ATM 3',
    'ATM 4',
    'ATM 5',
    'ATM 6',
    'ATM 7',
    'ATM 8',
    'ATM 9',
    'ATM 10',
    'ATM 11',
    'ATM 12',
    'ATM 13',
    'ATM 14',
    'ATM 15',
    'ATM 16'
];
 
const dataline = {
       labels: labels,
       datasets: [{
         label: 'CPU',
         backgroundColor: 'rgb(255, 165, 0)',
         borderColor: 'rgb(255, 165, 0)',
         data: [65, 70, 85, 72, 75, 66, 60, 70,54, 43, 75, 78, 63, 70, 72, 68],
          }
       ,
       {
     
         label: 'Memória',
         backgroundColor: 'rgb(0, 123, 255)',
            borderColor: 'rgb(0, 123, 255)',
            data: [60, 65, 70, 80, 66, 63, 59, 73, 65, 50, 72, 64, 65, 68, 70, 66],
       } ,
      
       {
     
        label: 'Disco',
        backgroundColor: 'rgb(153, 50, 204)',
        borderColor: 'rgb(153, 50, 204)',
        data: [50, 55, 65, 60, 65, 68, 66, 55, 48, 10, 50, 62, 65, 62, 64, 61],
      }
      ]
};
   
   
const configline = {
      type: 'bar',
      data: dataline,
      options: {
          plugins: {
              annotation: {
                  annotations: {
                      limiteMaxCPU: {
                          type: 'line',
                          yMin: 80,
                          yMax: 80,
                          borderColor: 'rgb(255, 165, 0)',
                          borderWidth: 2,
                          borderDash: [10, 5],
                      },
                      limiteMinCPU: {
                          type: 'line',
                          yMin: 40,
                          yMax: 40,
                          borderColor: 'rgb(255, 165, 0)',
                          borderWidth: 2,
                          borderDash: [10, 5],
                        
                      },
                      limiteMaxMemoria: {
                          type: 'line',
                          yMin: 75,
                          yMax: 75,
                          borderColor: 'rgb(0, 123, 255)',
                          borderWidth: 2,
                          borderDash: [10, 5],
                      },
                      limiteMinMemoria: {
                          type: 'line',
                          yMin: 50,
                          yMax: 50,
                          borderColor: 'rgb(0, 123, 255)',
                          borderWidth: 2,
                          borderDash: [10, 5],
                      },
                      limiteMaxDisco: {
                          type: 'line',
                          yMin: 70,
                          yMax: 70,
                          borderColor: 'rgb(153, 50, 204)',
                          borderWidth: 2,
                          borderDash: [10, 5],
                      },
                      limiteMinDisco: {
                          type: 'line',
                          yMin: 30,
                          yMax: 30,
                          borderColor: 'rgb(153, 50, 204)',
                          borderWidth: 2,
                          borderDash: [10, 5],
                      }
                  }
              }
          }
      }
};

const myChart = new Chart(
        document.getElementById('myChart'),
        configline
);


// Chart específico:

const labels2 = [
    '13:30',
    '13:31',
    '13:32',
    '13:33',
    '13:34',
    '13:35',
    '13:36',
    '13:37',
    '13:38',
    '13:39',
    '13:40',
    '13:41',
    '13:42',
    '13:43',
    '13:44',
    '13:45',
    '13:46',
    '13:47',
    '13:48',
    '13:49',
    '13:50',
    '13:51',
    '13:52',
    '13:53',
    '13:54',
    '13:55',
    '13:56',
    '13:57',
    '13:58',
    '13:59',
    '14:00',
];
 
const dataline2 = {
       labels: labels2,
       datasets: [{
         label: 'CPU',
         backgroundColor: 'rgb(255, 165, 0)',
         borderColor: 'rgb(255, 165, 0)',
         data: [
            58,63,71,62,70,75,66,65,62,73,69,66,61,75,71,65,57,69,70,64,56,55,73,55,57,71,66,59,66,72,55],
          }
       ,
       {
     
         label: 'Memória',
         backgroundColor: 'rgb(0, 123, 255)',
            borderColor: 'rgb(0, 123, 255)',
            data: [
                61,69,73,74,80,76,80,67,64,69,79,78,72,65,63,60,66,63,74,61,63,62,66,70,60,76,77,76,78,80,66],
       } ,
      
       {
     
        label: 'Disco',
        backgroundColor: 'rgb(153, 50, 204)',
        borderColor: 'rgb(153, 50, 204)',
        data: [
            30,31.4,33.3,34.8,  36,37.4,38.6,39.2,40.3,41.7,42.3,43.7,44.3,46.1,47.8,49.2,  50,51.6,53.6,55.3,  57,58.2,59.3,60.6,62.5,63.3,64.4,65.4,66.7,67.9,68.7],
      }
      ]
};
   
   
const configline2 = {
      type: 'line',
      data: dataline2,
      options: {
          plugins: {
              annotation: {
                  annotations: {
                      limiteMaxCPU: {
                          type: 'line',
                          yMin: 80,
                          yMax: 80,
                          borderColor: 'rgb(255, 165, 0)',
                          borderWidth: 2,
                          borderDash: [10, 5],
                      },
                      limiteMinCPU: {
                          type: 'line',
                          yMin: 40,
                          yMax: 40,
                          borderColor: 'rgb(255, 165, 0)',
                          borderWidth: 2,
                          borderDash: [10, 5],
                        
                      },
                      limiteMaxMemoria: {
                          type: 'line',
                          yMin: 75,
                          yMax: 75,
                          borderColor: 'rgb(0, 123, 255)',
                          borderWidth: 2,
                          borderDash: [10, 5],
                      },
                      limiteMinMemoria: {
                          type: 'line',
                          yMin: 50,
                          yMax: 50,
                          borderColor: 'rgb(0, 123, 255)',
                          borderWidth: 2,
                          borderDash: [10, 5],
                      },
                      limiteMaxDisco: {
                          type: 'line',
                          yMin: 70,
                          yMax: 70,
                          borderColor: 'rgb(153, 50, 204)',
                          borderWidth: 2,
                          borderDash: [10, 5],
                      },
                      limiteMinDisco: {
                          type: 'line',
                          yMin: 30,
                          yMax: 30,
                          borderColor: 'rgb(153, 50, 204)',
                          borderWidth: 2,
                          borderDash: [10, 5],
                      }
                  }
              }
          }
      }
};

const myChart2 = new Chart(
        document.getElementById('myChart2'),
        configline2
);


// Troca de display:

let chart1 = document.getElementById("chartGeral");
let chart2 = document.getElementById("chartEspecifico");

function graficoGeral() {
    chart2.style.display = "none";
    chart1.style.display = "flex";
}

function graficoEspecifico() {
    chart1.style.display = "none";
    chart2.style.display = "flex";
}




function sair(){
    window.location  = "./index.html"
}