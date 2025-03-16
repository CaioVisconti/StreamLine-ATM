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
         data: [65, 70, 85, 78, 75, 66, 60, 70,54, 43, 75, 78, 63, 70, 72, 68],
          }
       ,
       {
     
         label: 'Mémoria',
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
      type: 'pie',
      data: dataline,
      options: {
      }
  };

     const myChart = new Chart(
        document.getElementById('myChart'),
        configline
      );

      function sair(){
        window.location  = "./login.html"
       
      }