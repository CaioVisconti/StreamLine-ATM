const cargo = sessionStorage.CARGO_USUARIO;
const email = sessionStorage.EMAIL_USUARIO;
const idAgencia = sessionStorage.ID_AGENCIA;
const idUsuario = sessionStorage.ID_USUARIO;
const nomeUsuario = sessionStorage.NOME_USUARIO;

function carregarDados(lista) {
    nomeUser.innerHTML = nomeUsuario;
    buscarKpis();
    carregarCards(lista);
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
            let valor = json.lista[0].alertas;
            if(json.lista.length == 0) {
                kpi_alertas.innerHTML = 0;
            } else {
                kpi_alertas.innerHTML = valor;
            }
        })
    })
}

var vetor = "";

function carregarCards(lista) {
    const pesquisa = ipt_pesquisa.value;
    cardsContainer.innerHTML = "";

    if(lista == undefined) {
        if (pesquisa == "") {
            fetch(`/gerente/${idAgencia}/carregarCards`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res) => {
                res.json()
                    .then(json => {
                        vetor = json;
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
                                <img class="img-edit" onclick="mostrarModalEdit(${i})" src="../../assets/icone-editar.png">
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
            const filtro = document.querySelector(".filtros");
            filtro.style.display = "none";
            fetch(`/gerente/${pesquisa}/${idAgencia}/search`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res) => {
                res.json()
                    .then(json => {
                        vetor = json;
                        for (let i = 0; i < (json.lista).length; i++) {
                            let status = "";
                            let indiceAtual = i;

                            if(json.lista[i].statusATM == 1) {
                                status = "Ativo";
                            } else {
                                status = "Desativado";
                            }

                            cardsContainer.innerHTML += `
                                <div class="cards">
                                <div class="perfil-agencia">
                                <span>Atm - <span id="hostname">${json.lista[i].hostname}</span></span>
                                <img class="img-edit" onclick="mostrarModalEdit(${indiceAtual})" src="../../assets/icone-editar.png">
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
    } else {
        let listaV = [lista];
        vetor = listaV;
        for(let i = 0; i < lista.length; i++) {
            let status = "";
            let indiceAtual = i;

            if(lista[i].statusATM == 1) {
                status = "Ativo";
            } else {
                status = "Desativado";
            }

            cardsContainer.innerHTML += `
                <div class="cards">
                <div class="perfil-agencia">
                <span>Atm - <span id="hostname">${lista[i].hostname}</span></span>
                <img class="img-edit" onclick="mostrarModalEdit(${indiceAtual})" src="../../assets/icone-editar.png">
                </div>
                <div class="info-agencia">
                <span class="info">Modelo: <span id="modelo">${lista[i].modelo}</span></span>
                <span class="info">IP: <span id="ip">${lista[i].ip}</span></span>
                <span class="info">MacAdress: <span id="macAdress">${lista[i].macAdress}</span></span>
                <span class="info">Sistema Operacional: <span id="so">${lista[i].sistemaOperacional}</span></span>
                <span class="info">Status: <span id="status">${status}</span></span>
                </div>
                </div>
            `
        }
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

function mostrarModalEdit(indice) {
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
    pesquisarEdit(indice);
}

let componentes = [];

function pesquisarEdit(indice) {
    iptModeloEdit.value = vetor.lista[indice].modelo;
    iptIPEdit.value = vetor.lista[indice].ip;
    iptHostnameEdit.value = vetor.lista[indice].hostname;
    iptMacAdressEdit.value = vetor.lista[indice].macAdress;
    iptSOEdit.value = vetor.lista[indice].sistemaOperacional;
    sltStatusEdit.value = vetor.lista[indice].statusATM;
    let idAtm = vetor.lista[indice].idAtm;
    
    fetch(`/gerente/${idAtm}/procurarComponentes`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((resultado) => {
        resultado.json()
        .then(json => {
            let listagem = document.getElementById("listagem");
            listagem.innerHTML = "";
            componentes = json;
            for(let i = 0; i < json.lista.length; i++) {
                listagem.innerHTML += `
                    <div class="campo-modal-componentes">
                        <span>${json.lista[i].metrica}</span>
                        <img class="img-edit" onclick="mostrarModalEditComp(${i}, ${idAtm})" src="../../assets/icone-editar.png">
                    </div>
                `;
            }
        })
    })
    listagem.innerHTML += `
    <div class="campo-modal-componentes">
        <span onclick="cadastrarComponente(${idAtm})">+</span>
    </div>`;
    button_atualizar.innerHTML = `
        <button onclick="atualizarAtm(${indice}, ${idAtm})">Salvar Mudanças</button>
    `;
}

function mostrarModalEditComp(indice) {
    const modalComponente = document.querySelector(".modal-edit-componente");
    const modalEditAtm = document.querySelector(".modal-edit");
    const fade = document.querySelector(".fade");
    
    modalEditAtm.style.display == "none";

    if (modalComponente.style.display == "none") {
        modalComponente.style.display = "flex";
    } else {
        const alert = confirm("Gostaria de fechar o modal?");
        if (alert) {
            modalComponente.style.display = "none"
            fade.style.display = "none";
        }
    }

    let metrica = componentes.lista[indice].metrica;
    let componenteAtual = "";

    if(metrica.includes("CPU")) {
        componenteAtual = "CPU";
    } else if(metrica.includes("RAM")) {
        componenteAtual = "RAM";
    } else if(metrica.includes("DISK")) {
        componenteAtual = "DISK";
    } else if(metrica.includes("REDE")) {
        componenteAtual = "REDE";
    } else {
        componenteAtual = "PROCESSOS"
    }

    componente.innerHTML = componenteAtual;
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

    if(selecionado == "modelo") {
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
                        <option value="${json.lista[i].modelo}">${json.lista[i].modelo}</option>
                    `;
                }
            })
        })
    } else if(selecionado == "sistemaOperacional") {
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
                        <option value="${json.lista[i].so}">${json.lista[i].so}</option>
                    `;
                }

            })
        })
    } else if(selecionado == "hostname") {
        segundoFiltro.innerHTML = `
            <option selected disabled>Selecionar</option>
            <option value="filtro_AZ">A-Z</option>
            <option value="filtro_ZA">Z-A</option>
        `;
    } else {
        segundoFiltro.innerHTML = `
            <option selected disabled>Selecionar</option>
            <option value="ativo">Ativo</option>
            <option value="desativo">Desativado</option>
        `;
    }
}

function filtrar() {
    const selecionado = filtro_categoria.value;
    const opcao = filtro_tipo.value;

    fetch(`/gerente/${selecionado}/${opcao}/${idAgencia}/filtrar`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((resposta) => {
        resposta.json()
            .then(json => {
                console.log(json.lista);
                carregarDados(json.lista);
            })
    })
}

function atualizarAtm(posicaoVetor, idAtm) {
    let idATM = Number(idAtm);
    let modelo = iptModeloEdit.value;
    let ip = iptIPEdit.value;
    let hostname = iptHostnameEdit.value;
    let macadress = iptMacAdressEdit.value;
    let sistemaOperacional = iptSOEdit.value;
    let status = Number(sltStatusEdit.value);

    let listaAtm = {
        idAtm: idATM,
        hostname: hostname,
        modelo: modelo,
        ip: ip,
        macAdress: macadress,
        sistemaOperacional: sistemaOperacional,
        statusATM: status,
        fkAgencia: Number(idAgencia)
    }

    if(JSON.stringify(listaAtm) != JSON.stringify(vetor.lista[posicaoVetor])) {
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
        carregarCards();
    })
}