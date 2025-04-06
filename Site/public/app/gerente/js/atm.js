const cargo = sessionStorage.CARGO_USUARIO;
const email = sessionStorage.EMAIL_USUARIO;
const idAgencia = sessionStorage.ID_AGENCIA;
const idUsuario = sessionStorage.ID_USUARIO;
const nomeUsuario = sessionStorage.NOME_USUARIO;

function mostrarDados() {
    // abrirFiltros(1);
    let nome = document.getElementById("nomeUsuario");
    nome.innerHTML = nomeUsuario;

    console.log(cargo, " ", email, " ", idAgencia, " ", idUsuario, " ", nomeUsuario)
    carregarCards();
}

function abrirFiltros(formato) {
    const divFiltro = document.getElementById("filtros");

    if(formato == 0) {
        divFiltro.style.width = "30vw";
        divFiltro.style.height = "6vh";
        divFiltro.innerHTML = `
            <div style="width: 5vw;height: 6vh" class="icon-filtro-ativado" onclick="abrirFiltros(1)"></div>
            <select id="slt_filtro_principal" onchange="abrirSegundaFiltragem()">
                <option value="#" selected disabled>Selecionar</option>
                <option value="modelo">Modelo</option>
                <option value="so">Sistema Operacional</option>
                <option value="status">Status</option>
            </select>
            <select id="slt_filtro_secundario" onchange="filtrar()"></select>
            <div style="width: 5vw;height: 6vh;" class="icon-cadastrar" onclick="abrirCadastro()"></div>
            `
    } else {
        divFiltro.style.width = "10%";
        divFiltro.style.height = "80%";
        divFiltro.innerHTML = `
            <div style="width: 2.75vw;height: 5vh" class="icon-filtro" onclick="abrirFiltros(0)"></div>
            <div style="width: 3vw;height: 6vh;" class="icon-cadastrar" onclick="abrirCadastro()"></div>`
    }
}

function abrirSegundaFiltragem() {
    const selecionado = slt_filtro_principal.value;
    const segundoFiltro = document.getElementById("slt_filtro_secundario");

    if(selecionado == "modelo") {
        console.log("passou modelo")
    } else if(selecionado == "so") {
        console.log("passou so");
    } else {
        segundoFiltro.innerHTML = `
            <option value="#" selected disabled>Selecionar</option>
            <option value="ativo">Ativo</option>
            <option value="desativado">Desativado</option>
        `;
    }
}

function search() {
    let escrito = document.getElementById("search").value;

    if(escrito == "" || escrito == " ") {
        carregarCards();
    } else {
        fetch(`/gerente/${escrito}/${idAgencia}/search`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(function (resposta) {
            resposta.json()
                .then(json => {
                    console.log(json.lista);
                })
        })
    }
}

function carregarCards() {
    fetch(`/gerente/${idAgencia}/carregarCards`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(function (resposta) {
        resposta.json()
            .then(json => {
                console.log(json.lista);
            })
    })
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
    let modelo = ipt_modelo.value;
    let ip = ipt_ip.value;
    let hostname = ipt_hostname.value;
    let macadress = ipt_macadress.value;
    let so = ipt_so.value;
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
        }).then((resultado) => {
            resultado.json()
            .then(json => {
                console.log(json.lista)
            })
        })
    })
}