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
}

let vetor = "";

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

                            let cargo = "";

                            if(json.lista[i].cargo == "Tecnico de Operacao") {
                                cargo = "Técnico de Operação";
                            } else {
                                cargo = "Amalista de Dados";
                            }

                            cardsContainer.innerHTML += `
                                <div class="cards">
                                <div class="perfil-agencia">
                                <span id="nome">${json.lista[i].nome}</span>
                                <img class="img-edit" onclick="mostrarModalEdit(${i}, ${json.lista[i].idUsuario})" src="../../assets/icone-editar.png">
                                </div>
                                <div class="info-agencia">
                                <span class="info">Cargo: <span id="cargo">${cargo}</span></span>
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

                            let cargo = "";

                            if(json.lista[i].cargo == "Tecnico de Operacao") {
                                cargo = "Técnico de Operação";
                            } else {
                                cargo = "Amalista de Dados";
                            }

                            cardsContainer.innerHTML += `
                                <div class="cards">
                                <div class="perfil-agencia">
                                <span id="nome">${json.lista[i].nome}</span>
                                <img class="img-edit" onclick="mostrarModalEdit(${i}, ${json.lista[i].idUsuario})" src="../../assets/icone-editar.png">
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
            
            let cargo = "";

            if(json.lista[i].cargo == "Tecnico de Operacao") {
                cargo = "Técnico de Operação";
            } else {
                cargo = "Amalista de Dados";
            }

            cardsContainer.innerHTML += `
                <div class="cards">
                <div class="perfil-agencia">
                <span id="nome">${listaV[i].nome}</span>
                <img class="img-edit" onclick="mostrarModalEdit(${i}, ${listaV[i].idUsuario})" src="../../assets/icone-editar.png">
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
                    
                    let cargo = "";

                    if(json.lista[i].cargo == "Tecnico de Operacao") {
                        cargo = "Técnico de Operação";
                    } else {
                        cargo = "Amalista de Dados";
                    }

                    segundoFiltro.innerHTML += `
                        <option value="${json.lista[i].cargo}">${cargo}</option>
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

function mostrarModalCad() {
    const modalCadastro = document.querySelector(".modal-funcionario");
    const fade = document.querySelector(".fade");

    if (modalCadastro.style.display == "none") {
        modalCadastro.style.display = "flex";
    } else {
        const alert = confirm("Gostaria de fechar o modal?");
        if (alert) {
            modalCadastro.style.display = "none"
            fade.style.display = "none";
        }
    }
}

function cadastrarFuncionario() {
    let nome = ipt_nome.value;
    let telefone = ipt_telefone.value;
    let cargo = slt_cargo.value;
    let email = ipt_email.value;
    let senha = ipt_senha.value;

    let senhaMinuscula = senha.toLowerCase();
    let senhaMaiuscula = senha.toUpperCase();

    let regex = /[^\w\s]/;

    console.log(cargo);

    if(!nome.includes(" ")) {
        return alert("Por favor insira o nome completo");
    } else if(telefone.length != 11) {
        return alert("Por favor insira um telefone válido");
    } else if(cargo != "Analista de Dados" && cargo != "Tecnico de Operacao") {
        return alert("Por favor escolha um cargo válido");
    } else if(!email.includes("@") || !email.includes(".com") || email.length < 8) {
        return alert("Por favor insira um email válido");
    } else if(senha.length < 8 || senha == senhaMaiuscula || senha == senhaMinuscula || !regex.test(senha) || !/[0-9]/.test(senha)) {
        return alert("Por favor insira uma senha válida");
    }

    fetch("/gerente/cadastrarFuncionario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nomeServer: nome,
            telefoneServer: telefone,
            cargoServer: cargo,
            emailServer: email,
            senhaServer: senha,
            idAgenciaServer: idAgencia
        })
    }).then((resultado) => {
        carregarDados();
        let modal = document.querySelector(".modal");
        let fade = document.querySelector(".fade");
        modal.style.display = "none";
        fade.style.display = "none";
    })
}

