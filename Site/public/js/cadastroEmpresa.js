

function carregarCards() {

    var nomeAtual = sessionStorage.NOME_USUARIO;

    nomeFunc.innerHTML = `Olá, ${nomeAtual}`
    const pesquisa = ipt_pesquisa.value;
    cardsContainer.innerHTML = "";

    if (pesquisa.length == 0) {   
        fetch("/empresas/mostrarEmpresas", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            res.json()
                .then(json => {
                    for (let i = 0; i < json.length; i++) {
                        console.log(json[i].idEmpresa)
                        cardsContainer.innerHTML += `
                    <div class="cards">
                        <div class="perfil-agencia">
                            <div class="img-agencia"></div>
                            <span id="empresa">${json[i].nome}</span>
                            <img class="img-edit" data-id="${json[i].idEmpresa}" onclick="mostrarModalEdit(this)" src="../assets/icone-editar.png">
                        </div>
                        <div class="info-agencia">
                            <span class="info">Código da Empresa: <span style="font-weight: normal;" id="codigo">${json[i].codigo}</span></span>
                            <span class="info">CNPJ: <span style="font-weight: normal;" id="cnpj">${json[i].cnpj}</span></span>
                        </div>
                    </div> 
                    `
                    }
                })
        })
    } else {
        fetch(`/empresas/${pesquisa}/mostrarEmpresasSearch`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            res.json()
                .then(json => {
                    let div = document.getElementById("cardsContainer")
                    for (let i = 0; i <= json.lista.length - 1; i++) {
                        div.innerHTML += `
                    <div class="cards">
                        <div class="perfil-agencia">
                            <div class="img-agencia"></div>
                            <span id="empresa">${json.lista[i].nome}</span>
                            <img class="img-edit" data-id="${json.lista[i].idEmpresa}" onclick="mostrarModalEdit(this)" src="../assets/icone-editar.png">
                        </div>
                        <div class="info-agencia">
                            <span class="info">Código da Empresa: <span style="font-weight: normal;" id="codigo">${json.lista[i].codigo}</span></span>
                            <span class="info">CNPJ: <span style="font-weight: normal;" id="cnpj">${json.lista[i].cnpj}</span></span>
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

            modal.style.display = "none"
            fade.style.display = "none";

    
    }
}

function mostrarModalEdit(elemento) {
    const modal = document.querySelector(".modal-edit");
    const fade = document.querySelector(".fade");

    // pega o ID da empresa do botão clicado e salva no modal
    const idEmpresa = elemento.getAttribute("data-id");
    modal.setAttribute("data-id", idEmpresa);

    if (modal.style.display == "none" || modal.style.display === "") {
        modal.style.display = "flex";
        fade.style.display = "block";
    } else {
        const alert = confirm("Gostaria de fechar o modal?");
        if (alert) {
            modal.style.display = "none";
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

function cadastrarEmpresa(){
    var codigoVar = document.getElementById("ipt_codigo").value; 
    var cnpjVar = document.getElementById("ipt_cnpj").value; 
    var nomeVar = document.getElementById("ipt_nome").value; 
    console.log(codigoVar);

    fetch("/empresas/cadastrarEmpresas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            codigoServer: codigoVar,
            cnpjServer: cnpjVar,
            nomeServer: nomeVar
            
        }),
    }).then(function (res) {
        if (res.ok) {
            alert("Empresa cadastrada no sistema!")
            location.reload();
            return res.json()
        } else {
            alert("Algum erro ocorreu no cadastro")
        }
    });

    return false;
}

function empresasParceiras(){

    fetch("/empresas/kpiParceiras", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (resposta) {
        console.log("ESTOU NO THEN DO entrar()!")

        if (resposta.ok) {
            console.log(resposta);

            resposta.json().then(json => {
                console.log(json);
                console.log(JSON.stringify(json));

                setTimeout(function () {
                    // empresasParceiras = json[0].quantidade;
                    document.getElementById("kpiParceiras").innerHTML += `${json[0].quantidade}`
                }, 1000); // apenas para exibir o loading

            });

        }
    }).catch(function (erro) {
        console.log(erro);
    })

}


function deletarEmpresa() {
    const modal = document.querySelector(".modal-edit");
    const idEmpresa = modal.getAttribute("data-id");

    console.log("IdEmpresa:", idEmpresa);


    if (confirm("Quer apagar a agência mesmo?")) {

        fetch(`/empresas/deletarEmpresa/${idEmpresa}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(function (resultado) {
            console.log(resultado);
            if (resultado.ok) {
                location.reload();
                fecharModalEdit()

            } else {
                alert("Erro ao apagar agência")
            }
        })
    }
}