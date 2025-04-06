function mostrarDados() {
    // abrirFiltros(1);
    let nome = document.getElementById("nomeUsuario");

    nome.innerHTML = sessionStorage.NOME_USUARIO;
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
        console.log("passou modelo");
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