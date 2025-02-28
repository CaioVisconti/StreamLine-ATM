import psutil
import time
from datetime import datetime
import mysql.connector

def conectar():
    return mysql.connector.connect(
        host="10.18.32.7",
        user="inseridor",
        password="urubu100",
        database="streamline"
    )

print(f"{'\nNúmero do ATM':<20} {'Nome do ATM'}")
print('-' * 40)

conn = conectar()
cursor = conn.cursor()
cursor.execute("SELECT idAtm, modelo FROM atm")
myresult = cursor.fetchall()

for x in myresult:
    print(f"{x[0]:<20} {x[1]}")

print("\n")


maquina = int(input("Digite o número do ATM que deseja monitorar: "))

while True:
        try:
            tempo = int(input("🧑‍🔧 De quanto em quanto tempo deseja realizar o monitoramento (em segundos)? \nDigite: "));
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

    cursor.execute("INSERT INTO captura (fkAtm, discoUso, discoPorcent, cpuUso, ramDisp, ramPorcent, dtCaptura) VALUES (%s, %s, %s, %s,%s, %s,""now()"")", (maquina, discoUso,porcentagemDisco, porcentagemCpu, ramDisponivel, porcentagemRam))

    conn.commit()
    conn.close()
    
i = 0
while True: 
    discoDisponivel = round(psutil.disk_usage("/").free)
    discoUso = psutil.disk_usage("/").used
    porcentagemDisco = psutil.disk_usage("/").percent
    porcentagemCpu = psutil.cpu_percent(interval=1, percpu=False)
    ramDisponivel = psutil.virtual_memory().free
    porcentagemRam = psutil.virtual_memory().percent
    horaLeitura = datetime.now().strftime("%H:%M:%S %d/%m/%Y")

    registrar_dados()

    i += 1

    print(f"\n{i}° Leitura - {horaLeitura}")
    print("-" * 50)
    print(f"💻 Uso da CPU: {porcentagemCpu}%")
    # print(f"💾 Disco disponível: {discoDisponivel}")
    print(f"💾 Disco em uso: {discoUso}")
    print(f"🎟  Memória RAM disponível: {ramDisponivel}")

    time.sleep(tempo)

    if(i == quantidade):
        print("\nObrigado por utilizar a nossa solução, até a próxima! ✅\n")
        break

# CREATE DATABASE dadosPc;
# USE dadosPc;

# CREATE TABLE dadosCpuMemoryDisk (
# id INT PRIMARY KEY AUTO_INCREMENT,
# discoDisponivel FLOAT,
# discoTotal FLOAT,
# porcentagemDisco FLOAT,
# porcentagemCpu FLOAT,
# ramDisponivel FLOAT,
# porcentagemRam FLOAT,
# ramTotal FLOAT,
# dataRegistro DATETIME
# );

# SELECT * FROM dadosCpuMemoryDisk;
