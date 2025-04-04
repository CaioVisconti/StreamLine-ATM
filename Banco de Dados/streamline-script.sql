CREATE DATABASE streamline;
USE streamline;

CREATE TABLE empresa (
	idEmpresa int primary key auto_increment,
    nome varchar(45),
    cnpj char(14)
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
	idAtm int primary key auto_increment,
    modelo varchar(45),
    processador varchar(45),
    ramTotal double,
    discoTotal double,
    sistemaOperacional varchar(45),
    status varchar(7),
    constraint chkStatus check(status in("ativo","inativo")),
    fkAgencia int not null,
    constraint fkAgencia foreign key (fkAgencia) references agencia(idAgencia)
) auto_increment = 1000;

CREATE TABLE metrica(
	idMetrica int primary key auto_increment,
    tipoMetrica varchar(45) not null,
    limiteMin double not null,
    limiteMax double not null,
    fkLimiteAtm int not null,
    constraint fkLimiteAtm foreign key (fkLimiteAtm) references atm(idAtm)
);

CREATE TABLE captura (
	idCaptura int primary key auto_increment,
    tipoCaptura varchar(45),
    valorCaptura double,
    dtCaptura datetime,
    fkAtm int not null,
    constraint fkAtm foreign key (fkAtm) references atm(idAtm)
);


CREATE TABLE alerta (
	idAlerta int primary key auto_increment,
    tipo varchar(45) not null,
    gravidade varchar(10) not null,
    constraint chkGravidade check(gravidade in("normal","media","critico")),
    dtAlerta datetime not null,
    fkCaptura int not null,
    constraint fkCaptura foreign key (fkCaptura) references captura(idCaptura)
);

INSERT INTO empresa (nome, cnpj) VALUES 
('Empresa A', '12345678000199'),
('Empresa B', '98765432000188');

INSERT INTO usuario (nome, cpf, telefone, cargo, email, senha, fkEmpresa) VALUES
('João Silva', '11122233344', '11987654321', 'Gerente', 'joao@empresa.com', 'senha123', 1),
('Maria Souza', '55566677788', '11912345678', 'Técnico', 'maria@empresa.com', 'senha456', 2);

INSERT INTO agencia (cep, logradouro, bairro, cidade, uf, fkEmpresaAgencia) VALUES
('01001000', 'Rua A', 'Centro', 'São Paulo', 'SP', 1),
('02002000', 'Rua B', 'Bairro B', 'Rio de Janeiro', 'RJ', 2);

INSERT INTO atm (modelo, processador, ramTotal, discoTotal, sistemaOperacional, status, fkAgencia) VALUES
('ATM XPTO', 'Intel i5', 8, 500, 'Windows 10', 'ativo', 1),
('ATM ZYX', 'AMD Ryzen 5', 16, 1000, 'Linux', 'ativo', 2);

INSERT INTO metrica (tipoMetrica, limiteMin, limiteMax, fkLimiteAtm) VALUES
('Uso de CPU', 10, 90, 1000),
('Uso de RAM', 20, 80, 1001);