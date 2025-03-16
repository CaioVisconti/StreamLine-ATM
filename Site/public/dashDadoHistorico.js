const labels = [
    '2025-03-01', '2025-03-02', '2025-03-03', '2025-03-04',
    '2025-03-05', '2025-03-06', '2025-03-07', '2025-03-08',
    '2025-03-09', '2025-03-10', '2025-03-11', '2025-03-12',
    '2025-03-13', '2025-03-14', '2025-03-15', '2025-03-16'
  ];

 
     const dataline = {
       labels: labels,
       datasets: [{
         label: 'CPU 1',
         backgroundColor: 'rgb(255, 165, 0)',
         borderColor: 'rgb(255, 165, 0)',
         data: [65, 70, 85, 72, 75, 66, 60, 70,54, 43, 75, 78, 63, 70, 72, 68],
          }
       ,
       {
     
         label: 'RAM 1',
         backgroundColor: 'rgb(0, 123, 255)',
            borderColor: 'rgb(0, 123, 255)',
            data: [60, 65, 70, 80, 66, 63, 59, 73, 65, 50, 72, 64, 65, 68, 70, 66],
       } ,
      
       {
     
        label: 'Disco 1',
        backgroundColor: 'rgb(207, 148, 236)',
        borderColor: 'rgb(207, 148, 236)',
        data: [50, 55, 65, 60, 65, 68, 66, 55, 48, 10, 50, 62, 65, 62, 64, 61],
      } ,

      {
        label: 'CPU 2',
        backgroundColor: 'rgb(230, 62, 62)',
        borderColor: 'rgb(230, 62, 62)',
        data: [60, 75, 88, 70, 80, 72, 68, 74, 58, 40, 70, 82, 60, 68, 74, 65], 
      },
      {
        label: 'RAM 2',
        backgroundColor: 'rgb(3, 255, 255)',
        borderColor: 'rgb(3, 255, 255)',
        data: [62, 67, 72, 78, 68, 65, 61, 70, 68, 54, 74, 66, 68, 72, 75, 70], 
      },
      {
        label: 'Disco 2',
        backgroundColor: 'rgb(153, 50, 204)',
        borderColor: 'rgb(153, 50, 204)',
        data: [55, 60, 68, 64, 70, 72, 65, 60, 50, 15, 55, 68, 62, 65, 67, 63], 
      }

      ]
     };
   
   
     const configline = {
      type: 'line',
      data: dataline,
  
  };

     const myChart = new Chart(
        document.getElementById('myChart'),
        configline
      );


      function sair(){
        window.location  = "./index.html"
       
      }

function graficoMetricas() {

  let metricas = document.getElementById("chartMetricas");
  let cards = document.getElementById("cards")
  let kpi = document.getElementsByClassName("kpi");
  let kpi2 = document.getElementsByClassName("kpi2");

  metricas.style.display = 'flex';
  cards.style.display = 'flex';

  for (let i = 0; i < kpi.length; i++) {
    kpi[i].style.display = 'none';
  }

  for (let i = 0; i < kpi2.length; i++) {
    kpi2[i].style.display = 'block';
  }
}