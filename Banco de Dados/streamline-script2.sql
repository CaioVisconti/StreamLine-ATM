USE streamline;

CREATE TABLE IF NOT EXISTS empresa (
  idEmpresa INT NOT NULL,
  nome VARCHAR(45) NOT NULL,
  cnpj VARCHAR(45) NOT NULL,
  codigo CHAR(8) NOT NULL,
  PRIMARY KEY (idEmpresa)
);

CREATE TABLE IF NOT EXISTS logradouro (
  idLogradouro INT NOT NULL,
  cep CHAR(8) NOT NULL,
  logradouro VARCHAR(100) NOT NULL,
  bairro VARCHAR(45) NOT NULL,
  cidade VARCHAR(45) NOT NULL,
  uf CHAR(2) NOT NULL,
  PRIMARY KEY (idLogradouro)
);

CREATE TABLE IF NOT EXISTS agencia (
  idAgencia INT NOT NULL,
  unidade VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  telefone VARCHAR(45) NOT NULL,
  fkEmpresa INT NOT NULL,
  fkLogradouro INT NOT NULL,
  PRIMARY KEY (idAgencia),
  FOREIGN KEY (fkEmpresa) REFERENCES empresa (idEmpresa),
  FOREIGN KEY (fkLogradouro) REFERENCES logradouro (idLogradouro)
);

CREATE TABLE IF NOT EXISTS usuario (
  idUsuario INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  telefone CHAR(11) NOT NULL,
  cargo VARCHAR(45) NOT NULL,
  email VARCHAR(45) UNIQUE NOT NULL,
  senha VARCHAR(45) NOT NULL,
  fkAgencia INT NOT NULL,
  PRIMARY KEY (idUsuario),
  FOREIGN KEY (fkAgencia) REFERENCES agencia (idAgencia)
);

CREATE TABLE IF NOT EXISTS atm (
  idAtm INT NOT NULL,
  nome VARCHAR(45) NOT NULL,
  modelo VARCHAR(45) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  sistemaOperacional VARCHAR(45) NOT NULL,
  status TINYINT NOT NULL,
  fkAgencia INT NOT NULL,
  PRIMARY KEY (idAtm),
  FOREIGN KEY (fkAgencia) REFERENCES agencia (idAgencia)
);

CREATE TABLE IF NOT EXISTS componentes (
  idComponentes INT NOT NULL,
  componente VARCHAR(45) NULL,
  tipo VARCHAR(45) NOT NULL,
  limite DOUBLE NOT NULL,
  fkAtm INT NOT NULL,
  PRIMARY KEY (idComponentes),
  FOREIGN KEY (fkAtm) REFERENCES atm (idAtm)
);

CREATE TABLE IF NOT EXISTS captura1_1 (
  idCaptura INT NOT NULL,
  CPUPercent DOUBLE NOT NULL,
  CPUFreq DOUBLE NOT NULL,
  RAMTotal DOUBLE NOT NULL,
  RAMDisponivel DOUBLE NULL,
  RAMPercentual DOUBLE NULL,
  DISKTotal DOUBLE NULL,
  DISKDisponivel DOUBLE NULL,
  DISKPercentual DOUBLE NULL,
  dtHora DATETIME NULL,
  PRIMARY KEY (idCaptura)
);

CREATE TABLE IF NOT EXISTS captura1_2 (
  idCaptura INT NOT NULL,
  CPUPercent DOUBLE NOT NULL,
  CPUFreq DOUBLE NOT NULL,
  RAMTotal DOUBLE NOT NULL,
  RAMDisponivel DOUBLE NULL,
  RAMPercentual DOUBLE NULL,
  DISKTotal DOUBLE NULL,
  DISKDisponivel DOUBLE NULL,
  DISKPercentual DOUBLE NULL,
  dtHora DATETIME NULL,
  PRIMARY KEY (idCaptura)
);

INSERT INTO captura1_2 VALUES
(3, 1.1, 1.0, 1.1, 1.0, 1.1, 1.0, 1.1, 1.0, "2025-03-01 08:09:11");
SELECT * FROM captura1_2;

CREATE TABLE IF NOT EXISTS alerta1_1 (
  idAlerta INT NOT NULL AUTO_INCREMENT,
  tipo VARCHAR(45) NULL,
  gravidade VARCHAR(45) NOT NULL,
  medida DOUBLE NULL,
  dtHora DATETIME NULL,
  fkCaptura INT NOT NULL,
  PRIMARY KEY (idAlerta),FOREIGN KEY (fkCaptura) REFERENCES captura1_1 (idCaptura)
);

USE streamline;

CREATE VIEW teste AS SELECT captura1_1.CPUPercent AS CPUPercent1, captura1_2.CPUPercent AS CPUPercent2 FROM captura1_1, captura1_2;
SELECT * FROM teste;

SELECT dtHora FROM captura1_1;

SELECT * FROM captura1_1 WHERE dtHora > "2025-03-31 11:41:30";

SELECT
	CASE 
		WHEN dtHora >= "2025-03-31 11:41:19" AND dtHora <= "2025-03-31 11:41:32" THEN "teste"
		WHEN dtHora >= "2025-03-31 11:41:33" AND dtHora <= "2025-03-31 11:41:39" THEN "teste1"
	END AS datas
FROM captura1_1;

SELECT dtHora FROM captura1_1;

-- comparacao em diferentes periodos
CREATE VIEW teste2 AS SELECT captura1_1.CPUPercent AS CPUPercent1, captura1_2.CPUPercent AS CPUPercent2 FROM captura1_1, captura1_2;