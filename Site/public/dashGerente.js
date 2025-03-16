const data = {
    labels: [
      'Funcinando',
      'Não funcionado'
    
    ],
    datasets: [{
      label: 'Porcentagem de funcionamento',
      data: [85, 15],
      backgroundColor: [
        'rgb(2, 124, 51)', 
        'rgb(254, 0, 0)',
      ],
      hoverOffset: 4
    }]
  };
   
  const config = {
    type: 'pie',
    data: data,
  };

     const myChart = new Chart(
        document.getElementById('myChart'),
        config
      );

      function sair(){
        window.location  = "./login.html"
       
      }