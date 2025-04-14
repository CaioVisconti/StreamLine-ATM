create DATABASE streamline;
USE streamline;

show tables;

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
	FOREIGN KEY (fkAtm) REFERENCES atm(idAtm),
	FOREIGN KEY (fkComponente) REFERENCES componentes(idComponentes)
);

CREATE TABLE IF NOT EXISTS alerta (
  idAlerta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  valor DOUBLE NOT NULL,
  dtHora DATETIME,
  fkParametro INT,
  FOREIGN KEY (fkParametro) REFERENCES parametro(idParametro)
);

CREATE TABLE IF NOT EXISTS captura (
  idCaptura INT PRIMARY KEY AUTO_INCREMENT,
  valor DOUBLE,
  dtHora DATETIME,
  fkParametro INT,
  FOREIGN KEY (fkParametro) REFERENCES parametro(idParametro)
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
('Jade', 'Gabriel Teste', '192.168.1.1', '20:c1:9b:5e:4e:d0', 'Windows 11', 1, 1),
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
-- Inserindo Medidas para os componentes do ATM 1 (Cardápio)
INSERT INTO componentes (tipo, unidadeMedida, funcao) VALUES
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
INSERT INTO parametro (fkAtm, fkComponente, limite, dtAlteracao) VALUES
(1, 1, 80.0, '2025-03-31'),
(2, 1, 3.5, '2025-03-31'),
(3, 2, 90.0, '2025-03-31'),
(8, 3, 85.0, '2025-03-31'),
(9, 4, 85.0, '2025-04-06');

INSERT INTO alerta (valor, dtHora, fkParametro) VALUES
(85.0, NOW(), 1), -- ATM 1: CPU acima do limite (80.0)
(95.0, NOW(), 3), -- ATM 3: CPUFreq acima do limite (90.0)
(3.5, NOW(), 2),  -- ATM 2: CPU igual ao limite
(85.0, NOW(), 4), -- ATM 8: RAM Total igual ao limite
(85.0, NOW(), 5); -- ATM 9: RAM Disponível igual ao limite

-- views
-- View para ATMs com alertas críticos (valor > 90% do limite)
CREATE OR REPLACE VIEW viewCritico AS
SELECT 
    COUNT(atm.idAtm) AS atmsCritico
FROM alerta
JOIN parametro ON alerta.fkParametro = parametro.idParametro
JOIN atm ON parametro.fkAtm = atm.idAtm
WHERE alerta.valor > parametro.limite;

-- View para ATMs com alertas médios 
CREATE VIEW viewMedio AS
SELECT 
    COUNT(atm.idAtm) AS atmsMedios
FROM alerta
JOIN parametro ON alerta.fkParametro = parametro.idParametro
JOIN atm ON parametro.fkAtm = atm.idAtm
WHERE alerta.valor = parametro.limite;

-- View para ATMs em situação boa
CREATE VIEW viewBom AS
SELECT 
    COUNT(atm.idAtm) AS atmsSemAlerta
FROM atm
LEFT JOIN parametro ON parametro.fkAtm = atm.idAtm
LEFT JOIN alerta ON alerta.fkParametro = parametro.idParametro
AND alerta.valor >= parametro.limite -- filta os alertas p ver quais NAO estao nessa condicao (volta null)
WHERE alerta.idAlerta IS NULL;

select * from viewCritico, viewMedio, viewBom;

-- select pra kpis no dataviz
SELECT 
	viewCritico.atmsCritico,
	viewMedio.atmsMedios,
	viewBom.atmsSemAlerta
FROM viewCritico, viewMedio, viewBom;

create view viewRedesBytes as
select 
    DATE_FORMAT(c.dtHora, '%H:%i') as hora,
    comp.tipo as tipo_rede,
    avg(c.valor) as media_valor
from captura as c
join parametro as p on c.fkparametro = p.idparametro
join componentes as comp on comp.idcomponentes = p.fkcomponente
where comp.tipo in ('REDERecebida', 'REDEEnviada')
group by hora, tipo_rede;

select * from viewRedesBytes;

-- Inserção atm nicoly
insert into atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES
('ni', 'teste', '192.168.1.1', '3c:21:9c:81:57:22', 'Windows 11', 1, 1);
-- Parâmetros de CPU
INSERT INTO parametro (limite, dtAlteracao, identificador, fkComponente, fkAtm)
VALUES
(80, CURDATE(), 'cpu_percent', 1, 16),
(3000, CURDATE(), 'cpu_freq', 2, 16);
-- Parâmetros de RAM
INSERT INTO parametro (limite, dtAlteracao, identificador, fkComponente, fkAtm)
VALUES
(16000000000, CURDATE(), 'virtual_memory.total', 3, 16),
(2000000000, CURDATE(), 'virtual_memory.available', 4, 16),
(85, CURDATE(), 'virtual_memory.percent', 5, 16);
-- Parâmetros de DISCO
INSERT INTO parametro (limite, dtAlteracao, identificador, fkComponente, fkAtm)
VALUES
(500000000000, CURDATE(), 'disk_usage.total', 6, 16),
(100000000000, CURDATE(), 'disk_usage.free', 7, 16),
(90, CURDATE(), 'disk_usage.percent', 8, 16);
-- Parâmetros de REDE
INSERT INTO parametro (limite, dtAlteracao, identificador, fkComponente, fkAtm)
VALUES
(1000000, CURDATE(), 'net_io_counters.bytes_recv', 9, 16),
(500000, CURDATE(), 'net_io_counters.bytes_sent', 10, 16);
-- Parâmetros de PROCESSO
INSERT INTO parametro (limite, dtAlteracao, identificador, fkComponente, fkAtm)
VALUES
(150, CURDATE(), 'process_iter.total', 13, 16),
(100, CURDATE(), 'process_iter.ativos', 12, 16),
(50, CURDATE(), 'process_iter.desativados', 11, 16);
    
select idCaptura, valor, dtHora, idParametro,fkComponente, identificador, tipo, unidadeMedida from captura as c
join parametro as p on c.fkParametro = p.idParametro
join componentes as co on co.idcomponentes = p.fkComponente;

CREATE USER "userStreamline"@"%" IDENTIFIED BY "Urubu@100";
GRANT ALL PRIVILEGES ON streamline.* TO "userStreamline"@"%";
FLUSH PRIVILEGES;
