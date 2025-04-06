create DATABASE streamline;
USE streamline;

CREATE TABLE IF NOT EXISTS empresa (
  idEmpresa INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nome VARCHAR(45) NOT NULL,
  cnpj VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  codigo CHAR(8) NOT NULL,
  senha VARCHAR(45)
);

CREATE TABLE IF NOT EXISTS logradouro (
  idLogradouro INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  cep CHAR(8) NOT NULL,
  logradouro VARCHAR(100) NOT NULL,
  bairro VARCHAR(45) NOT NULL,
  cidade VARCHAR(45) NOT NULL,
  numero CHAR(8) NOT NULL,
  uf CHAR(2) NOT NULL
);

CREATE TABLE IF NOT EXISTS agencia (
  idAgencia INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  codigoAgencia VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  telefone VARCHAR(45) NOT NULL,
  fkEmpresa INT NOT NULL,
  fkLogradouro INT NOT NULL,
  FOREIGN KEY (fkEmpresa) REFERENCES empresa (idEmpresa),
  FOREIGN KEY (fkLogradouro) REFERENCES logradouro (idLogradouro)
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
  nome VARCHAR(45) NOT NULL,
  modelo VARCHAR(45) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  sistemaOperacional VARCHAR(45) NOT NULL,
  statusATM TINYINT NOT NULL,
  fkAgencia INT NOT NULL,
  FOREIGN KEY (fkAgencia) REFERENCES agencia (idAgencia)
);

CREATE TABLE IF NOT EXISTS componentes (
  idComponentes INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  componente VARCHAR(45) NULL,
  tipo VARCHAR(45) NOT NULL,
  limite DOUBLE NOT NULL,
  fkAtm INT NOT NULL,
  FOREIGN KEY (fkAtm) REFERENCES atm (idAtm)
);

CREATE TABLE IF NOT EXISTS captura1_1 (
  idCaptura INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  CPUPercent DOUBLE NOT NULL,
  CPUFreq DOUBLE NOT NULL,
  RAMTotal DOUBLE NOT NULL,
  RAMDisponivel DOUBLE NULL,
  RAMPercentual DOUBLE NULL,
  DISKTotal DOUBLE NULL,
  DISKDisponivel DOUBLE NULL,
  DISKPercentual DOUBLE NULL,
  REDERecebida INT NULL, 
  REDEEnviada INT NULL, 
  PROCESSODesativado INT NULL, 
  PROCESSOAtivos INT NULL, 
  PROCESSOTotal INT NULL,
  dtHora DATETIME NULL
);

CREATE TABLE IF NOT EXISTS captura1_2 (
  idCaptura INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  CPUPercent DOUBLE NOT NULL,
  CPUFreq DOUBLE NOT NULL,
  RAMTotal DOUBLE NOT NULL,
  RAMDisponivel DOUBLE NULL,
  RAMPercentual DOUBLE NULL,
  DISKTotal DOUBLE NULL,
  DISKDisponivel DOUBLE NULL,
  DISKPercentual DOUBLE NULL,
  REDERecebida INT NULL, 
  REDEEnviada INT NULL, 
  PROCESSODesativado INT NULL, 
  PROCESSOAtivos INT NULL, 
  PROCESSOTotal INT NULL,
  dtHora DATETIME NULL
);

CREATE TABLE IF NOT EXISTS alertaM_N (
  idAlerta INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  tipo VARCHAR(45) NULL,
  gravidade VARCHAR(45) NOT NULL,
  medida DOUBLE NULL,
  dtHora DATETIME NULL,
  fkCaptura INT NOT NULL,
  CONSTRAINT fk_alertaM_N_capturaM_N1
  FOREIGN KEY (fkCaptura) REFERENCES captura1_1 (idCaptura)
);

-- Cálculo de médias: calcular a média de uso de CPU, RAM, e Disco ao longo de todas as capturas.
create view medias as
select avg(CPUPercent), 
avg(RAMPercentual), 
avg(DISKPercentual)
from captura1_1;

select * from medias;

-- Soma total de recursos utilizados: somar o uso total de CPU, RAM e Disco para entender a utilização global do sistema ao longo do 
-- período de captura
create view somas as
select sum(CPUPercent), 
sum(RAMPercentual), 
sum(DISKPercentual)
from captura1_1;

select * from somas;

-- Comparação de desempenho entre CPUs de maquinas
create view comparacaoMaquinas as 
select 
captura1_1.CPUPercent as CPUPercent1, 
captura1_2.CPUPercent as CPUPercent2 
from captura1_1, captura1_2;

select * from comparacaoMaquinas;

-- Análise de picos: identificar os picos de uso de CPU, RAM e Disco, ou seja, quando esses recursos atingem os maiores valores em cada máquina.
create view picos as
select max(CPUPercent), max(RAMPercentual), max(DISKPercentual)
from captura1_1;

select * from picos;

-- Comparação de uso entre diferentes períodos: comparar o uso de recursos em diferentes períodos do dia, por exemplo, 
-- comparando o uso de CPU pela manhã e à tarde, se os dados tiverem timestamp adequado.
create view periodosDia as
select CPUPercent as "Percentual da CPU", dtHora as "Horário",
	case
        when hour(dtHora) >= 6 and hour(dtHora) < 12 then 'Manhã'
        when hour(dtHora) >= 12 and hour(dtHora) < 18 then 'Tarde'
        when hour(dtHora) >= 18 and hour(dtHora) < 24 then 'Noite'
        when hour(dtHora) >= 0 and hour(dtHora) < 6 then 'Madrugada'
	end as "Periodo"
from captura1_1
group by idCaptura
order by CPUPercent desc
limit 1;

select * from periodosDia;