import psutil
import time
from datetime import datetime
import mysql.connector

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Agjxsne/2013",
        database="streamline",
    )

while True:
        try:
            tempo = int(input("🧑‍🔧 De quanto em quanto tempo deseja realizar o monitoramento (em segundos)? \nDigite: "))
            quantidade = int(input("\n📖 Quantas inserções deseja fazer? \nDigite: "))

            if tempo > 0 and quantidade > 0:
                break
            else:
                print("\n❗ Por favor, digite valores maiores que 0.\n")

        except ValueError:
            print("Entrada inválida ❌! Digite um número inteiro.")

espera = 0
print("\nIniciando monitoramento... 🔃")
while True:
    espera += 1
    time.sleep(1)
    if espera == 2:
        break

def registrar_dados():
    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO captura1_1 (CPUPercent, CPUFreq, RAMTotal, RAMDisponivel, RAMPercentual, DISKTotal, DISKDisponivel, DISKPercentual, REDERecebida, REDEEnviada, PROCESSODesativado, PROCESSOAtivos, PROCESSOTotal, dtHora) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, now())", (porcentagemCpu, frequenciaCPU, totalram, ramDisponivel, porcentagemRam, discototal, discoDisponivel, porcentagemDisco, redeRecebido, redeEnviado, desativados, ativos, total))

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