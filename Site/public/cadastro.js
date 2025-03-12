function cadastro() {
    // aguardar();

    let listaEmpresasCadastradas = [];
    var mensagem_erro = "";
    //Recupere o valor da nova input pelo nome do id
    // Agora vá para o método fetch logo abaixo
    var codVar = ipt_codigo.value;
    var nomeVar = ipt_usuario.value;
    var cpfvar = ipt_cpf.value;
    var emailVar = ipt_email.value;
    var cargoVar = ipt_cargo.value;
    var telefoneVar = ipt_telefone.value;
    var senhaVar = ipt_senha.value;
    var confirmacaoSenhaVar = ipt_senhaconfirmada.value;
    
    // Verificando se há algum campo em branco
    if (
      codVar == "" ||
      nomeVar == "" ||
      cpfvar == "" ||
      emailVar == "" ||
      cargoVar == "" ||
      telefoneVar == "" ||
      senhaVar == "" ||
      confirmacaoSenhaVar == "" 
    ) {
    
      mensagem_erro.innerHTML =
        "(Mensagem de erro para todos os campos em branco)";

      
      return false;
    } else {
      setInterval(5000);
    }

    for (let i = 0; i < listaEmpresasCadastradas.length; i++) {
      if (listaEmpresasCadastradas[i].idEmpresa == codVar) {
        idEmpresaVincular = listaEmpresasCadastradas[i].idEmpresa
        console.log("Código de ativação válido.");
        break;
      } else {
       
        mensagem_erro.innerHTML = "(Mensagem de erro para código inválido)";
        
      }
    }

    function listar() {
      fetch("/empresas/listar", {
        method: "GET",
      })
        .then(function (resposta) {
          resposta.json().then((empresas) => {
            empresas.forEach((empresa) => {
              listaEmpresasCadastradas.push(empresa);
  
              console.log("listaEmpresasCadastradas")
              console.log(listaEmpresasCadastradas[0].idEmpresa)
            });
          });
        })
        .catch(function (resposta) {
          console.log(`#ERRO: ${resposta}`);
        });
    }


    // Enviando o valor da nova input
    fetch("/usuarios/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // crie um atributo que recebe o valor recuperado aqui
        // Agora vá para o arquivo routes/usuario.js
        codServer: codVar,
        nomeServer: nomeVar,
        cpfServer: cpfvar,
        telefoneServer: telefoneVar,
        cargoServer: cargoVar,
        emailServer: emailVar,
        senhaServer: senhaVar
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
          

          mensagem_erro.innerHTML =
            "Cadastro realizado com sucesso! Redirecionando para tela de Login...";

          setTimeout(() => {
            window.location = "./login.html";
          }, "2000");

          limparFormulario();
         
        } else {
          throw "Houve um erro ao tentar realizar o cadastro!";
        }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
        
      });

    return false;
  }

