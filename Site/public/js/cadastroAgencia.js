function carregarCards() {
    const pesquisa = ipt_pesquisa.value;
    cardsContainer.innerHTML = "";
    if (pesquisa == "") {
        fetch("/agencias/mostrarAgencias", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            res.json()
                .then(json => {
                    for (let i = 0; i < json.length; i++) {
                        cardsContainer.innerHTML += `
                    <div class="cards">
                    <div class="perfil-agencia">
                    <div class="img-agencia"></div>
                    <span>Agência - <span id="empresa">${json[i].idAgencia}</span></span>
                    <img class="img-edit" onclick="mostrarModalEdit()" src="../assets/icone-editar.png">
                    </div>
                    <div class="info-agencia">
                    <span class="info">Código Agência:<span id="codigo">${json[i].codigoAgencia}</span></span>
                    <span class="info">Telefone: <span id="telefone">${json[i].telefone}</span></span>
                    <span class="info">Email: <span id="email">${json[i].email}</span></span>
                    </div>
                    </div>
                    `
                    }
                })
        })
    } else {
        fetch(`/agencias/pesquisarAgencias/${pesquisa}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            res.json()
                .then(json => {
                    console.log(json)
                    for (let i = 0; i < json.length; i++) {
                        cardsContainer.innerHTML += `
                            <div class="cards">
                            <div class="perfil-agencia">
                            <div class="img-agencia"></div>
                            <span>Agência - <span id="empresa">${json[i].idAgencia}</span></span>
                            <img class="img-edit" onclick="mostrarModalEdit()" src="../assets/icone-editar.png">
                            </div>
                            <div class="info-agencia">
                            <span class="info">Código Agência:<span id="codigo">${json[i].codigoAgencia}</span></span>
                            <span class="info">Telefone: <span id="telefone">${json[i].telefone}</span></span>
                            <span class="info">Email: <span id="email">${json[i].email}</span></span>
                            </div>
                            </div>
                            `
                    }
                })
        })
    }
}

function mostrarModalCad() {
    const modal = document.querySelector(".modal");
    const fade = document.querySelector(".fade");
    if (modal.style.display == "none") {
        modal.style.display = "flex";
        fade.style.display = "block";
    } else {
        const alert = confirm("Gostaria de fechar o modal?");
        if (alert) {
            modal.style.display = "none"
            fade.style.display = "none";

        }
    }
}

function mostrarModalEdit() {
    const modal = document.querySelector(".modal-edit");
    const fade = document.querySelector(".fade");
    if (modal.style.display == "none") {
        modal.style.display = "flex";
        fade.style.display = "block";
    } else {
        const alert = confirm("Gostaria de fechar o modal?");
        if (alert) {
            modal.style.display = "none"
            fade.style.display = "none";

        }
    }
}

function mostrarFiltros() {
    const filtro = document.querySelector(".filtros");
    if (filtro.style.display == "none") {
        filtro.style.display = "block";
    } else {
        filtro.style.display = "none";
    }
}

function carregarEmpresas(){
    const select = document.querySelector(".select-empresa");
    
}

function cadastrarAgencia() {
    var codigoEmpresaVar = document.getElementById("iptCodigoEmpresa").value;
    var codigoAgenciaVar = document.getElementById("iptCodigoAgencia").value;
    var emailVar = document.getElementById("iptEmail").value;
    var senhaVar = document.getElementById("iptSenha").value;
    var cepVar = document.getElementById("iptCEP").value;
    var ufVar = document.getElementById("iptUF").value;
    var cidadeVar = document.getElementById("iptCidade").value;
    var bairroVar = document.getElementById("iptBairro").value;
    var logradouroVar = document.getElementById("iptLogradouro").value;
    var numeroVar = document.getElementById("iptNumero").value;

    console.log({
        codigoEmpresaVar,
        codigoAgenciaVar,
        emailVar,
        senhaVar,
        cepVar,
        ufVar,
        cidadeVar,
        bairroVar,
        logradouroVar,
        numeroVar
    });
    

    fetch("/agencias/cadastrarAgencia", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            codigoEmpresaServer: codigoEmpresaVar,
            codigoAgenciaServer: codigoAgenciaVar,
            emailServer: emailVar,
            senhaServer: senhaVar,
            cepServer: cepVar,
            ufServer: ufVar,
            cidadeServer: cidadeVar,
            bairroServer: bairroVar,
            logradouroServer: logradouroVar,
            numeroServer: numeroVar
        }),
    }).then(function (res) {
        console.log(res);
        if (res.ok) {
            alert("Agência cadastrada no sistema!")
        } else {
            alert("Algum erro ocorreu no cadastro")
        }
    })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);

        });

    return false;

}


