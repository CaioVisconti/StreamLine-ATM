use streamline;

show tables;

select * from agencia;

select idAtm as "ID" from atm
join agencia on agencia.idAgencia = atm.fkAgencia
where fkAgencia = 1;

select * from viewcritico, viewmedio, viewbom;

CREATE VIEW aaa AS
SELECT 
    COUNT(atm.idAtm) AS atmsMedios
FROM alerta
JOIN parametro ON alerta.fkParametro = parametro.idParametro
JOIN atm ON parametro.fkAtm = atm.idAtm
WHERE alerta.valor = parametro.limite and
timestampdiff(minute, dtHora, now());

select * from aaa;

drop view aaa;

desc alerta;

insert into alerta(valor, dtHora, fkParametro) values
(80, now(), 1);

select * from parametro;
select * from alerta;

SELECT 
    COUNT(atm.idAtm) AS atmsMedios
FROM alerta
JOIN parametro ON alerta.fkParametro = parametro.idParametro
JOIN atm ON parametro.fkAtm = atm.idAtm
WHERE alerta.valor = parametro.limite 
  AND TIMESTAMPDIFF(SECOND, alerta.dtHora, NOW()) BETWEEN 0 AND 60;
  
CREATE OR REPLACE VIEW viewCritico AS
SELECT 
    COUNT(atm.idAtm) AS atmsCritico
FROM alerta
JOIN parametro ON alerta.fkParametro = parametro.idParametro
JOIN atm ON parametro.fkAtm = atm.idAtm
WHERE alerta.valor > parametro.limite
AND TIMESTAMPDIFF(SECOND, alerta.dtHora, NOW()) BETWEEN 0 AND 60;

-- View para ATMs com alertas médios 
CREATE OR REPLACE VIEW viewMedio AS
SELECT 
    COUNT(atm.idAtm) AS atmsMedios
FROM alerta
JOIN parametro ON alerta.fkParametro = parametro.idParametro
JOIN atm ON parametro.fkAtm = atm.idAtm
WHERE alerta.valor = parametro.limite
AND TIMESTAMPDIFF(SECOND, alerta.dtHora, NOW()) BETWEEN 0 AND 60;

-- view com o total de atms
CREATE OR REPLACE VIEW totalAtms AS
SELECT 
    COUNT(atm.idAtm) AS atmsSemAlerta
FROM atm;

-- View para ATMs em situação boa
CREATE OR REPLACE VIEW viewBom AS
SELECT 
    (select * from totalAtms) - ((SELECT * FROM viewCritico) + (SELECT * FROM viewMedio)) AS atmsSemAlertas
FROM atm
LIMIT 1;

select * from viewCritico, viewMedio, viewBom;

select * from atm;

insert into alerta(valor, dtHora, fkParametro) values
(80, now(), 1),
(100, now(), 1),
(120, now(), 1);

select * from usuario;
