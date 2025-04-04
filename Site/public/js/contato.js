(function() {
    emailjs.init('Tujljmq8h8RLf4Va5'); // inicializa o emailjs
  })();

  document.querySelector('.botaoEnviar').addEventListener('click', function() { // escuta o clique do botao enviar
    const nome = document.getElementById('inputName').value;
    const email = document.getElementById('inputEmail').value;
    const mensagem = document.getElementById('inputDuvidas').value;
  
    // verifica se os campos estao vazios
    if (!nome || !email || !mensagem) {
      alert("Preencha todos os campos!");
      return;
    }
  
    // cria objeto de parametros q sao passados no template
    const params = {
      nome: nome,
      email: email,
      mensagem: mensagem
    };

    emailjs.send('service_g92keif', 'template_6lylonf', params) // requisicao p enviar
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text); // requisicao bem sucedida
        alert("Mensagem enviada com sucesso!");
        document.getElementById('inputName').value = ''; // limpa os campos
        document.getElementById('inputEmail').value = '';
        document.getElementById('inputDuvidas').value = '';
      }, function(error) { // caso seja devolvido um erro
        console.error('FAILED...', error);
        alert("Erro ao enviar a mensagem. Tente novamente.");
      });
});