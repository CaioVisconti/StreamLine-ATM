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
  FOREIGN KEY (fkEmpresa) REFERENCES empresa (idEmpresa),
  FOREIGN KEY (fkEndereco) REFERENCES endereco (idEndereco)
);

CREATE TABLE IF NOT EXISTS usuario (
  idUsuario INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nome VARCHAR(45) NOT NULL,
  telefone CHAR(11) NOT NULL,
  cargo VARCHAR(45) NOT NULL,
  email VARCHAR(45) UNIQUE NOT NULL,
  senha VARCHAR(45) NOT NULL,
  fkAgencia INT NOT NULL,
  FOREIGN KEY (fkAgencia) REFERENCES agencia (idAgencia)
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
  FOREIGN KEY (fkAgencia) REFERENCES agencia (idAgencia)
);

CREATE TABLE IF NOT EXISTS componentes (
  idComponentes INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  tipo VARCHAR(45) NULL,
  descricao VARCHAR(45) NULL,
  fkAtm INT NOT NULL,
  FOREIGN KEY (fkAtm) REFERENCES atm (idAtm)
);

CREATE TABLE IF NOT EXISTS medida (
  idMedida INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  tipo VARCHAR(45) NOT NULL,
  formato VARCHAR(45) NOT NULL,
  funcaoPsutil VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS configuracao (
  idConfiguracao INT AUTO_INCREMENT NOT NULL,
  limite DOUBLE NOT NULL,
  dtAlteracao DATE NOT NULL,
  fkMedida INT, 
  fkComponente INT,
	CONSTRAINT pkComposta PRIMARY KEY (idConfiguracao, fkMedida, fkComponente),
  CONSTRAINT chkMedida FOREIGN KEY (fkMedida)REFERENCES medida(idMedida),
	CONSTRAINT chkComponente FOREIGN KEY (fkComponente)REFERENCES componentes(idComponentes)
);

CREATE TABLE IF NOT EXISTS alerta (
  idAlerta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  gravidade VARCHAR(45) NOT NULL,
  medida DOUBLE NOT NULL,
  fkConfiguracao INT,
	CONSTRAINT chkConfiguracao FOREIGN KEY (fkConfiguracao)REFERENCES configuracao(idConfiguracao)
);

CREATE TABLE IF NOT EXISTS captura (
  idCaptura INT PRIMARY KEY AUTO_INCREMENT,
  valor DOUBLE,
  dtHora DATETIME,
  fkConfiguracao INT,
  FOREIGN KEY (fkConfiguracao) REFERENCES configuracao(idConfiguracao)
);

-- Inserindo empresas manualmente
INSERT INTO empresa (nome, cnpj, codigo) VALUES
('Banco do Brasil', '00000000000191', 'BB123456'),
('Caixa Econômica Federal', '00000000000272', 'CEF12345'),
('Bradesco', '00000000000353', 'BRA12345');

-- Inserindo endereços para as agências
INSERT INTO endereco (cep, logradouro, bairro, cidade, uf) VALUES
('01001000', 'Av. Paulista, 1000', 'Bela Vista', 'São Paulo', 'SP'),
('20040002', 'Rua da Assembleia, 50', 'Centro', 'Rio de Janeiro', 'RJ'),
('30120040', 'Av. Afonso Pena, 2000', 'Centro', 'Belo Horizonte', 'MG');

-- Inserindo 3 agências para cada banco
INSERT INTO agencia (codigoAgencia, email, telefone, fkEmpresa, fkEndereco) VALUES
('BB001', 'agencia1@bb.com.br', '(11) 4002-8922', 1, 1),
('BB002', 'agencia2@bb.com.br', '(11) 4002-8923', 1, 2),
('BB003', 'agencia3@bb.com.br', '(11) 4002-8924', 1, 3),
('CEF001', 'agencia1@cef.com.br', '(21) 4003-8922', 2, 1),
('CEF002', 'agencia2@cef.com.br', '(21) 4003-8923', 2, 2),
('CEF003', 'agencia3@cef.com.br', '(21) 4003-8924', 2, 3),
('BRA001', 'agencia1@bradesco.com.br', '(31) 4004-8922', 3, 1),
('BRA002', 'agencia2@bradesco.com.br', '(31) 4004-8923', 3, 2),
('BRA003', 'agencia3@bradesco.com.br', '(31) 4004-8924', 3, 3);

-- Inserindo funcionários só para a primeira agência do Banco do Brasil
INSERT INTO usuario (nome, telefone, cargo, email, senha, fkAgencia) VALUES
('Geraldo', '11987654321', 'Gerente', 'geraldo@bb.com.br', 'senha123', 1),
('Lucas', '11987654322', 'Técnico de Operação', 'lucas@bb.com.br', 'senha123', 1),
('Thiago', '11987654323', 'Analista de Dados', 'thiago@bb.com.br', 'senha123', 1);

-- Inserindo 15 ATMs para a primeira agência do Banco do Brasil
INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES
('Jade', 'Gabriel Teste', '192.168.1.1', '20:c1:9b:5e:4e:d0', 'Windows 11', 1, 1), -- Esse é o meu pessoal, testem com o de vocês
('ATM002', 'NCR', '192.168.1.2', '00:1A:2B:3C:4D:5F', 'Windows 10', 1, 1),
('ATM003', 'Diebold', '192.168.1.3', '00:1A:2B:3C:4D:60', 'Windows 10', 1, 1),
('ATM004', 'NCR', '192.168.1.4', '00:1A:2B:3C:4D:61', 'Windows 10', 1, 1),
('ATM005', 'Diebold', '192.168.1.5', '00:1A:2B:3C:4D:62', 'Windows 10', 1, 1),
('ATM006', 'NCR', '192.168.1.6', '00:1A:2B:3C:4D:63', 'Windows 10', 1, 1),
('ATM007', 'Diebold', '192.168.1.7', '00:1A:2B:3C:4D:64', 'Windows 10', 1, 1),
('ATM008', 'NCR', '192.168.1.8', '00:1A:2B:3C:4D:65', 'Windows 10', 1, 1),
('ATM009', 'Diebold', '192.168.1.9', '00:1A:2B:3C:4D:66', 'Windows 10', 1, 1),
('ATM010', 'NCR', '192.168.1.10', '00:1A:2B:3C:4D:67', 'Windows 10', 1, 1),
('ATM011', 'Diebold', '192.168.1.11', '00:1A:2B:3C:4D:68', 'Windows 10', 1, 1),
('ATM012', 'NCR', '192.168.1.12', '00:1A:2B:3C:4D:69', 'Windows 10', 1, 1),
('ATM013', 'Diebold', '192.168.1.13', '00:1A:2B:3C:4D:70', 'Windows 10', 1, 1),
('ATM014', 'NCR', '192.168.1.14', '00:1A:2B:3C:4D:71', 'Windows 10', 1, 1),
('ATM015', 'Diebold', '192.168.1.15', '00:1A:2B:3C:4D:72', 'Windows 10', 1, 1);


-- MÉTRICAS E CONFIGURAÇÕES

-- Inserindo Componentes para o ATM 1
INSERT INTO componentes (tipo, descricao, fkAtm) VALUES
('CPU', 'Intel Core i5', 1),
('RAM', '8GB', 1),
('DISCO', '500GB', 1),
('REDE', 'RECEBA', 1);

-- Inserindo Medidas para os componentes do ATM 1 (Cardápio)
INSERT INTO medida (tipo, formato, funcaoPsutil) VALUES
('CPUPercent', 'Porcentagem', 'cpu_percent'),
('CPUFreq', 'GHz', 'cpu_freq'),
('RAMTotal', 'GB', 'virtual_memory.total'),
('RAMDisponivel', 'GB', 'virtual_memory.available'),
('RAMPercentual', 'Porcentagem', 'virtual_memory.percent'),
('DISKTotal', 'GB', 'disk_usage.total'),
('DISKDisponivel', 'GB', 'disk_usage.free'),
('DISKPercentual', 'Porcentagem', 'disk_usage.percent'),
('REDERecebida', 'Bytes', 'net_io_counters.bytes_recv'),
('REDEEnviada', 'Bytes', 'net_io_counters.bytes_sent'),
('PROCESSODesativado', 'Unidades', 'process_iter.desativados'),
('PROCESSOAtivos', 'Unidades', 'process_iter.ativos'),
('PROCESSOTotal', 'Unidades', 'process_iter.total');

-- Inserindo Configurações para os componentes do ATM 1
INSERT INTO configuracao (fkMedida, fkComponente, limite, dtAlteracao) VALUES
(1, 1, 80.0, '2025-03-31'), -- CPUPercent (Intel Core i5)
(2, 1, 3.5, '2025-03-31'), -- CPUFreq (Intel Core i5)
(3, 2, 90.0, '2025-03-31'), -- RAMPercentual (8GB RAM)
(8, 3, 85.0, '2025-03-31'), -- DISKPercentual (500GB Disco)
(9, 4, 85.0, '2025-04-06'); -- REDERecebida 

-- Selecionar componentes e configurações de tal atm

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