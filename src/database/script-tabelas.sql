-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

CREATE DATABASE patronum;

USE patronum;

CREATE TABLE casa (
	id_casa INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(45),
	fundador varchar(45),
);

CREATE TABLE pessoa (
	id_pessoa INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	email VARCHAR(50),
	dt_nasc date,
	senha VARCHAR(50),
	fk_casa INT,
	FOREIGN KEY (fk_casa) REFERENCES casa(id_casa)
);

CREATE TABLE interacoes (
	id INT PRIMARY KEY AUTO_INCREMENT,
	numero int,
	dt_hora datetime,
	fk_pessoa INT,
	FOREIGN KEY (fk_pessoa) REFERENCES pessoa(id_pessoa)
);

create table quizzes (
	id_quizz INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(45),
	pontuacao float,
	vezes int,
	fk_pessoa1 INT,
	FOREIGN KEY (fk_pessoa1) REFERENCES pessoa(id_pessoa)
);

