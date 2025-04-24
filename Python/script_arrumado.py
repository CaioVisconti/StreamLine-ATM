import socket
# import os
import json
import boto3
# from dotenv import load_dotenv
from getmac import get_mac_address
import psutil
import time
import mysql.connector
from datetime import datetime

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="userPython",
        password="Urubu100",
        database="streamline_quente",
    )

hostname = socket.gethostname()
mac = get_mac_address()

print("Hostname:", hostname)
print("MAC Address:", mac)

# Função onde será feito um select no BD para saber se o hostname e o mac adress estão cadastrados
def validar_atm():
    conn = conectar()
    cursor = conn.cursor()
    query = "SELECT fkAtm FROM parametrizacao WHERE hostname = %s AND macAdress = %s"
    cursor.execute(query, (hostname, mac))
    resultado = cursor.fetchone()
    conn.close()

    if resultado: # Caso seja válido, iniciaremos o monitoramento
        print(f"\n🔹 Bem-vindo, {hostname}! Monitoramento iniciado. 🔹\n")
        return resultado[0]
    else: # Caso seja inválido, informamos ao cliente
        print("\n❌ Este ATM não está registrado no banco de dados. ❌")
        return None

# Função que executa um select no BD, onde busca as configurações do atm especifico
# Trazemos o tipo de componente e unidade de medida que está cadastrado para ser capturado
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

    configuracoes = {} # Cria um dicionario vazio onde será armazenado o tipo e unidade de medida
    for tipo, unidade in resultados: # Resultados é uma lista de tuplas que vem do BD, separamos o tipo e unidade de medida para inserir no dicionario
        if tipo not in configuracoes: # Caso o tipo não exista ainda no dicionario, adicionamos ele utilizando o append
            configuracoes[tipo] = []
        configuracoes[tipo].append(unidade) # Quando temos o tipo, ele adiciona a unidade de medida a frente
        # { 'CPUPercent': ['Porcentagem'] }

    return configuracoes

# Nesta função coletamos os valores do Psutil
def coletar_valor(tipo):
    try:
        if tipo == 'CPUPercent':
            return psutil.cpu_percent()
        elif tipo == 'CPUFreq':
            return round(psutil.cpu_freq().current, 2)  # Em GHz
        elif tipo == 'RAMTotal':
            return round(psutil.virtual_memory().total / (1024 ** 3), 2)  # Convertendo de bytes para GB
        elif tipo == 'RAMDisponivel':
            return round(psutil.virtual_memory().available / (1024 ** 3), 2)
        elif tipo == 'RAMPercentual':
            return psutil.virtual_memory().percent
        elif tipo == 'DISKTotal':
            return round(psutil.disk_usage('/').total / (1024 ** 3), 2)  
        elif tipo == 'DISKDisponivel':
            return round(psutil.disk_usage('/').free / (1024 ** 3), 2) 
        elif tipo == 'DISKPercentual':
            return psutil.disk_usage('/').percent
        elif tipo == 'REDERecebida':
            return psutil.net_io_counters().packets_recv  
        elif tipo == 'REDEEnviada':
            return psutil.net_io_counters().packets_sent 
        elif tipo == 'PROCESSOTotal':
            return len(psutil.pids())
        elif tipo == 'PROCESSOAtivos':
            return sum(1 for p in psutil.process_iter(['status']) if p.info['status'] == 'running')
        elif tipo == 'PROCESSODesativado':
            return sum(1 for p in psutil.process_iter(['status']) if p.info['status'] != 'running')
        else:
            return None
    except Exception as e:
        print(f"⚠️ Erro ao coletar valor para {tipo}: {e}")
        return None

fkAtm = validar_atm() # Chamamos a função validar atm para trazer sua FK

if fkAtm: # Se a fk for valida, entramos na seguinte função
    configuracoes = buscar_configuracoes(fkAtm)
    quantidade = int(input("\n📖 Quantas inserções deseja fazer? \nDigite: "))
    capturas = []

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

            # Percorre o tipo do componente e sua unidadde de medida dentro de configurações (resultado da função   buscar_configurações)
            for tipo_componente, medidas in configuracoes.items():
                for unidade in medidas:
                    valor = coletar_valor(tipo_componente) # Coleta o valor correspondente ao tipo de componente

                    print(f"\n🧪 Coleta: [{tipo_componente}] ({unidade}) → Valor: {valor}")

                    conn = conectar()
                    cursor = conn.cursor()

                    # Executa a consulta para localizar o parâmetro e limite do componente e unidade
                    cursor.execute("""
                        SELECT idParametro, limite FROM parametrizacao WHERE fkAtm = %s AND tipo = %s AND unidadeMedida = %s
                    """, (fkAtm, tipo_componente, unidade))
                    resultado = cursor.fetchone()

                    if resultado: # Verifica se a consulta trouxe algum resultado
                        fkParametro, limite = resultado # O método fetchone() retornará uma tupla contendo o    idParametro (chave primária do parâmetro) e o limite associado a esse parâmetro
                        print(f"🔗 fkParametro localizado: {fkParametro} | Limite: {limite}")

                        leitura[tipo_componente] = valor
                        if "Total" not in tipo_componente and "Disponivel" not in tipo_componente:
                            leitura[f"limite {tipo_componente}"] = limite
                            leitura[f"alerta {tipo_componente}"] = valor > limite

                        if valor is not None: # Verifica se o valor coletado não é None
                            # Insere na tabela captura
                            print("✅ Inserção em 'captura' realizada com sucesso!")
                            # Após inserir o valor na tabela captura, o código verifica se o valor coletado excede  o limite configurado para aquele parâmetro 
                            if valor > limite:
                                cursor.execute("""
                                    INSERT INTO alerta (valor, dtHora, fkParametro) VALUES (%s, NOW(), %s)
                                """, (valor, fkParametro))
                                conn.commit()
                                print("🚨 ALERTA GERADO! Inserção em 'alerta' realizada!")
                            else: # Se não passou do limite, ele imprime na tela que o valor está dentro do limite
                                print("🟢 Valor dentro do limite.")

                        else: # Se o valor for None
                            print("⚠️ Valor inválido (None). Inserção ignorada.")

                    else:
                        print(f"❌ Parâmetro não encontrado no banco para [{tipo_componente}] ({unidade})")

                    conn.close()

            i += 1

            hora = datetime.now().strftime('%H:%M:%S %d/%m/%Y')
            print(f"\n📅 {i}° Leitura concluída - {hora}")

            time.sleep(5)
            capturas.append(leitura)

            if len(capturas) == 7200 or i == quantidade or interrompido:
                print("\n📂 Gerando Arquivo JSON!\n")
                caminhoArquivo = f'Capturas_ATM_{fkAtm}_{datetime.now().strftime('%d-%m-%Y_%H-%M-%S')}.json'
                with open (caminhoArquivo, "w") as arquivo: # o python vai abrir o arquivo para leitura (por isso o "w", de write). Se o arq nao existir, ele o cria
                    json.dump(capturas, arquivo, indent=4)

                s3 = boto3.client('s3')
                s3.upload_file(
                    Filename=caminhoArquivo,
                    Bucket='teste102343',
                    Key=f'captura/{caminhoArquivo}')
                
                print("\n Arquivo JSON Gerado! ✅\n")

    except KeyboardInterrupt:
        print("\n Monitoramento Interrompido! ⛔")
        interrompido = True


    print("\n🏁 Monitoramento finalizado com sucesso! ✅\n")

    

