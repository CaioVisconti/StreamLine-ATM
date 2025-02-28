CREATE DATABASE streamline;
USE streamline;

CREATE TABLE empresa (
	idEmpresa int primary key auto_increment,
    nome varchar(45),
    cnpj char(14)
);

CREATE TABLE alertaLimites(
	idDefAlerta int primary key auto_increment,
    tipo varchar(45) not null,
    limiteMin double not null,
    limiteMed double not null,
    limiteMax double not null,
    fkLimiteEmpresa int not null,
    constraint fkLimiteEmpresa foreign key (fkLimiteEmpresa) references empresa(idEmpresa)
);

CREATE TABLE usuario (
	idUsuario int primary key auto_increment,
    nome varchar(45) not null,
    cpf char(11) not null unique,
    telefone char(11) not null,
    cargo varchar(45),
    email varchar(100) not null unique,
    senha varchar(45) not null,
    fkEmpresa int,
    CONSTRAINT fkEmpresa foreign key (fkEmpresa) references empresa(idEmpresa)
);

CREATE TABLE agencia (
	idAgencia int primary key auto_increment,
    cep char(8) not null,
    logradouro varchar(100) not null,
    bairro varchar(45) not null,
    cidade varchar(45) not null,
    uf char(2) not null,
    fkEmpresaAgencia int not null,
    CONSTRAINT fkEmpresaAgencia foreign key (fkEmpresaAgencia) references empresa(idEmpresa)
);

CREATE TABLE atm (
	idAtm int primary key,
    modelo varchar(45),
    processador varchar(45),
    ramTotal double,
    discoTotal double,
    sistemaOperacional varchar(45),
    status varchar(7),
    constraint chkStatus check(status in("ativo","inativo")),
    fkAgencia int not null,
    constraint fkAgencia foreign key (fkAgencia) references agencia(idAgencia)
);

CREATE TABLE captura (
	idCaptura int primary key auto_increment,
    discoUso bigint not null,
    discoPorcent double not null,
    ramDisp bigint not null,
    ramPorcent double not null,
    cpuUso double not null,
    dtCaptura datetime,
    fkAtm int not null,
    constraint fkAtm foreign key (fkAtm) references atm(idAtm)
);

CREATE TABLE metrica (
	idMetrica int primary key auto_increment,
    fkMetriAtm int not null,
    dtReferencia datetime not null,
    cpuMed double,
    cpuMin double,
    cpuMax double,
    ramMed double,
    ramMax double,
    discoMed double,
    discoMax double,
    constraint fkMetriAtm foreign key (fkMetriAtm) references atm(idAtm)
);

CREATE TABLE alerta (
	idAlerta int primary key auto_increment,
    descricao varchar(45) not null,
    gravidade varchar(10) not null,
    constraint chkGravidade check(gravidade in("normal","media","critico")),
    dtAlerta datetime not null,
    linkChamado varchar(100),
    fkUsuario int not null,
    fkCaptura int not null,
    fkMetrica int null,
    constraint fkMetrica foreign key (fkMetrica) references metrica(idMetrica),
    constraint fkCaptura foreign key (fkCaptura) references captura(idCaptura),
    constraint fkUsuario foreign key (fkUsuario) references usuario(idUsuario)
);

-- começando os testes, simulando pq nao temos dados concretos

-- Inserindo empresas
INSERT INTO empresa (idEmpresa, nome, cnpj) VALUES 
(1, 'Banco Alpha', '12345678000199');

-- Inserindo agência
INSERT INTO agencia (idAgencia, cep, logradouro, bairro, cidade, uf, fkEmpresaAgencia) VALUES 
(1, '01001000', 'Av. Paulista, 1000', 'Centro', 'São Paulo', 'SP', 1);

-- Inserindo ATMs
INSERT INTO atm (idAtm, modelo, processador, ramTotal, discoTotal, sistemaOperacional, status, fkAgencia) VALUES 
(1001, 'ATM XPTO', 'Intel i5', 8.0, 256.0, 'Windows 10', 'ativo', 1),
(1002, 'ATM ZETA', 'Intel i7', 16.0, 512.0, 'Linux', 'ativo', 1);

INSERT INTO captura (idCaptura, discoUso, ramUso, cpuUso, dtCaptura, fkAtm) VALUES 
(1, 150000000, 6000000, 55.2, '2025-02-27 10:00:00', 1001),
(2, 160000000, 70000000, 65.8, '2025-02-27 12:00:00', 1001),
(3, 170000000, 7500000000, 72.5, '2025-02-27 14:00:00', 1001);

INSERT INTO metrica (idMetrica, fkMetriAtm, dtReferencia, cpuMed, cpuMin, cpuMax, ramMed, ramMax, discoMed, discoMax) VALUES 
(1, 1001, '2025-02-27 00:00:00', 64.5, 55.2, 72.5, 6500000000, 7500000000, 160000000, 170000000);

SELECT 
    c.idCaptura,
    c.dtCaptura,
    c.cpuUso AS cpu_Porcentagem,
    c.ramDisp,
    c.ramPorcent,
    c.discoUso
FROM captura c
WHERE c.fkAtm = 1001;

select 
	c.idCaptura as idCap,
    c.dtCaptura as Data,
    c.cpuUso as Cpu,
    c.ramUso as Ram ,
    c.discoUso as Disco,
    atm.idAtm,
    atm.modelo as Modelo,
    agencia.uf as UF,
    empresa.nome as Banco
from captura c
join atm on c.fkAtm = idAtm
join agencia on atm.fkAgencia = idAgencia
join empresa on agencia.fkEmpresaAgencia = empresa.idEmpresa
WHERE atm.idAtm = 1001;

select 
	m.idMetrica as ID,
    m.dtReferencia as Data,
    m.cpuMin as "Cpu min",
    m.cpuMed as "Cpu med",
    m.cpuMax as "Cpu Max",
    m.ramMed as "Ram Med",
    m.ramMax as "Ram Max",
    m.discoMed as "Disco Med",
    m.discoMax as "Disco Max",
    atm.idAtm,
    atm.modelo as Modelo,
    agencia.uf as UF,
    empresa.nome as Banco
from metrica m
join atm on m.fkMetriAtm = idAtm
join agencia on atm.fkAgencia = idAgencia
join empresa on agencia.fkEmpresaAgencia = empresa.idEmpresa
WHERE atm.idAtm = 1001;







