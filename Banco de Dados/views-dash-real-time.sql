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
        fkAtm,
        CASE 
            WHEN alerta.valor > p.limite THEN 'critico'
            WHEN alerta.valor BETWEEN p.limite - 10 AND p.limite THEN 'medio'
            ELSE 'baixo'
        END AS nivel
    FROM streamline_quente.alerta
    JOIN parametrizacao p ON alerta.fkParametro = p.idParametro
    WHERE TIMESTAMPDIFF(SECOND, alerta.dtHora, NOW()) BETWEEN 0 AND 60
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
        fkAtm,
        CASE 
            WHEN alerta.valor > p.limite THEN 'critico'
            WHEN alerta.valor BETWEEN p.limite - 10 AND p.limite THEN 'medio'
            ELSE 'baixo'
        END AS nivel
    FROM streamline_quente.alerta
    JOIN parametrizacao p ON alerta.fkParametro = p.idParametro
    WHERE TIMESTAMPDIFF(SECOND, alerta.dtHora, NOW()) BETWEEN 0 AND 60
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
