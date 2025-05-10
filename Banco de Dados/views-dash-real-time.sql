USE streamline;

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
    WHERE TIMESTAMPDIFF(SECOND, alerta.dtHoraAbertura, NOW()) BETWEEN 0 AND 10
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
    WHERE TIMESTAMPDIFF(SECOND, alerta.dtHoraAbertura, NOW()) BETWEEN 0 AND 10
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


SELECT * FROM viewCritico, viewMedia, viewBom;


INSERT INTO atm (hostname, modelo, ip, macAdress, sistemaOperacional, statusATM, fkAgencia) VALUES 
('ATM001', 'BB 7000', '192.168.1.7', '00:1B:44:11:3A:10', 'Ubuntu 21.9', 1, 1),
('ATM002', 'BB 7000', '192.168.1.7', '00:1B:44:11:3A:10', 'Ubuntu 21.9', 1, 1),
('ATM003', 'BB 7000', '192.168.1.7', '00:1B:44:11:3A:10', 'Ubuntu 21.9', 1, 1),
('ATM004', 'BB 7000', '192.168.1.7', '00:1B:44:11:3A:10', 'Ubuntu 21.9', 1, 1),
('ATM005', 'BB 7000', '192.168.1.1', '3c:21:9c:81:57:22', 'Windows 11', 1, 1),
('ATM006', 'BB 7000', '192.168.1.7', '00:1B:44:11:3A:10', 'Ubuntu 21.9', 1, 1),
('ATM007', 'BB 7000', '192.168.1.7', '00:1B:44:11:3A:10', 'Ubuntu 21.9', 1, 1),
("notebook-caio", "caio", "192.168.1.164","4C-44-5B-EF-59-39", "Windows 11", 1, 1);