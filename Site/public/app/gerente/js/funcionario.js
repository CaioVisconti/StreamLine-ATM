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
    fetch(`/gerente/${idAgencia}/buscarKpiFuncionarios`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((resposta) => {
        resposta.json()
        .then(json => {
            kpi_total.innerHTML = json.lista[0].qtd;
        })
    })

    // fetch(`/gerente/${idAgencia}/buscarKpiAlertas`, {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json"
    //     }
    // }).then((resposta) => {
    //     resposta.json()
    //     .then(json => {
    //         let valor = json.lista[0].alertas;
    //         if(json.lista.length == 0) {
    //             kpi_alertas.innerHTML = 0;
    //         } else {
    //             kpi_alertas.innerHTML = valor;
    //         }
    //     })
    // })
}

var vetor = "";

function carregarCards(lista) {
    const pesquisa = ipt_pesquisa.value;
    cardsContainer.innerHTML = "";

    if(lista == undefined) {
        if (pesquisa == "") {
            fetch(`/gerente/${idAgencia}/carregarCardsFuncionario`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res) => {
                res.json()
                    .then(json => {
                        vetor = json;
                        for (let i = 0; i < (json.lista).length; i++) {
                            let telefone = "+55 "

                            for(let j = 0; j < (json.lista[i].telefone).length; j++) {
                                let caracterAtual = json.lista[i].telefone[j];
                                if(j <= 1) {
                                    telefone += caracterAtual
                                    if(j == 1) {
                                        telefone += " ";
                                    }
                                } else {
                                    if(j <= 6) {
                                        telefone += caracterAtual
                                        if(j == 6) {
                                            telefone += "-"
                                        }
                                    } else {
                                        telefone += caracterAtual
                                    }
                                }
                            }

                            cardsContainer.innerHTML += `
                                <div class="cards">
                                <div class="perfil-agencia">
                                <span id="nome">${json.lista[i].nome}</span>
                                <img class="img-edit" onclick="mostrarModalEdit(${i})" src="../../assets/icone-editar.png">
                                </div>
                                <div class="info-agencia">
                                <span class="info">Cargo: <span id="cargo">${json.lista[i].cargo}</span></span>
                                <span class="info">Telefone: <span id="telefone">${telefone}</span></span>
                                <span class="info">Email: <span id="email">${json.lista[i].email}</span></span>
                                <span class="info">Senha: <span id="senha_func">${json.lista[i].senha}</span></span>
                                </div>
                                </div>
                            `
                        }
                    })
            })
        } else {
            const filtro = document.querySelector(".filtros");
            filtro.style.display = "none";
            fetch(`/gerente/${pesquisa}/${idAgencia}/searchFuncionario`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res) => {
                res.json()
                    .then(json => {
                        vetor = json;
                        for (let i = 0; i < (json.lista).length; i++) {
                            let telefone = "+55 "

                            for(let j = 0; j < (json.lista[i].telefone).length; j++) {
                                let caracterAtual = json.lista[i].telefone[j];
                                if(j <= 1) {
                                    telefone += caracterAtual
                                    if(j == 1) {
                                        telefone += " ";
                                    }
                                } else {
                                    if(j <= 6) {
                                        telefone += caracterAtual
                                        if(j == 6) {
                                            telefone += "-"
                                        }
                                    } else {
                                        telefone += caracterAtual
                                    }
                                }
                            }

                            cardsContainer.innerHTML += `
                                <div class="cards">
                                <div class="perfil-agencia">
                                <span id="nome">${json.lista[i].nome}</span>
                                <img class="img-edit" onclick="mostrarModalEdit(${i})" src="../../assets/icone-editar.png">
                                </div>
                                <div class="info-agencia">
                                <span class="info">Cargo: <span id="cargo">${json.lista[i].cargo}</span></span>
                                <span class="info">Telefone: <span id="telefone">${telefone}</span></span>
                                <span class="info">Email: <span id="email">${json.lista[i].email}</span></span>
                                <span class="info">Senha: <span id="senha_func">${json.lista[i].senha}</span></span>
                                </div>
                                </div>
                            `
                        }
                    })
            })
        }
    } else {
        let listaV = lista;
        vetor = listaV;

        for (let i = 0; i < listaV.length; i++) {
            let telefone = "+55 "

            for(let j = 0; j < (listaV[i].telefone).length; j++) {
                let caracterAtual = listaV[i].telefone[j];
                if(j <= 1) {
                    telefone += caracterAtual
                    if(j == 1) {
                        telefone += " ";
                    }
                } else {
                    if(j <= 6) {
                        telefone += caracterAtual
                        if(j == 6) {
                            telefone += "-"
                        }
                    } else {
                        telefone += caracterAtual
                    }
                }
            }

            cardsContainer.innerHTML += `
                <div class="cards">
                <div class="perfil-agencia">
                <span id="nome">${listaV[i].nome}</span>
                <img class="img-edit" onclick="mostrarModalEdit(${i})" src="../../assets/icone-editar.png">
                </div>
                <div class="info-agencia">
                <span class="info">Cargo: <span id="cargo">${listaV[i].cargo}</span></span>
                <span class="info">Telefone: <span id="telefone">${telefone}</span></span>
                <span class="info">Email: <span id="email">${listaV[i].email}</span></span>
                <span class="info">Senha: <span id="senha_func">${listaV[i].senha}</span></span>
                </div>
                </div>
            `
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

function abrirSegundaFiltragem() {
    const selecionado = filtro_categoria.value;
    const segundoFiltro = document.getElementById("filtro_tipo");

    if(selecionado == "cargo") {
        fetch(`/gerente/${idAgencia}/buscarCargo`, {
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
                        <option value="${json.lista[i].cargo}">${json.lista[i].cargo}</option>
                    `;
                }
            })
        })
    } else if(selecionado == "email") {
        fetch(`/gerente/${idAgencia}/buscarEmail`, {
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
                let vetorRep = [];
                for(let i = 0; i < json.lista.length; i++) {
                    let email = "";
                        
                    for(let j = 0; j < (json.lista[i].email).length; j++) {
                        let caracterAtual = json.lista[i].email[j];
                        if(caracterAtual == "@" || email.includes("@")) {
                            email += caracterAtual;
                        }
                    }

                    if(!vetorRep.includes(email)) {
                        vetorRep.push(email);
                        segundoFiltro.innerHTML += `
                            <option value="${email}">${email}</option>
                        `;
                    }
                }

            })
        })
    } else if(selecionado == "nome") {
        segundoFiltro.innerHTML = `
            <option selected disabled>Selecionar</option>
            <option value="filtro_AZ">A-Z</option>
            <option value="filtro_ZA">Z-A</option>
        `;
    } else if(selecionado == "telefone"){

        fetch(`/gerente/${idAgencia}/buscarTelefone`, {
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
                let vetorRep = [];
                for(let i = 0; i < json.lista.length; i++) {
                    let telefone = "+55 ";
                    let telefoneNormal = ""
                        
                    for(let j = 0; j < 2; j++) {
                        telefone += json.lista[i].telefone[j];
                        telefoneNormal += json.lista[i].telefone[j];
                    }

                    if(!vetorRep.includes(telefone)) {
                        vetorRep.push(telefone);
                        segundoFiltro.innerHTML += `
                            <option value="${telefoneNormal}">${telefone}</option>
                        `;
                    }
                }
            })
        })
    }
}

function filtrar() {
    const selecionado = filtro_categoria.value;
    const opcao = filtro_tipo.value;

    fetch(`/gerente/${selecionado}/${opcao}/${idAgencia}/filtrarFuncionario`, {
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