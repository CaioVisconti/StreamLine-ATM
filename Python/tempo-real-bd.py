import socket
import os
import json
import psutil
import time
import mysql.connector
from datetime import datetime
import requests
from getmac import get_mac_address

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="userPython",
        password="Urubu100",
        database="streamline",
    )

mac = get_mac_address()

print("MAC Address:", mac)

def validar_atm():
    conn = conectar()
    cursor = conn.cursor()
    query = "SELECT fkAtm, hostname FROM parametrizacao WHERE macAdress = %s"
    cursor.execute(query, (mac, ))
    resultado = cursor.fetchone()
    conn.close()

    if resultado:
        print(f"\n🔹 Bem-vindo, {mac}! Monitoramento iniciado. 🔹\n")
        return resultado[0]
    else:
        print("\n❌ Este ATM não está registrado no banco de dados. ❌")
        return None

def buscar_configuracoes(fkAtm):
    conn = conectar()
    cursor = conn.cursor()
    query = """
    SELECT tipo, unidadeMedida FROM parametrizacao AS p
    WHERE p.fkAtm = %s;
    """
    cursor.execute(query, (fkAtm,))
    resultados = cursor.fetchall()
    conn.close()

    configuracoes = {}
    for tipo, unidade in resultados:
        if tipo not in configuracoes:
            configuracoes[tipo] = []
        configuracoes[tipo].append(unidade)

    return configuracoes

def coletar_valor(tipo):
    try:
        if tipo == 'CPUPercent':
            return psutil.cpu_percent()
        elif tipo == 'CPUFreq':
            return round(psutil.cpu_freq().current, 2)
        elif tipo == 'RAMDisponivel':
            return round(psutil.virtual_memory().available / (1024 ** 3), 2)
        elif tipo == 'RAMPercentual':
            return psutil.virtual_memory().percent
        elif tipo == 'DISKDisponivel':
            return round(psutil.disk_usage('/').free / (1024 ** 3), 2)
        elif tipo == 'DISKPercentual':
            return psutil.disk_usage('/').percent
        elif tipo == 'REDERecebida':
            return psutil.net_io_counters().packets_recv
        elif tipo == 'REDEEnviada':
            return psutil.net_io_counters().packets_sent
        elif tipo == 'PROCESSOSAtivos':
            return sum(1 for p in psutil.process_iter(['status']) if p.info['status'] == 'running')
        elif tipo == 'PROCESSOSDesativado':
            return sum(1 for p in psutil.process_iter(['status']) if p.info['status'] != 'running')
        else:
            return None
    except Exception as e:
        print(f"⚠️ Erro ao coletar valor para {tipo}: {e}")
        return None

fkAtm = validar_atm()

if fkAtm:
    configuracoes = buscar_configuracoes(fkAtm)
    quantidade = int(input("\n📖 Quantas inserções deseja fazer? \nDigite: "))

    print("\nIniciando monitoramento... 🔃")
    time.sleep(2)

    interrompido = False
    try:
        i = 0
        while i < quantidade:
            print(f"\n🔄 Início da leitura {i+1}")

            leitura = {
                "fkAtm": fkAtm,
                "dataHora": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }

            for tipo_componente, medidas in configuracoes.items():
                for unidade in medidas:
                    valor = coletar_valor(tipo_componente)
                    print(f"\n🧪 Coleta: [{tipo_componente}] ({unidade}) → Valor: {valor}")

                    conn = conectar()
                    cursor = conn.cursor()

                    cursor.execute("""
                        SELECT idParametro, limite FROM parametrizacao WHERE fkAtm = %s AND tipo = %s AND unidadeMedida = %s
                    """, (fkAtm, tipo_componente, unidade))
                    resultado = cursor.fetchone()

                    if resultado:
                        fkParametro, limite = resultado
                        print(f"🔗 fkParametro localizado: {fkParametro} | Limite: {limite}")

                        leitura[tipo_componente] = valor
                        if "Total" not in tipo_componente:
                            leitura[f"limite {tipo_componente}"] = limite
                            leitura[f"alerta {tipo_componente}"] = valor > limite

                        if valor is not None:
                            print("✅ Inserção em 'captura' realizada com sucesso!")
                            if valor > limite or (valor >= (limite - 10.0) and valor <= limite):
                                cursor.execute("""
                                    INSERT INTO alerta (valor, dtHoraAbertura, fkParametro) VALUES (%s, NOW(), %s)
                                """, (valor, fkParametro))
                                conn.commit()
                                print("🚨 ALERTA GERADO! Inserção em 'alerta' realizada!")
                            else:
                                print("🟢 Valor dentro do limite.")
                        else:
                            print("⚠️ Valor inválido (None). Inserção ignorada.")
                    else:
                        print(f"❌ Parâmetro não encontrado no banco para [{tipo_componente}] ({unidade})")

                    conn.close()

            # cria um dicionario para mandar pra uma rota na wbviz
            dicionario = {
                "maquina": fkAtm, 
                "dados": leitura
            }
            try:
                url = "http://localhost:3333/tempoReal/monitoramento/0"
                response = requests.get(url, json=dicionario)
                if response.status_code == 200:
                    print("📡 Dados enviados com sucesso para a API.")
                else:
                    print(f"⚠️ Falha ao enviar dados para a API. Status code: {response.status_code}")
            except Exception as e:
                print(f"⚠️ Erro ao enviar dados para a API: {e}")

            i += 1
            hora = datetime.now().strftime('%H:%M:%S %d/%m/%Y')
            print(f"\n📅 {i}° Leitura concluída - {hora}")

            time.sleep(3)

            # aqui em baixo dá para implementar e enviar para o bucket, bd....

    except KeyboardInterrupt:
        print("\n Monitoramento Interrompido! ⛔")
        interrompido = True

    print("\n🏁 Monitoramento finalizado com sucesso! ✅\n")
