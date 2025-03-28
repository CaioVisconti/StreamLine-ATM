USE steamlineatm ;

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

CREATE TABLE IF NOT EXISTS capturaM_N (
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

CREATE TABLE IF NOT EXISTS alertaM_N (
  idAlerta INT NOT NULL AUTO_INCREMENT,
  tipo VARCHAR(45) NULL,
  gravidade VARCHAR(45) NOT NULL,
  medida DOUBLE NULL,
  dtHora DATETIME NULL,
  fkCaptura INT NOT NULL,
  PRIMARY KEY (idAlerta),
  CONSTRAINT fk_alertaM_N_capturaM_N1
  FOREIGN KEY (fkCaptura) REFERENCES capturaM_N (idCaptura)
);
