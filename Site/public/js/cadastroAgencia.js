const nomeUsuario = sessionStorage.NOME_USUARIO;

function carregarDados() {
    nome_usuario.innerHTML += nomeUsuario;
    carregarCards()
    carregarEmpresas()
    carregarKpi()
}

function renderizarCards(json) {
    for (let i = 0; i < json.length; i++) {
        cardsContainer.innerHTML += `
            <div class="cards">
            <div class="perfil-agencia">
            <div class="img-agencia"></div>
            <span>Agência - <span id="empresa">${json[i].idAgencia}</span></span>
            <img class="img-edit" data-id="${json[i].idAgencia}" onclick="mostrarModalEdit(this)" src="../assets/icone-editar.png">
            </div>
            <div class="info-agencia">
            <span class="info">Código Agência:<span id="codigo">${json[i].codigoAgencia}</span></span>
            <span class="info">Telefone: <span id="telefone">${json[i].telefone}</span></span>
            <span class="info">Email: <span id="email">${json[i].email}</span></span>
            </div>
            </div>
            `
    }
}

function carregarCards() {
    const pesquisa = ipt_pesquisa.value;
    const filtro = document.getElementById("filtro-categoria");
    cardsContainer.innerHTML = "";
    let url = "";
    if (pesquisa == "" && filtro.value == "undefined") {
        url = "/agencias/mostrarAgencias"
    } else if (pesquisa != "" && filtro.value == "undefined") {
        url = `/agencias/pesquisarAgencias/${pesquisa}`
    } else if (filtro.value != "undefined") {
        url = `/agencias/pesquisarAgencias/${pesquisa}/${filtro.value}`
    }

    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        if (res.status == 400) {
            cardsContainer.innerHTML = `<div class="resultado"><span>Nenhum resultado encontrado! :(</span></div>`
        }
        res.json()
            .then(json => {
                if (json.length == 0) {
                    cardsContainer.innerHTML = `<div class="resultado"><span>Nenhuma agência cadastrada! :(</span></div>`;
                }
                renderizarCards(json);
            })
    })
}

function carregarKpi() {
    fetch("/agencias/contarAgencias", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        res.json()
            .then(json => {
                console.log(json[0].agencias)
                kpi.innerHTML = json[0].agencias;
            })
    })
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

function mostrarModalEdit(cardAtual) {
    const idAgencia = cardAtual.getAttribute("data-id");
    const modal = document.querySelector(".modal-edit");
    const fade = document.querySelector(".fade");

    modal.setAttribute("data-id", idAgencia)
    if (modal.style.display == "none") {
        modal.style.display = "flex";
        fade.style.display = "block";
    } else {
        modal.style.display = "none"
        fade.style.display = "none";
    }
}

function fecharModalEdit() {
    const modal = document.querySelector(".modal-edit");
    const fade = document.querySelector(".fade");

    modal.style.display = "none"
    fade.style.display = "none";

}

function mostrarFiltros() {
    const filtro = document.querySelector(".filtros");
    if (filtro.style.display == "none") {
        filtro.style.display = "block";
    } else {
        filtro.style.display = "none";
    }
}

function carregarEmpresas() {

    fetch("/empresas/mostrarEmpresas", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        res.json()
            .then(json => {
                for (let i = 0; i < json.length; i++) {
                    valoresSelect.innerHTML += `
                    <option value="${json[i].idEmpresa}">${json[i].nome}</option>
                `
                }
            })
    })

}

function puxarCep() {
    const cep = document.getElementById("iptCEP").value;
    if (cep.length == 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        }).then((res) => {
            res.json()
                .then(json => {
                    console.log(json)
                    document.getElementById("iptUF").value = json.uf;
                    document.getElementById("iptCidade").value = json.localidade;
                    document.getElementById("iptBairro").value = json.bairro;
                    document.getElementById("iptLogradouro").value = json.logradouro;
                })
        })
    }
}

function limparDados() {
    document.getElementById("codigo-empresa").value = "";
    document.getElementById("iptCodigoAgencia").value = "";
    document.getElementById("iptEmail").value = "";
    document.getElementById("iptNumero").value = "";
    document.getElementById("iptCEP").value = "";
    document.getElementById("iptUF").value = "";
    document.getElementById("iptCidade").value = "";
    document.getElementById("iptBairro").value = "";
    document.getElementById("iptLogradouro").value = "";
}

function cadastrarAgencia() {
    var codigoEmpresaVar = document.getElementById("codigo-empresa").value;
    var codigoAgenciaVar = document.getElementById("iptCodigoAgencia").value;
    var emailVar = document.getElementById("iptEmail").value;
    var numeroVar = document.getElementById("iptNumero").value;
    var cepVar = document.getElementById("iptCEP").value;
    var ufVar = document.getElementById("iptUF").value;
    var cidadeVar = document.getElementById("iptCidade").value;
    var bairroVar = document.getElementById("iptBairro").value;
    var logradouroVar = document.getElementById("iptLogradouro").value;

    console.log("Dados a serem enviados:", {
        codigoEmpresaServer: codigoEmpresaVar,
        codigoAgenciaServer: codigoAgenciaVar,
        emailServer: emailVar,
        numeroServer: numeroVar,
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
            numeroServer: numeroVar,
            cepServer: cepVar,
            ufServer: ufVar,
            cidadeServer: cidadeVar,
            bairroServer: bairroVar,
            logradouroServer: logradouroVar
        }),
    }).then(function (res) {
        alert("Agência cadastrada no sistema!")
        carregarCards();
        mostrarModalCad();
        carregarKpi();
        limparDados();
        if (!res.ok) {
            alert("Algum erro ocorreu no cadastro")

        }
    })
        .catch(function (resposta) {
            console.log(`ERRO: ${resposta}`);
        });

    return false;
}

function atualizarAgencia() {
    const modal = document.querySelector(".modal-edit");
    const idAgencia = modal.getAttribute("data-id");
    const email = document.getElementById("iptEmailEdit").value;
    const telefone = document.getElementById("iptNumeroEdit").value;

    console.log("Id agencia", idAgencia)

    if (confirm("Gostaria de atualizar a agência?")) {
        fetch(`/agencias/atualizarAgencia/${idAgencia}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailServer: email,
                numeroServer: telefone
            }),
        }).then(function (res) {
            console.log(res);
            fecharModalEdit()
            carregarCards()
            carregarKpi()
        })
    }

}

function deletarAgencia() {
    const modal = document.querySelector(".modal-edit");
    const idAgencia = modal.getAttribute("data-id");

    console.log("IdAgencia:", idAgencia);


    if (confirm("Quer apagar a agência mesmo?")) {

        fetch(`/agencias/deletarAgencia/${idAgencia}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(function (resultado) {
            console.log(resultado);
            if (resultado.ok) {
                fecharModalEdit()
                carregarCards()
                carregarKpi()
            } else {
                alert("Erro ao apagar agência")
            }
        })
    }


}
