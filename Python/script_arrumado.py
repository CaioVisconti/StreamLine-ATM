import socket
import json
from getmac import get_mac_address
import psutil
import time
import mysql.connector
from datetime import datetime

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="streamline",
        password="Urubu@100",
        database="streamline",
    )

hostname = socket.gethostname()
mac = get_mac_address()

print("Hostname:", hostname)
print("MAC Address:", mac)

# Função onde será feito um select no BD para saber se o hostname e o mac adress estão cadastrados
def validar_atm():
    conn = conectar()
    cursor = conn.cursor()
    query = "SELECT idAtm FROM atm WHERE hostname = %s AND macAdress = %s"
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
    SELECT c.tipo, c.unidadeMedida FROM parametro AS p 
    JOIN componentes AS c ON p.fkComponente = c.idComponentes
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
    tempo = int(input("\n🧑‍🔧 De quanto em quanto tempo deseja realizar o monitoramento (em segundos)? \nDigite: "))
    quantidade = int(input("\n📖 Quantas inserções deseja fazer? \nDigite: "))
    capturas = []

    print("\nIniciando monitoramento... 🔃")
    time.sleep(2)

    i = 0
    while i < quantidade:
        
        print(f"\n🔄 Início da leitura {i+1}")
        
        # Percorre o tipo do componente e sua unidadde de medida dentro de configurações (resultado da função buscar_configurações)
        for tipo_componente, medidas in configuracoes.items():
            for unidade in medidas:
                valor = coletar_valor(tipo_componente) # Coleta o valor correspondente ao tipo de componente

                print(f"\n🧪 Coleta: [{tipo_componente}] ({unidade}) → Valor: {valor}")

                conn = conectar()
                cursor = conn.cursor()

                # Executa a consulta para localizar o parâmetro e limite do componente e unidade
                cursor.execute("""
                    SELECT p.idParametro, p.limite FROM parametro p
                    JOIN componentes c ON p.fkComponente = c.idComponentes
                    WHERE p.fkAtm = %s AND c.tipo = %s AND c.unidadeMedida = %s
                """, (fkAtm, tipo_componente, unidade))
                resultado = cursor.fetchone()

                if resultado: # Verifica se a consulta trouxe algum resultado
                    fkParametro, limite = resultado # O método fetchone() retornará uma tupla contendo o idParametro (chave primária do parâmetro) e o limite associado a esse parâmetro
                    print(f"🔗 fkParametro localizado: {fkParametro} | Limite: {limite}")

                    if valor is not None: # Verifica se o valor coletado não é None
                        # Insere na tabela captura
                        cursor.execute("""
                            INSERT INTO captura (valor, dtHora, fkParametro) VALUES (%s, NOW(), %s)
                        """, (valor, fkParametro))
                        conn.commit()

                        capturas.append({
                            "fkAtm" : fkAtm,
                            "tipo": tipo_componente,
                            "unidade": unidade,
                            "valor": valor,
                            "limite": limite,
                            "alerta": valor > limite,
                            "dataHora": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        })

                        print("✅ Inserção em 'captura' realizada com sucesso!")
                        # Após inserir o valor na tabela captura, o código verifica se o valor coletado excede o limite configurado para aquele parâmetro 
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

        time.sleep(tempo)

        print("\n📂 Gerando Arquivo JSON!\n")
        with open ("Capturas.json", "w") as arquivo:
            json.dump(capturas, arquivo, indent=4)
        print("\n Arquivo JSON Gerado! ✅\n")


    print("\n🏁 Monitoramento finalizado com sucesso! ✅\n")
    



