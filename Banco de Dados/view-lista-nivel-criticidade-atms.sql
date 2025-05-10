use streamline;

CREATE OR REPLACE VIEW viewCriticoLista AS
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
SELECT 
    fkAtm AS fkAtmCritico
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


-- View para ATMs em situação média
CREATE OR REPLACE VIEW viewMediaLista AS
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
SELECT
    fkAtm AS fkAtmMedio
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


SELECT * from viewCriticoLista;
SELECT * from viewMediaLista;

SELECT * FROM viewCritico, viewMedia, viewBom;

select * from alerta
WHERE TIMESTAMPDIFF(SECOND, alerta.dtHoraAbertura, NOW()) BETWEEN 0 AND 60;
    SELECT * from viewCriticoLista;
    SELECT * from viewMediaLista;
