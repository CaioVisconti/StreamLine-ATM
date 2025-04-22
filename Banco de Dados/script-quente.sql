CREATE DATABASE streamline_quente;

CREATE VIEW streamline_quente.parametrizacao AS (SELECT * FROM streamline.parametrizacao);

CREATE TABLE IF NOT EXISTS alerta (
  idAlerta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  valor DOUBLE NOT NULL,
  dtHora DATETIME,
  fkParametro INT
);

CREATE TABLE IF NOT EXISTS captura (
  idCaptura INT PRIMARY KEY AUTO_INCREMENT,
  valor DOUBLE,
  dtHora DATETIME,
  fkParametro INT
);

CREATE USER IF NOT EXISTS "userPython"@"%" IDENTIFIED BY "Urubu100";
GRANT SELECT ON streamline_quente.parametrizacao, INSERT ON streamline_quente.captura, INSERT ON streamline_quente.alerta TO "userPython"@"%";
FLUSH PRIVILEGES;