import socket
from getmac import get_mac_address
import psutil
import time
import mysql.connector
from datetime import datetime

# Função para conectar ao banco de dados
def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="27019511-16102004Ja@",
        database="streamline",
    )

# Captura o hostname e o MAC address da máquina
hostname = socket.gethostname()
mac = get_mac_address()

print("Hostname:", hostname)
print("MAC Address:", mac)

# Verifica se o ATM está cadastrado no banco
def validar_atm():
    conn = conectar()
    cursor = conn.cursor()
    
    query = "SELECT idAtm FROM atm WHERE hostname = %s AND macAdress = %s"
    cursor.execute(query, (hostname, mac))
  # fetchone pega apenas a primeira linha do resultado
  # se existe, vai aparecer o resultado, se n, o bd retorna none
    resultado = cursor.fetchone()
    conn.close()
    # se a variavel resultado estiver com o none retornado, é interpretada como vazia pelo python
    if resultado:
        print(f"\n🔹 Bem-vindo, {hostname}! Monitoramento iniciado. 🔹\n")
        return True
    else:
        print("\n❌ Este ATM não está registrado no banco de dados. ❌")
        return False

# Inicia apenas se o ATM for válido
if validar_atm():
    tempo = int(input("\n🧑‍🔧 De quanto em quanto tempo deseja realizar o monitoramento (em segundos)? \nDigite: "))
    quantidade = int(input("\n📖 Quantas inserções deseja fazer? \nDigite: "))

    print("\nIniciando monitoramento... 🔃")
    time.sleep(2)
    
    def registrar_dados():
        conn = conectar()
        cursor = conn.cursor()

        create_table_molde = f"""CREATE TABLE IF NOT EXISTS captura{hostname} (
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
        );"""

        cursor.execute(create_table_molde)


        insert_into_molde = f"""INSERT INTO captura{hostname} (CPUPercent, CPUFreq, RAMTotal, RAMDisponivel, RAMPercentual, DISKTotal, DISKDisponivel, DISKPercentual, REDERecebida, REDEEnviada, PROCESSODesativado, PROCESSOAtivos, PROCESSOTotal, dtHora) """
        insert_into_molde += "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, now());"
        valores = (porcentagemCpu, frequenciaCPU, totalram, ramDisponivel, porcentagemRam, discototal, discoDisponivel, porcentagemDisco, redeRecebido, redeEnviado, desativados, ativos, total)
        
        time.sleep(2)
        cursor.execute(insert_into_molde, (valores))

        conn.commit()
        conn.close()

    i = 0
    while True: 
        discoDisponivel = round(psutil.disk_usage("/").free)
        discoUso = psutil.disk_usage("/").used
        porcentagemDisco = psutil.disk_usage("/").percent
        porcentagemCpu = psutil.cpu_percent(percpu=False)
        ramDisponivel = psutil.virtual_memory().free
        porcentagemRam = psutil.virtual_memory().percent
        horaLeitura = datetime.now().strftime("%H:%M:%S %d/%m/%Y")
        frequenciaCPU = psutil.cpu_freq().current
        totalram = psutil.virtual_memory().total
        discototal = psutil.disk_usage('C:\\').percent
        redeRecebido = psutil.net_io_counters().packets_recv
        redeEnviado = psutil.net_io_counters().packets_sent
        total = 0
        ativos = 0
        desativados = 0
        
        
        # Só mostra o pid e o status do processo
        for processo in psutil.process_iter(attrs=['pid', 'status']):
            try:
                status = processo.info['status']
                if status == "stopped":
                    desativados += 1
                elif status == "running":
                    ativos += 1
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass  
        
        total = len(list(psutil.process_iter()))

        registrar_dados()

        i += 1

        print(f"\n{i}° Leitura - {horaLeitura}")
        print("-" * 50)
        print(f"💻 Uso da CPU: {porcentagemCpu}%")
        # print(f"💾 Disco disponível: {discoDisponivel}")
        print(f"💾 Disco em uso: {discoUso} bytes")
        print(f"🎟  Memória RAM disponível: {ramDisponivel} bytes")
        print(f"🎟  Processos Total: {total} ")
        print(f"🎟  Processos Ativos: {ativos} ")
        print(f"🎟  Processos Desativados: {desativados} ")

        time.sleep(tempo)

        if(i == quantidade):
            print("\nObrigado por utilizar a nossa solução, até a próxima! ✅\n")
            break
