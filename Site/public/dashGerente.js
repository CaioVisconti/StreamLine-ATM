const labels = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
];

const dataline = {
     labels: labels,
     datasets: [{
       label: 'Desempenho Mensal',
       backgroundColor: '#5296CD',
       borderColor: '#5296CD',
       data: [65, 100, 85, 72, 75, 66, 60, 70,54, 43, 75, 78],
        }
    ]
};
 
 
const configline = {
    type: 'bar',
    data: dataline,
};

const myChart = new Chart(
      document.getElementById('myChart'),
      configline
);

function sair(){
  window.location  = "./index.html"
}

function telaFuncionarios() {
  let func = document.getElementById('gerenciaFunc');
  let desempenho = document.getElementById('chartDesempenho');

  func.style.display = 'flex';
  desempenho.style.display = 'none';
}

function telaDesempenho() {
  let func = document.getElementById('gerenciaFunc');
  let desempenho = document.getElementById('chartDesempenho');

  func.style.display = 'none';
  desempenho.style.display = 'flex';
}