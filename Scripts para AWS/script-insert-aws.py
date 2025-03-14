import psutil
import time
from datetime import datetime
import mysql.connector

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="urubu100",
        database="streamline",
        ssl_disabled=True
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

def registrar_dados():
    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO captura (fkAtm, tipoCaptura, valorCaptura, dtCaptura) VALUES (1000, 'Uso do disco', %s, now())", (discoUso,))
    cursor.execute("INSERT INTO captura (fkAtm, tipoCaptura, valorCaptura, dtCaptura) VALUES (1000, 'Percentual de uso do disco', %s, now())", (porcentagemDisco,))
    cursor.execute("INSERT INTO captura (fkAtm, tipoCaptura, valorCaptura, dtCaptura) VALUES (1000, 'Percentual de uso da CPU', %s, now())", (porcentagemCpu,))
    cursor.execute("INSERT INTO captura (fkAtm, tipoCaptura, valorCaptura, dtCaptura) VALUES (1000, 'RAM disponível', %s, now())", (ramDisponivel,))
    cursor.execute("INSERT INTO captura (fkAtm, tipoCaptura, valorCaptura, dtCaptura) VALUES (1000, 'Percentual de uso da RAM', %s, now())", (porcentagemRam,))

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
    print(f"💾 Disco em uso: {discoUso} bytes")
    print(f"🎟  Memória RAM disponível: {ramDisponivel} bytes")

    time.sleep(tempo)

    if(i == quantidade):
        print("\nObrigado por utilizar a nossa solução, até a próxima! ✅\n")
        break