function mostrarModalEdit(indice, idUsuario) {
    const modalEdit = document.querySelector(".modal-edit-funcionario");
    const fade = document.querySelector(".fade");

    if (modalEdit.style.display == "none") {
        modalEdit.style.display = "flex";
    } else {
        const alert = confirm("Gostaria de fechar o modal?");
        if (alert) {
            modalEdit.style.display = "none"
            fade.style.display = "none";
        }
    }

    if(indice != undefined) {
        ipt_nomeEdit.value = vetor.lista[indice].nome;
        ipt_telefoneEdit.value = vetor.lista[indice].telefone;

        if(vetor.lista[indice].cargo == "Tecnico de Operacao") {
            slt_cargoEdit.value = 1;
        } else {
            slt_cargoEdit.value = 2;
        }

        ipt_emailEdit.value = vetor.lista[indice].email;
        ipt_senhaEdit.value = vetor.lista[indice].senha;

        let botao = document.getElementById("botao_atualizar")
        botao.innerHTML = `
            <button onclick="atualizarFuncionario(${indice}, ${idUsuario})">Salvar Mudanças</button>     
            <img src="../../assets/icons/trash.png" class="icon-deletar" alt="" onclick="mostrarModalDelete(${idUsuario})">
        `;
    }
}

function atualizarFuncionario(indice, id) {
    let nome = ipt_nomeEdit.value;
    let telefone = ipt_telefoneEdit.value;
    let cargo = slt_cargoEdit.value;
    let email = ipt_emailEdit.value;
    let senha = ipt_senhaEdit.value;

    if(cargo == 1) {
        cargo = "Tecnico de Operação"
    } else {
        cargo = "Analista de Dados"
    }

    let senhaMinuscula = senha.toLowerCase();
    let senhaMaiuscula = senha.toUpperCase();

    let regex = /[^\w\s]/;

    if(!nome.includes(" ")) {
        return alert("Por favor insira o nome completo");
    } else if(telefone.length != 11) {
        return alert("Por favor insira um telefone válido");
    } else if(cargo != "Analista de Dados" && cargo != "Tecnico de Operacao") {
        return alert("Por favor escolha um cargo válido");
    } else if(!email.includes("@") || !email.includes(".com") || email.length < 8) {
        return alert("Por favor insira um email válido");
    } else if(senha.length < 8 || senha == senhaMaiuscula || senha == senhaMinuscula || !regex.test(senha) || !/[0-9]/.test(senha)) {
        return alert("Por favor insira uma senha válida");
    }

    let json = {
        idUsuario: id,
        nome: nome,
        telefone: telefone,
        cargo: cargo,
        email: email,
        senha: senha,
        fkAgencia: Number(idAgencia)
    }

    if(JSON.stringify(json) != JSON.stringify(vetor.lista[indice])) {
        console.log(json);
        fetch(`/gerente/atualizarFuncionario`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                jsonEnvio: json
            })
        }).then((resultado) => {
            resultado.json()
            .then(json => {
                carregarDados();
                let modal = document.querySelector(".modal-edit");
                let fade = document.querySelector(".fade");
                modal.style.display = "none";
                fade.style.display = "none";
            })
        })
    }

}

function mostrarModalDelete(idUsuario) {
    const modalDelete = document.querySelector(".modal-del-funcionario");
    const fade = document.querySelector(".fade");

    if (modalDelete.style.display == "none") {
        modalDelete.style.display = "flex";
    } else {
        const alert = confirm("Gostaria de fechar o modal?");
        if (alert) {
            modalDelete.style.display = "none"
            fade.style.display = "none";
        }
    }

    button_remover_funcionario.innerHTML = `
        <button onclick="removerFuncionario(${idUsuario})">Remover</button>
    `;
}

function removerFuncionario(idUsuario) {
    let escrito = ipt_confirmar.value;
    if(escrito == "excluir") {
        fetch(`/gerente/${idUsuario}/removerFuncionario`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((resultado) => {
            carregarDados();
    
            const modalDelete = document.querySelector(".modal-del-funcionario");
            const modalEdit = document.querySelector(".modal-edit");
            const fade = document.querySelector(".fade");
    
            modalDelete.style.display = "none";
            modalEdit.style.display = "none";
            fade.style.display = "none";
        })
    } else {
        alert("Preencha corretamente o campo");
    }
}