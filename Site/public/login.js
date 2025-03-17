function login() {
    // aguardar();

    var emailVar = ipt_usuario.value;
    var senhaVar = ipt_senha.value;
    

    if (emailVar == "" || senhaVar == "") {
        
        mensagem_erro.innerHTML = "(Mensagem de erro para todos os campos em branco)";
        finalizarAguardar();
        return false;
    }
    else {
        setInterval(sumirMensagem, 5000)
    }

    console.log("FORM LOGIN: ", emailVar);
    console.log("FORM SENHA: ", senhaVar);

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailServer: emailVar, senhaServer: senhaVar })
    })
    .then(resposta => {
        console.log("ESTOU NO THEN DO entrar()!");
    
        if (resposta.ok) {
            return resposta.json();
        } else {
            return resposta.text().then(texto => {
                console.error("Erro no login:", texto);
            });
        }
    })
    .then(json => {
        if (!json) return; 
    
        console.log("JSON recebido:", json);
    
        sessionStorage.EMAIL_USUARIO = json.email;
        sessionStorage.NOME_USUARIO = json.nome;
        sessionStorage.ID_USUARIO = json.idUsuario;
        sessionStorage.CARGO_USUARIO = json.cargo;
    
        setTimeout(() => {
            var cargoUsuario = sessionStorage.CARGO_USUARIO;
    
            if (cargoUsuario === "Técnico" || cargoUsuario === "técnico")  {
                window.location = "./dashTempoReal.html"; 
            } else if (cargoUsuario === "Gerente" || cargoUsuario === "gerente") {
                window.location = "./dashGerente.html"; 
            } else if (cargoUsuario === "Analista" || cargoUsuario === "analista") {
                window.location = "./dashDadoHistorico.html";    
            }  
            else {
                console.log("Erro: Cargo inválido!");
            }
        }, 1000);
    })
    .catch(erro => {
        console.error("Erro na requisição:", erro);
    });
    
    
}

function sumirMensagem() {
    
}