// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var usuarioRouter = require("./src/routes/usuarios");
var indexRouter = require("./src/routes/index");
var gerenteRouter = require("./src/routes/gerente")
var agenciaRouter = require("./src/routes/agencias")
var medidasRouter = require("./src/routes/medidas");
var empresaRouter = require("./src/routes/empresas");
var tempoRealRouter = require("./src/routes/tempoReal");
var dashLongoPrazoRouter = require("./src/routes/dashLongoPrazo");
var awsRouter = require("./src/routes/aws");
var validarAtmRouter = require("./src/routes/validarAtm");
var dadosInsertRouter = require("./src/routes/dadosInsert");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/usuarios", usuarioRouter);
app.use("/gerente", gerenteRouter);
app.use("/agencias", agenciaRouter);
app.use("/medidas", medidasRouter);
app.use("/empresas", empresaRouter);
app.use("/tempoReal", tempoRealRouter);
app.use("/dashLongoPrazo", dashLongoPrazoRouter);
app.use("/aws", awsRouter);
app.use("/validarAtm", validarAtmRouter);
app.use("/dadosInsert", dadosInsertRouter);
app.use("/", indexRouter)

app.listen(PORTA_APP, function () {
    console.log(`
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});
