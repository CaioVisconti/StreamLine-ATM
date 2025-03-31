import socket
from getmac import get_mac_address
import psutil

print("\n🔍 IDENTIFICADOR DA MÁQUINA SELECIONADA\n")

#  Hostname da máquina
hostname = socket.gethostname()
print("Hostname:", hostname)

#  MAC Address com getmac
mac = get_mac_address()
print("MAC Address:", mac)

# Processos ativos ( os 5 primeiros)
print("\n Processos ativos (exibindo os 5 primeiros):\n")

processos = psutil.process_iter(['pid', 'name'])

contador = 0
for proc in processos:
    print(f" PID: {proc.info['pid']} | Nome: {proc.info['name']}")
    contador += 1
    if contador == 5:
        break
