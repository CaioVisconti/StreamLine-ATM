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


