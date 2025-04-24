CREATE DATABASE streamline_quente;
use streamline_quente;

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

CREATE USER IF NOT EXISTS "rootPI"@"%" IDENTIFIED BY "Urubu#100";
GRANT ALL ON streamline_quente.* TO "rootPI"@"%";
FLUSH PRIVILEGES;


CREATE USER IF NOT EXISTS "userPython"@"%" IDENTIFIED BY "Urubu100";
GRANT SELECT ON streamline_quente.parametrizacao TO "userPython"@"%";
GRANT INSERT ON streamline_quente.captura TO "userPython"@"%";
GRANT INSERT ON streamline_quente.alerta TO "userPython"@"%";
FLUSH PRIVILEGES;

SELECT * FROM streamline_quente.alerta;

INSERT INTO streamline_quente.alerta (valor, dtHora, fkParametro) VALUES
(12, "2025-12-11 08:09:11", 1);