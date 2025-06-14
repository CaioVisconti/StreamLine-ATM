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

-- Inserindo empresas manualmente
INSERT INTO empresa (nome, cnpj, codigo) VALUES
('Banco do Brasil', '123456789', 'BB123456'),
('Caixa Federal', '987654321', 'CEF12345'),
('Bradesco', '12435687', 'BRA12345');

-- Inserindo enderecos para as agEncias
INSERT INTO endereco (cep, logradouro, bairro, cidade, uf) VALUES
('01001000', 'Av. Paulista, 1000', 'Bela Vista', 'Sao Paulo', 'SP'),
('20040002', 'Rua da Assembleia, 50', 'Centro', 'Rio de Janeiro', 'RJ'),
('30120040', 'Av. Afonso Pena, 2000', 'Centro', 'Belo Horizonte', 'MG');

-- INSERcaO DE AGENCIAS
INSERT INTO agencia (codigoAgencia, email, telefone, fkEmpresa, fkEndereco) VALUES
  ('ABC', 'agenciapaulista@bb.com.br', '6134210001', 1, 1),
  ('CBD', 'agenciaassembleia@bb.com.br', '1134210002', 1, 2),
  ('EFG', 'agenciaafonso@bb.com.br', '2134210003', 1, 3);

-- Inserindo funcionários só para a primeira agEncia do Banco do Brasil
INSERT INTO usuario (nome, telefone, cargo, email, senha, fkAgencia) VALUES
  ('Marcelo', '11987654321', 'Gerente', 'marcelo@bb.com.br', 'senha123', 1),
  ('Lucas', '11987654322', 'Tecnico de Operacao', 'lucas@bb.com.br', 'senha123', 1),
  ('Thiago', '11987654323', 'Analista de Dados', 'thiago@bb.com.br', 'senha123', 1),
  ('Caio', '11984364323', 'CEO', 'caio@streamline.com.br', 'Urubu#123', NULL),
  ('Gabriel', '11987652353', 'CEO', 'gabriel@streamline.com.br', 'Urubu#123', NULL),
  ('Guilherme', '11986543323', 'CEO', 'guilherme@streamline.com.br', 'Urubu#123', NULL),
  ('Nicoly', '11987975823', 'CEO', 'nicoly@streamline.com.br', 'Urubu#123', NULL);

-- INSERcaO DE COMPONENTES
INSERT INTO componentes (nome, descricao, tipo, unidadeMedida, funcao) VALUES
  ('CPU', 'PORCENTAGEM', 'CPUPercent', 'Porcentagem', 'cpu_percent'),
  ('CPU', 'FREQUENCIA', 'CPUFreq', 'GHz', 'cpu_freq'),
  ('RAM', 'DISPONIVEL', 'RAMDisponivel', 'GB', 'virtual_memory.available'),
  ('RAM', 'PORCENTAGEM', 'RAMPercentual', 'Porcentagem', 'virtual_memory.percent'),
  ('DISCO', 'DISPONIVEL', 'DISKDisponivel', 'GB', 'disk_usage.free'),
  ('DISCO', 'PORCENTAGEM', 'DISKPercentual', 'Porcentagem', 'disk_usage.percent'),
  ('REDE', 'RECEBIDA', 'REDERecebida', 'Bytes', 'net_io_counters.bytes_recv'),
  ('REDE', 'ENVIADA', 'REDEEnviada', 'Bytes', 'net_io_counters.bytes_sent'),
  ('PROCESSOS', 'DESATIVADOS', 'PROCESSOSDesativado', 'Unidades', 'process_iter.desativados'),
  ('PROCESSOS', 'ATIVOS', 'PROCESSOSAtivos', 'Unidades', 'process_iter.ativos'),

-- INSERcaO DE ATMs E PARÂMETROS AGENCIA 1 (Template)
INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM007', 'BB 7000', '192.168.1.7', '00:1B:44:11:3A:10', 'Ubuntu 21.9', 1, 1),
('ni', 'BB 7000', '192.168.1.1', '3c:21:9c:81:57:22', 'Windows 11', 1, 1);

INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 1),
  (80.0, CURDATE(), 2, 1),
  (85.0, CURDATE(), 3, 1),
  (15.0, CURDATE(), 4, 1),
  (80.0, CURDATE(), 5, 1),
  (90.0, CURDATE(), 6, 1),
  (10.0, CURDATE(), 7, 1),
  (80.0, CURDATE(), 8, 1),
  (600, CURDATE(), 9, 1), 
  (600, CURDATE(), 10, 1),
  (300, CURDATE(), 11, 1),
  (300, CURDATE(), 12, 1),
  (300, CURDATE(), 13, 1),
  (70.0, CURDATE(), 1, 2),
  (80.0, CURDATE(), 2, 2),
  (85.0, CURDATE(), 3, 2),
  (15.0, CURDATE(), 4, 2),
  (80.0, CURDATE(), 5, 2),
  (90.0, CURDATE(), 6, 2),
  (10.0, CURDATE(), 7, 2),
  (80.0, CURDATE(), 8, 2),
  (600, CURDATE(), 9, 2), 
  (600, CURDATE(), 10, 2),
  (300, CURDATE(), 11, 2),
  (300, CURDATE(), 12, 2),
  (300, CURDATE(), 13, 2);

CREATE VIEW parametrizacao AS 
SELECT p.*, atm.hostname, atm.macAdress, componentes.tipo,  componentes.unidadeMedida, componentes.funcao
FROM parametro AS p 
JOIN atm ON p.fkAtm = atm.idAtm 
JOIN componentes ON componentes.idComponentes = p.fkComponente;

CREATE USER "rootPI"@"%" IDENTIFIED BY "Urubu#100";
GRANT ALL ON streamline.* TO "rootPI"@"%";
FLUSH PRIVILEGES;

USE streamline;
DESC parametro;
SELECT * FROM streamline_quente.parametrizacao;

INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES
("notebook-caio", "caio", "192.168.1.164","4C-44-5B-EF-59-39", "Windows 11", 1, 1);

INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES
(89, "2025-12-11", 1, 6);

UPDATE parametro SET limite = 99 WHERE idParametro = 30;

update atm set macAdress = "4c:44:5b:ef:59:39", hostname = "notebook-caio" WHERE idAtm = 6;

SELECT * FROM streamline.empresa WHERE nome LIKE "%ban%";

SELECT * FROM parametrizacao;

USE streamline;

SELECT * FROM alerta;

SELECT COUNT(*) AS qtd FROM alerta AS a
            JOIN parametro AS p ON a.fkParametro = p.idParametro
            JOIN atm ON atm.idAtm = p.fkAtm
            WHERE dtHoraAbertura > DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
            AND dtHoraAbertura < CURDATE()
            AND fkAgencia = 1;
            
SELECT * from atm;

SELECT COUNT(*) FROM streamline.alerta;
-- TRUNCATE TABLE streamline.alerta;

SELECT * FROM captura;

SELECT
                            situacao,
                            COUNT(*) AS total_atms,
                            dia
                        FROM (
                            SELECT
                                atm.idAtm, DATE(a.dtHoraAbertura) as dia,
                                CASE
                                    WHEN MAX(a.categoria = 'High') THEN 'Crítico'
                                    WHEN MAX(a.categoria = 'Medium') THEN 'Médio'
                                END AS situacao
                            FROM atm
                            JOIN parametrizacao p ON p.fkAtm = atm.idAtm
                            JOIN alerta a ON a.fkParametro = p.idParametro
                            WHERE atm.fkAgencia = 1 and DATE(a.dtHoraAbertura) BETWEEN CURDATE() - INTERVAL 6 DAY AND CURDATE()
                            GROUP BY atm.idAtm, dia
                        ) AS classificacao
                        GROUP BY situacao, dia
                        ORDER BY dia;