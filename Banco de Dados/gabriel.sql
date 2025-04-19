CREATE DATABASE streamline;
USE streamline;

CREATE TABLE IF NOT EXISTS empresa (
  idEmpresa INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nome VARCHAR(45) NOT NULL,
  cnpj VARCHAR(45) NOT NULL,
  codigo CHAR(8) NOT NULL
);

CREATE TABLE IF NOT EXISTS endereco (
  idEndereco INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  cep CHAR(8) NOT NULL,
  logradouro VARCHAR(100) NOT NULL,
  bairro VARCHAR(45) NOT NULL,
  cidade VARCHAR(45) NOT NULL,
  uf CHAR(2) NOT NULL
);

CREATE TABLE IF NOT EXISTS agencia (
  idAgencia INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  codigoAgencia VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  telefone VARCHAR(45) NOT NULL,
  fkEmpresa INT NOT NULL,
  fkEndereco INT NOT NULL,
  FOREIGN KEY (fkEmpresa) REFERENCES empresa (idEmpresa) ON DELETE CASCADE,
  FOREIGN KEY (fkEndereco) REFERENCES endereco (idEndereco)
);

CREATE TABLE IF NOT EXISTS usuario (
  idUsuario INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nome VARCHAR(45) NOT NULL,
  telefone CHAR(11) NOT NULL,
  cargo VARCHAR(45) NOT NULL,
  email VARCHAR(45) UNIQUE NOT NULL,
  senha VARCHAR(45) NOT NULL,
  fkAgencia INT,
  FOREIGN KEY (fkAgencia) REFERENCES agencia (idAgencia) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS atm (
  idAtm INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  hostname VARCHAR(45) NOT NULL,
  modelo VARCHAR(45) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  macAdress VARCHAR(45) NOT NULL,
  sistemaOperacional VARCHAR(45) NOT NULL,
  statusATM TINYINT NOT NULL,
  fkAgencia INT NOT NULL,
  FOREIGN KEY (fkAgencia) REFERENCES agencia (idAgencia) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS componentes (
  idComponentes INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nome VARCHAR(45) NOT NULL,
  descricao VARCHAR(45) NOT NULL,
  tipo VARCHAR(45) NOT NULL,
  unidadeMedida VARCHAR(45) NOT NULL,
  funcao VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS parametro (
	idParametro INT AUTO_INCREMENT NOT NULL,
	limite DOUBLE NOT NULL,
	dtAlteracao DATE NOT NULL,
	identificador VARCHAR(45),
    fkComponente INT NOT NULL,
    fkAtm INT NOT NULL,
	PRIMARY KEY (idParametro, fkAtm, fkComponente),
	FOREIGN KEY (fkAtm) REFERENCES atm(idAtm) ON DELETE CASCADE, 
	FOREIGN KEY (fkComponente) REFERENCES componentes(idComponentes) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerta (
  idAlerta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  valor DOUBLE NOT NULL,
  dtHora DATETIME,
  fkParametro INT,
  FOREIGN KEY (fkParametro) REFERENCES parametro(idParametro) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS captura (
  idCaptura INT PRIMARY KEY AUTO_INCREMENT,
  valor DOUBLE,
  dtHora DATETIME,
  fkParametro INT,
  FOREIGN KEY (fkParametro) REFERENCES parametro(idParametro) ON DELETE CASCADE
);

-- Inserindo empresas manualmente
INSERT INTO empresa (nome, cnpj, codigo) VALUES
('Banco do Brasil', '123456789', 'BB123456'),
('Caixa Federal', '987654321', 'CEF12345'),
('Bradesco', '12435687', 'BRA12345');

-- Inserindo endereços para as agências
INSERT INTO endereco (cep, logradouro, bairro, cidade, uf) VALUES
('01001000', 'Av. Paulista, 1000', 'Bela Vista', 'São Paulo', 'SP'),
('20040002', 'Rua da Assembleia, 50', 'Centro', 'Rio de Janeiro', 'RJ'),
('30120040', 'Av. Afonso Pena, 2000', 'Centro', 'Belo Horizonte', 'MG');

-- INSERÇÃO DE AGÊNCIAS
INSERT INTO agencia (codigoAgencia, email, telefone, fkEmpresa, fkEndereco) VALUES
  ('ABC', 'agencia@bb.com.br', '6134210001', 1, 1);
INSERT INTO agencia (codigoAgencia, email, telefone, fkEmpresa, fkEndereco) VALUES
  ('CBD', 'agencia@bb.com.br', '1134210002', 1, 2);
INSERT INTO agencia (codigoAgencia, email, telefone, fkEmpresa, fkEndereco) VALUES
  ('EFG', 'agencia@bb.com.br', '2134210003', 1, 3);


-- Inserindo funcionários só para a primeira agência do Banco do Brasil
INSERT INTO usuario (nome, telefone, cargo, email, senha, fkAgencia) VALUES
  ('Geraldo', '11987654321', 'Gerente', 'geraldo@bb.com.br', 'senha123', 1),
  ('Lucas', '11987654322', 'Técnico de Operação', 'lucas@bb.com.br', 'senha123', 1),
  ('Thiago', '11987654323', 'Analista de Dados', 'thiago@bb.com.br', 'senha123', 1),
  ('Ariel', '11987736423', 'CEO', 'ariel@streamline.com.br', 'Urubu#123', NULL),
  ('Caio', '11984364323', 'CEO', 'caio@streamline.com.br', 'Urubu#123', NULL),
  ('Gabriel', '11987652353', 'CEO', 'gabriel@streamline.com.br', 'Urubu#123', NULL),
  ('Guilherme', '11986543323', 'CEO', 'guilherme@streamline.com.br', 'Urubu#123', NULL),
  ('Nicoly', '11987975823', 'CEO', 'nicoly@streamline.com.br', 'Urubu#123', NULL);

-- INSERÇÃO DE COMPONENTES
INSERT INTO componentes (nome, descricao, tipo, unidadeMedida, funcao) VALUES
  ('CPU', 'PORCENTAGEM', 'CPUPercent', 'Porcentagem', 'cpu_percent'),
  ('CPU', 'FREQUÊNCIA', 'CPUFreq', 'GHz', 'cpu_freq'),
  ('RAM', 'TOTAL', 'RAMTotal', 'GB', 'virtual_memory.total'),
  ('RAM', 'DISPONÍVEL', 'RAMDisponivel', 'GB', 'virtual_memory.available'),
  ('RAM', 'PORCENTAGEM', 'RAMPercentual', 'Porcentagem', 'virtual_memory.percent'),
  ('DISCO', 'TOTAL', 'DISKTotal', 'GB', 'disk_usage.total'),
  ('DISCO', 'DISPONÍVEL', 'DISKDisponivel', 'GB', 'disk_usage.free'),
  ('DISCO', 'PORCENTAGEM', 'DISKPercentual', 'Porcentagem', 'disk_usage.percent'),
  ('REDE', 'RECEBIDA', 'REDERecebida', 'Bytes', 'net_io_counters.bytes_recv'),
  ('REDE', 'ENVIADA', 'REDEEnviada', 'Bytes', 'net_io_counters.bytes_sent'),
  ('PROCESSOS', 'DESATIVADOS', 'PROCESSODesativado', 'Unidades', 'process_iter.desativados'),
  ('PROCESSOS', 'ATIVOS', 'PROCESSOAtivos', 'Unidades', 'process_iter.ativos'),
  ('PROCESSOS', 'TOTAL', 'PROCESSOTotal', 'Unidades', 'process_iter.total');

-- INSERÇÃO DE ATMs E PARÂMETROS
INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM001', 'BB 7000', '192.168.1.1', '00:1B:44:11:3A:0A', 'Windows Embedded 8', 1, 1);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 1),
  (80.0, CURDATE(), 2, 1),
  (85.0, CURDATE(), 3, 1),
  (15.0, CURDATE(), 4, 1),
  (80.0, CURDATE(), 5, 1),
  (90.0, CURDATE(), 6, 1),
  (10.0, CURDATE(), 7, 1),
  (80.0, CURDATE(), 8, 1);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM002', 'BB 7000', '192.168.1.2', '00:1B:44:11:3A:0B', 'Windows Embedded 8', 1, 1);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 2),
  (80.0, CURDATE(), 2, 2),
  (85.0, CURDATE(), 3, 2),
  (15.0, CURDATE(), 4, 2),
  (80.0, CURDATE(), 5, 2),
  (90.0, CURDATE(), 6, 2),
  (10.0, CURDATE(), 7, 2),
  (80.0, CURDATE(), 8, 2);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM003', 'BB 7000', '192.168.1.3', '00:1B:44:11:3A:0C', 'Windows Embedded 8', 1, 1);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 3),
  (80.0, CURDATE(), 2, 3),
  (85.0, CURDATE(), 3, 3),
  (15.0, CURDATE(), 4, 3),
  (80.0, CURDATE(), 5, 3),
  (90.0, CURDATE(), 6, 3),
  (10.0, CURDATE(), 7, 3),
  (80.0, CURDATE(), 8, 3);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM004', 'BB 7000', '192.168.1.4', '00:1B:44:11:3A:0D', 'Windows Embedded 8', 1, 1);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 4),
  (80.0, CURDATE(), 2, 4),
  (85.0, CURDATE(), 3, 4),
  (15.0, CURDATE(), 4, 4),
  (80.0, CURDATE(), 5, 4),
  (90.0, CURDATE(), 6, 4),
  (10.0, CURDATE(), 7, 4),
  (80.0, CURDATE(), 8, 4);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM005', 'BB 7000', '192.168.1.5', '00:1B:44:11:3A:0E', 'Windows Embedded 8', 1, 1);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 5),
  (80.0, CURDATE(), 2, 5),
  (85.0, CURDATE(), 3, 5),
  (15.0, CURDATE(), 4, 5),
  (80.0, CURDATE(), 5, 5),
  (90.0, CURDATE(), 6, 5),
  (10.0, CURDATE(), 7, 5),
  (80.0, CURDATE(), 8, 5);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM006', 'BB 7000', '192.168.1.6', '00:1B:44:11:3A:0F', 'Windows Embedded 8', 1, 1);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 6),
  (80.0, CURDATE(), 2, 6),
  (85.0, CURDATE(), 3, 6),
  (15.0, CURDATE(), 4, 6),
  (80.0, CURDATE(), 5, 6),
  (90.0, CURDATE(), 6, 6),
  (10.0, CURDATE(), 7, 6),
  (80.0, CURDATE(), 8, 6);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM007', 'BB 7000', '192.168.1.7', '00:1B:44:11:3A:10', 'Windows Embedded 8', 1, 1);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 7),
  (80.0, CURDATE(), 2, 7),
  (85.0, CURDATE(), 3, 7),
  (15.0, CURDATE(), 4, 7),
  (80.0, CURDATE(), 5, 7),
  (90.0, CURDATE(), 6, 7),
  (10.0, CURDATE(), 7, 7),
  (80.0, CURDATE(), 8, 7),
  (600, CURDATE(), 9, 7), -- REDE
  (600, CURDATE(), 10, 7),
  (300, CURDATE(), 11, 7),
  (300, CURDATE(), 12, 7),
  (300, CURDATE(), 13, 7);

-- AGÊNCIA 2

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM001', 'BB-7000', '192.168.1.1', '00:1B:44:11:3A:0A', 'Windows Embedded 8', 1, 2);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 8),
  (80.0, CURDATE(), 2, 8),
  (85.0, CURDATE(), 3, 8),
  (15.0, CURDATE(), 4, 8),
  (80.0, CURDATE(), 5, 8),
  (90.0, CURDATE(), 6, 8),
  (10.0, CURDATE(), 7, 8),
  (80.0, CURDATE(), 8, 8);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM002', 'BB 7000', '192.168.1.2', '00:1B:44:11:3A:0B', 'Windows Embedded 8', 1, 2);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 9),
  (80.0, CURDATE(), 2, 9),
  (85.0, CURDATE(), 3, 9),
  (15.0, CURDATE(), 4, 9),
  (80.0, CURDATE(), 5, 9),
  (90.0, CURDATE(), 6, 9),
  (10.0, CURDATE(), 7, 9),
  (80.0, CURDATE(), 8, 9);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM003', 'BB 7000', '192.168.1.3', '00:1B:44:11:3A:0C', 'Windows Embedded 8', 1, 2);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 10),
  (80.0, CURDATE(), 2, 10),
  (85.0, CURDATE(), 3, 10),
  (15.0, CURDATE(), 4, 10),
  (80.0, CURDATE(), 5, 10),
  (90.0, CURDATE(), 6, 10),
  (10.0, CURDATE(), 7, 10),
  (80.0, CURDATE(), 8, 10);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM004', 'BB 7000', '192.168.1.4', '00:1B:44:11:3A:0D', 'Windows Embedded 8', 1, 2);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 11),
  (80.0, CURDATE(), 2, 11),
  (85.0, CURDATE(), 3, 11),
  (15.0, CURDATE(), 4, 11),
  (80.0, CURDATE(), 5, 11),
  (90.0, CURDATE(), 6, 11),
  (10.0, CURDATE(), 7, 11),
  (80.0, CURDATE(), 8, 11);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM005', 'BB 7000', '192.168.1.5', '00:1B:44:11:3A:0E', 'Windows Embedded 8', 1, 2);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 12),
  (80.0, CURDATE(), 2, 12),
  (85.0, CURDATE(), 3, 12),
  (15.0, CURDATE(), 4, 12),
  (80.0, CURDATE(), 5, 12),
  (90.0, CURDATE(), 6, 12),
  (10.0, CURDATE(), 7, 12),
  (80.0, CURDATE(), 8, 12);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM006', 'BB 7000', '192.168.1.6', '00:1B:44:11:3A:0F', 'Windows Embedded 8', 1, 2);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 13),
  (80.0, CURDATE(), 2, 13),
  (85.0, CURDATE(), 3, 13),
  (15.0, CURDATE(), 4, 13),
  (80.0, CURDATE(), 5, 13),
  (90.0, CURDATE(), 6, 13),
  (10.0, CURDATE(), 7, 13),
  (80.0, CURDATE(), 8, 13);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM007', 'BB 7000', '192.168.1.7', '00:1B:44:11:3A:10', 'Windows Embedded 8', 1, 2);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 14),
  (80.0, CURDATE(), 2, 14),
  (85.0, CURDATE(), 3, 14),
  (15.0, CURDATE(), 4, 14),
  (80.0, CURDATE(), 5, 14),
  (90.0, CURDATE(), 6, 14),
  (10.0, CURDATE(), 7, 14),
  (80.0, CURDATE(), 8, 14);


-- AGÊNCIA 3

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM001', 'BB-7000', '192.168.1.1', '00:1B:44:11:3A:0A', 'Windows Embedded 8', 1, 3);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 15),
  (80.0, CURDATE(), 2, 15),
  (85.0, CURDATE(), 3, 15),
  (15.0, CURDATE(), 4, 15),
  (80.0, CURDATE(), 5, 15),
  (90.0, CURDATE(), 6, 15),
  (10.0, CURDATE(), 7, 15),
  (80.0, CURDATE(), 8, 15);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM002', 'BB 7000', '192.168.1.2', '00:1B:44:11:3A:0B', 'Windows Embedded 8', 1, 3);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 16),
  (80.0, CURDATE(), 2, 16),
  (85.0, CURDATE(), 3, 16),
  (15.0, CURDATE(), 4, 16),
  (80.0, CURDATE(), 5, 16),
  (90.0, CURDATE(), 6, 16),
  (10.0, CURDATE(), 7, 16),
  (80.0, CURDATE(), 8, 16);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM003', 'BB 7000', '192.168.1.3', '00:1B:44:11:3A:0C', 'Windows Embedded 8', 1, 3);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 17),
  (80.0, CURDATE(), 2, 17),
  (85.0, CURDATE(), 3, 17),
  (15.0, CURDATE(), 4, 17),
  (80.0, CURDATE(), 5, 17),
  (90.0, CURDATE(), 6, 17),
  (10.0, CURDATE(), 7, 17),
  (80.0, CURDATE(), 8, 17);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM004', 'BB 7000', '192.168.1.4', '00:1B:44:11:3A:0D', 'Windows Embedded 8', 1, 3);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 18),
  (80.0, CURDATE(), 2, 18),
  (85.0, CURDATE(), 3, 18),
  (15.0, CURDATE(), 4, 18),
  (80.0, CURDATE(), 5, 18),
  (90.0, CURDATE(), 6, 18),
  (10.0, CURDATE(), 7, 18),
  (80.0, CURDATE(), 8, 18);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM005', 'BB 7000', '192.168.1.5', '00:1B:44:11:3A:0E', 'Windows Embedded 8', 1, 3);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 19),
  (80.0, CURDATE(), 2, 19),
  (85.0, CURDATE(), 3, 19),
  (15.0, CURDATE(), 4, 19),
  (80.0, CURDATE(), 5, 19),
  (90.0, CURDATE(), 6, 19),
  (10.0, CURDATE(), 7, 19),
  (80.0, CURDATE(), 8, 19);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM006', 'BB 7000', '192.168.1.6', '00:1B:44:11:3A:0F', 'Windows Embedded 8', 1, 3);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 20),
  (80.0, CURDATE(), 2, 20),
  (85.0, CURDATE(), 3, 20),
  (15.0, CURDATE(), 4, 20),
  (80.0, CURDATE(), 5, 20),
  (90.0, CURDATE(), 6, 20),
  (10.0, CURDATE(), 7, 20),
  (80.0, CURDATE(), 8, 20);

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM007', 'BB 7000', '192.168.1.7', '00:1B:44:11:3A:10', 'Windows Embedded 8', 1, 3);
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 21),
  (80.0, CURDATE(), 2, 21),
  (85.0, CURDATE(), 3, 21),
  (15.0, CURDATE(), 4, 21),
  (80.0, CURDATE(), 5, 21),
  (90.0, CURDATE(), 6, 21),
  (10.0, CURDATE(), 7, 21),
  (80.0, CURDATE(), 8, 21);



SELECT * FROM empresa;

SELECT 
	idAtm,
    atm.hostname AS nome
FROM atm WHERE fkAgencia = 1;

SELECT DISTINCT
	c.nome
FROM componentes c
JOIN parametro p ON c.idComponentes = p.fkComponente
WHERE p.fkAtm = '1';   -- Substitua o "?" pelo id do ATM desejado


SELECT 
	c.unidadeMedida as metrica
FROM componentes c
JOIN parametro p ON c.idComponentes = p.fkComponente
WHERE c.nome = 'CPU' and p.fkAtm = 1;   -- Substitua o "?" pelo id do ATM desejado


-- Selecionar componentes e configurações de tal atm
/*
SELECT 
    atm.idAtm,
    atm.hostname,
    componentes.idComponentes,
    componentes.tipo,
    componentes.descricao,
    medida.idMedida,
    medida.tipo,
    medida.formato,
    medida.funcaoPsutil,
    configuracao.idConfiguracao,
    configuracao.limite,
    configuracao.dtAlteracao
FROM componentes
JOIN atm ON componentes.fkAtm = atm.idAtm
LEFT JOIN configuracao ON configuracao.fkComponente = componentes.idComponentes
LEFT JOIN medida ON configuracao.fkMedida = medida.idMedida
WHERE atm.idAtm = 1;
*/

CREATE USER "userPython"@"%" IDENTIFIED BY "Urubu100";
GRANT SELECT ON streamline.teste TO "userPython"@"%";
FLUSH PRIVILEGES;

USE streamline;
CREATE USER "rootPI"@"%" IDENTIFIED BY "Urubu#100";
GRANT ALL ON streamline.* TO "rootPI"@"%";
FLUSH PRIVILEGES;

SELECT * FROM parametro AS p JOIN atm ON p.fkAtm = atm.idAtm WHERE idAtm = 1;

SELECT p.*, atm.hostname, atm.macAdress, componentes.* FROM parametro AS p JOIN atm ON p.fkAtm = atm.idAtm JOIN componentes ON componentes.idComponentes = p.fkComponente WHERE idAtm = 1;

SELECT * FROM teste;

SELECT p.*, atm.hostname, atm.macAdress, componentes.* FROM parametro AS p JOIN atm ON p.fkAtm = atm.idAtm JOIN componentes ON componentes.idComponentes = p.fkComponente WHERE idAtm = 1;

CREATE VIEW teste AS SELECT p.*, atm.hostname, atm.macAdress, componentes.* FROM parametro AS p JOIN atm ON p.fkAtm = atm.idAtm JOIN componentes ON componentes.idComponentes = p.fkComponente WHERE idAtm = 1;