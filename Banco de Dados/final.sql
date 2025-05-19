create database streamline;

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

CREATE TABLE IF NOT EXISTS captura (
  idCaptura INT PRIMARY KEY AUTO_INCREMENT,
  valor DOUBLE,
  dtHora DATETIME,
  fkParametro INT,
  CONSTRAINT fk_parametro_captura FOREIGN KEY (fkParametro)
REFERENCES parametro(idParametro) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerta (
  idAlerta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  jiraIssueKey VARCHAR(25),
  componente VARCHAR(20),
  valor DOUBLE NOT NULL,
  categoria VARCHAR(20),
  dtHoraAbertura DATETIME,
  ultimaAtualizacao DATETIME,
  dtResolucao DATETIME,
  statusChamado VARCHAR(30),
  link VARCHAR(200),
  fkParametro INT
);

-- Inserindo empresas
INSERT INTO empresa (nome, cnpj, codigo) VALUES
('Banco do Brasil', '123456789', 'BB123456'),
('Caixa Federal', '987654321', 'CEF12345'),
('Bradesco', '12435687', 'BRA12345');

-- Inserindo enderecos
INSERT INTO endereco (cep, logradouro, bairro, cidade, uf) VALUES
('01001000', 'Av. Paulista, 1000', 'Bela Vista', 'Sao Paulo', 'SP'),
('20040002', 'Rua da Assembleia, 50', 'Centro', 'Rio de Janeiro', 'RJ'),
('30120040', 'Av. Afonso Pena, 2000', 'Centro', 'Belo Horizonte', 'MG');

-- Inserindo agencias
INSERT INTO agencia (codigoAgencia, email, telefone, fkEmpresa, fkEndereco) VALUES
  ('ABC', 'agenciapaulista@bb.com.br', '6134210001', 1, 1),
  ('CBD', 'agenciaassembleia@bb.com.br', '1134210002', 1, 2),
  ('EFG', 'agenciaafonso@bb.com.br', '2134210003', 1, 3);

-- Inserindo usuários
INSERT INTO usuario (nome, telefone, cargo, email, senha, fkAgencia) VALUES
  ('Marcelo', '11987654321', 'Gerente', 'marcelo@bb.com.br', 'senha123', 1),
  ('Lucas', '11987654322', 'Tecnico de Operacao', 'lucas@bb.com.br', 'senha123', 1),
  ('Thiago', '11987654323', 'Analista de Dados', 'thiago@bb.com.br', 'senha123', 1),
  ('Caio', '11984364323', 'CEO', 'caio@streamline.com.br', 'Urubu#123', NULL),
  ('Gabriel', '11987652353', 'CEO', 'gabriel@streamline.com.br', 'Urubu#123', NULL),
  ('Guilherme', '11986543323', 'CEO', 'guilherme@streamline.com.br', 'Urubu#123', NULL),
  ('Nicoly', '11987975823', 'CEO', 'nicoly@streamline.com.br', 'Urubu#123', NULL);

-- Inserindo componentes
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
  ('PROCESSOS', 'ATIVOS', 'PROCESSOSAtivos', 'Unidades', 'process_iter.ativos');

-- Inserindo ATMs
INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM001', 'BB - 7000 - Nicoly', '192.168.1.1', 'd8:cb:8a:d5:fd:77', 'Ubuntu 21.9', 1, 1),
('ATM002', 'BB - 7000 - Guilherme', '192.168.1.2', '78:46:5c:64:6e:a9', 'Windows 11', 1, 1),
('ATM003', 'BB - 7000 - Gabriel', '192.168.1.3', '20:c1:9b:5e:4e:d0', 'Windows 11', 1, 1),
('ATM004', 'BB - 7000 - Caio', '192.168.1.164','4c:44:5b:ef:59:39', 'Windows 11', 1, 1);

-- Inserindo parametros para os ATMs
INSERT INTO parametro (limite, dtAlteracao, fkComponente, fkAtm) VALUES 
  (70.0, CURDATE(), 1, 1),
  (1500, CURDATE(), 2, 1),
  (85.0, CURDATE(), 3, 1),
  (15.0, CURDATE(), 4, 1),
  (80.0, CURDATE(), 5, 1),
  (90.0, CURDATE(), 6, 1),
  (0.20, CURDATE(), 7, 1),
  (0.20, CURDATE(), 8, 1),
  (70.0, CURDATE(), 1, 2),
  (1500, CURDATE(), 2, 2),
  (85.0, CURDATE(), 3, 2),
  (15.0, CURDATE(), 4, 2),
  (80.0, CURDATE(), 5, 2),
  (90.0, CURDATE(), 6, 2),
  (0.20, CURDATE(), 7, 2),
  (0.20, CURDATE(), 8, 2),
  (70.0, CURDATE(), 1, 3),
  (1500, CURDATE(), 2, 3),
  (85.0, CURDATE(), 3, 3),
  (15.0, CURDATE(), 4, 3),
  (80.0, CURDATE(), 5, 3),
  (90.0, CURDATE(), 6, 3),
  (0.20, CURDATE(), 7, 3),
  (0.20, CURDATE(), 8, 3),
  (70.0, CURDATE(), 1, 4),
  (1500, CURDATE(), 2, 4),
  (85.0, CURDATE(), 3, 4),
  (15.0, CURDATE(), 4, 4),
  (80.0, CURDATE(), 5, 4),
  (90.0, CURDATE(), 6, 4),
  (0.20, CURDATE(), 7, 4),
  (0.20, CURDATE(), 8, 4);

-- Criação dos usuários e permissões
CREATE USER IF NOT EXISTS "rootPI"@"localhost" IDENTIFIED BY "Urubu#100";
GRANT ALL ON streamline.* TO "rootPI"@"localhost";
FLUSH PRIVILEGES;

-- Criação da View Parametrização
CREATE VIEW parametrizacao AS 
SELECT p.*, atm.hostname, atm.macAdress, componentes.tipo,  componentes.unidadeMedida, componentes.funcao
FROM parametro AS p 
JOIN atm ON p.fkAtm = atm.idAtm 
JOIN componentes ON componentes.idComponentes = p.fkComponente;


-- Criação das Views Lista de Atm com XPTO alerta
CREATE OR REPLACE VIEW viewCriticoLista AS
WITH severidade_alertas AS (
    SELECT 
        p.fkAtm,
        CASE 
            WHEN alerta.valor > p.limite THEN 'critico'
            WHEN alerta.valor BETWEEN p.limite - 10 AND p.limite THEN 'medio'
            ELSE 'baixo'
        END AS nivel
    FROM alerta
    JOIN parametro p ON alerta.fkParametro = p.idParametro
    WHERE TIMESTAMPDIFF(SECOND, alerta.dtHoraAbertura, NOW()) BETWEEN 0 AND 5
)
SELECT 
    fkAtm AS fkAtmCritico
FROM (
    SELECT fkAtm, MAX(
        CASE nivel
            WHEN 'critico' THEN 3
            WHEN 'medio' THEN 2
            ELSE 1
        END
    ) AS severidade
    FROM severidade_alertas
    GROUP BY fkAtm
) AS resultado
WHERE severidade = 3;

-- View para ATMs em situação média
CREATE OR REPLACE VIEW viewMediaLista AS
WITH severidade_alertas AS (
    SELECT 
        p.fkAtm,
        CASE 
            WHEN alerta.valor > p.limite THEN 'critico'
            WHEN alerta.valor BETWEEN p.limite - 10 AND p.limite THEN 'medio'
            ELSE 'baixo'
        END AS nivel
    FROM alerta
    JOIN parametro p ON alerta.fkParametro = p.idParametro
    WHERE TIMESTAMPDIFF(SECOND, alerta.dtHoraAbertura, NOW()) BETWEEN 0 AND 5
)
SELECT
    fkAtm AS fkAtmMedio
FROM (
    SELECT fkAtm, MAX(
        CASE nivel
            WHEN 'critico' THEN 3
            WHEN 'medio' THEN 2
            ELSE 1
        END
    ) AS severidade
    FROM severidade_alertas
    GROUP BY fkAtm
) AS resultado
WHERE severidade = 2;

-- Criação das Views que retornam quantos atm estão com XPTO alerta

-- View com o total de atms
CREATE OR REPLACE VIEW totalAtms AS
SELECT 
    COUNT(atm.idAtm) AS totalAtms
FROM atm;

SELECT * FROM totalAtms;

-- View para ATMs em situação média
CREATE OR REPLACE VIEW viewMedia AS
WITH severidade_alertas AS (
    SELECT 
        p.fkAtm,
        CASE 
            WHEN alerta.valor > p.limite THEN 'critico'
            WHEN alerta.valor BETWEEN p.limite - 10 AND p.limite THEN 'medio'
            ELSE 'baixo'
        END AS nivel
    FROM alerta
    JOIN parametro p ON alerta.fkParametro = p.idParametro
    WHERE TIMESTAMPDIFF(SECOND, alerta.dtHoraAbertura, NOW()) BETWEEN 0 AND 5
)
SELECT COUNT(*) AS atmsMedios
FROM (
    SELECT fkAtm, MAX(
        CASE nivel
            WHEN 'critico' THEN 3
            WHEN 'medio' THEN 2
            ELSE 1
        END
    ) AS severidade
    FROM severidade_alertas
    GROUP BY fkAtm
) AS resultado
WHERE severidade = 2;


-- View para ATMs em situação crítico
CREATE OR REPLACE VIEW viewCritico AS
WITH severidade_alertas AS (
    SELECT 
        p.fkAtm,
        CASE 
            WHEN alerta.valor > p.limite THEN 'critico'
            WHEN alerta.valor BETWEEN p.limite - 10 AND p.limite THEN 'medio'
            ELSE 'baixo'
        END AS nivel
    FROM alerta
    JOIN parametro p ON alerta.fkParametro = p.idParametro
    WHERE TIMESTAMPDIFF(SECOND, alerta.dtHoraAbertura, NOW()) BETWEEN 0 AND 5
)
SELECT COUNT(*) AS atmsCritico
FROM (
    SELECT fkAtm, MAX(
        CASE nivel
            WHEN 'critico' THEN 3
            WHEN 'medio' THEN 2
            ELSE 1
        END
    ) AS severidade
    FROM severidade_alertas
    GROUP BY fkAtm
) AS resultado
WHERE severidade = 3;

-- View para ATMs em situação boa
CREATE OR REPLACE VIEW viewBom AS
SELECT 
    (select * from totalAtms) - ((SELECT * FROM viewCritico) + (SELECT * FROM viewMedia)) AS atmsSemAlertas
FROM atm
LIMIT 1;
