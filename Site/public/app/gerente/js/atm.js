const cargo = sessionStorage.CARGO_USUARIO;
const email = sessionStorage.EMAIL_USUARIO;
const idAgencia = sessionStorage.ID_AGENCIA;
const idUsuario = sessionStorage.ID_USUARIO;
const nomeUsuario = sessionStorage.NOME_USUARIO;

function carregarDados() {
    nomeUser.innerHTML = nomeUsuario;
    buscarKpis();
    carregarCards();
}

function buscarKpis() {
    fetch(`/gerente/${idAgencia}/buscarKpiTotal`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((resposta) => {
        resposta.json()
        .then(json => {
            kpi_total.innerHTML = json.lista[0].total;
        })
    })

    fetch(`/gerente/${idAgencia}/buscarKpiAlertas`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((resposta) => {
        resposta.json()
        .then(json => {
            kpi_alertas.innerHTML = json.lista[0].alertas;
        })
    })
}

function carregarCards() {
    const pesquisa = ipt_pesquisa.value;
    cardsContainer.innerHTML = "";
    
    if (pesquisa == "") {
        fetch(`/gerente/${idAgencia}/carregarCards`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            res.json()
                .then(json => {
                    for (let i = 0; i < (json.lista).length; i++) {
                        let status = "";

                        if(json.lista[i].statusATM == 1) {
                            status = "Ativo";
                        } else {
                            status = "Desativado";
                        }
                        
                        cardsContainer.innerHTML += `
                            <div class="cards">
                            <div class="perfil-agencia">
                            <span>Atm - <span id="hostname">${json.lista[i].hostname}</span></span>
                            <img class="img-edit" onclick="mostrarModalEdit()" src="../../assets/icone-editar.png">
                            </div>
                            <div class="info-agencia">
                            <span class="info">Modelo: <span id="modelo">${json.lista[i].modelo}</span></span>
                            <span class="info">IP: <span id="ip">${json.lista[i].ip}</span></span>
                            <span class="info">MacAdress: <span id="macAdress">${json.lista[i].macAdress}</span></span>
                            <span class="info">Sistema Operacional: <span id="so">${json.lista[i].sistemaOperacional}</span></span>
                            <span class="info">Status: <span id="status">${status}</span></span>
                            </div>
                            </div>
                        `
                    }
                })
        })
    } else {
        fetch(`/gerente/${pesquisa}/${idAgencia}/search`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            res.json()
                .then(json => {
                    console.log(json)
                    for (let i = 0; i < (json.lista).length; i++) {
                        let status = "";

                        if(json.lista[i].statusATM == 1) {
                            status = "Ativo";
                        } else {
                            status = "Desativado";
                        }

                        cardsContainer.innerHTML += `
                            <div class="cards">
                            <div class="perfil-agencia">
                            <span>Atm - <span id="hostname">${json.lista[i].hostname}</span></span>
                            <img class="img-edit" onclick="mostrarModalEdit()" src="../../assets/icone-editar.png">
                            </div>
                            <div class="info-agencia">
                            <span class="info">Modelo: <span id="modelo">${json.lista[i].modelo}</span></span>
                            <span class="info">IP: <span id="ip">${json.lista[i].ip}</span></span>
                            <span class="info">MacAdress: <span id="macAdress">${json.lista[i].macAdress}</span></span>
                            <span class="info">Sistema Operacional: <span id="so">${json.lista[i].sistemaOperacional}</span></span>
                            <span class="info">Status: <span id="status">${status}</span></span>
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

function abrirSegundaFiltragem() {
    const selecionado = filtro_categoria.value;
    const segundoFiltro = document.getElementById("filtro_tipo");

    if(selecionado == "filtro_modelo") {
        fetch(`/gerente/${idAgencia}/buscarModelos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((resposta) => {
            resposta.json()
            .then(json => {
                segundoFiltro.innerHTML = `
                    <option selected disabled>Selecionar</option>
                `;
                for(let i = 0; i < json.lista.length; i++) {
                    segundoFiltro.innerHTML += `
                        <option value="${json.lista[i].Modelo}">${json.lista[i].modelo}</option>
                    `;
                }

            })
        })
    } else if(selecionado == "filtro_sistemaOperacional") {
        fetch(`/gerente/${idAgencia}/buscarSO`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((resposta) => {
            resposta.json()
            .then(json => {
                segundoFiltro.innerHTML = `
                    <option selected disabled>Selecionar</option>
                `;
                for(let i = 0; i < json.lista.length; i++) {
                    segundoFiltro.innerHTML += `
                        <option value="${json.lista[i].SO}">${json.lista[i].SO}</option>
                    `;
                }

            })
        })
    } else if(selecionado == "filtro_hostname") {
        segundoFiltro.innerHTML = `
            <option selected disabled>Selecionar</option>
            <option value="filtro_AZ">A-Z</option>
            <option value="filtro_ZA">Z-A</option>
        `;
    } else {
        segundoFiltro.innerHTML = `
            <option selected disabled>Selecionar</option>
            <option value="ativo">Ativo</option>
            <option value="desativado">Desativado</option>
        `;
    }
}

function filtrar() {
    const selecionado = slt_filtro_principal.value;
    const opcao = slt_filtro_secundario.value;

    fetch(`/gerente/${selecionado}/${opcao}/${idAgencia}/filtrar`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((resposta) => {
        resposta.json()
            .then(json => {
                console.log(json.lista);
            })
    })
}

function atualizar(posicaoVetor, idAtm) {
    let idATM = idAtm;
    let modelo = ipt_modelo.value;
    let ip = ipt_ip.value;
    let hostname = ipt_hostname.value;
    let macadress = ipt_macadress.value;
    let sistemaOperacional = ipt_sistemaOperacional.value;
    let status = slt_status.value;

    let listaAtm = {
        fkAgencia: idAgencia,
        hostname: hostname,
        idAtm: idATM,
        ip: ip,
        macAdress: macadress,
        modelo: modelo,
        sistemaOperacional: sistemaOperacional,
        status: status
    }

    if(listaAtm != listaPrincipal[posicaoVetor]) {
        fetch(`/gerente/${listaAtm}/atualizar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((resultado) => {
            resultado.json()
            .then(json => {
                console.log(json.lista);
            })
        })
    }
}

function registrarATM() {
    let modelo = iptModeloCad.value;
    let ip = iptIPCad.value;
    let hostname = iptHostnameCad.value;
    let macadress = iptMacAdressCad.value;
    let so = iptSOCad.value;
    let status = slt_status.value;

    fetch("/gerente/cadastrarATM", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            modeloServer: modelo,
            ipServer: ip,
            hostnameServer: hostname,
            macadressServer: macadress,
            soServer: so,
            statusServer: status,
            fkAgenciaServer: idAgencia
        })
    }).then((resultado) => {
        // carregarCards();
    })
}