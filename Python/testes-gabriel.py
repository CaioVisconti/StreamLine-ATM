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
    resultado = cursor.fetchone()
    conn.close()
    
    if resultado:
        fkAtm = resultado[0]  # Pega o idAtm da tupla
        print(f"\n🔹 Bem-vindo, {hostname}! Monitoramento iniciado. 🔹\n")
        return fkAtm  # Retorna o id
    else:
        print("\n❌ Este ATM não está registrado no banco de dados. ❌")
        return None

def buscar_configuracoes(fkAtm):
    conn = conectar()
    cursor = conn.cursor()

    query = """
    SELECT 
        c.tipo AS tipo_componente,
        m.tipo AS tipo_medida
    FROM configuracao conf
    JOIN componentes c ON conf.fkComponente = c.idComponentes
    JOIN medida m ON conf.fkMedida = m.idMedida
    JOIN atm ON c.fkAtm = atm.idAtm
    WHERE atm.idAtm = %s;
    """

    cursor.execute(query, (fkAtm,))
    resultados = cursor.fetchall()
    conn.close()

    configuracoes = {}  # exemplo: {'CPU': ['CPUPercent', 'CPUFreq']}

    for tipo_componente, tipo_medida in resultados:
        if tipo_componente not in configuracoes:
            configuracoes[tipo_componente] = []
        configuracoes[tipo_componente].append(tipo_medida)

    return configuracoes


# Inicia apenas se o ATM for válido
fkAtm = validar_atm()
if fkAtm:
    configuracoes = buscar_configuracoes(fkAtm) #aqui eu trago a variavel configuracoes
    tempo = int(input("\n🧑‍🔧 De quanto em quanto tempo deseja realizar o monitoramento (em segundos)? \nDigite: "))
    quantidade = int(input("\n📖 Quantas inserções deseja fazer? \nDigite: "))

    print("\nIniciando monitoramento... 🔃")
    time.sleep(2)
    
    # Criar tabela caso não exista
    def criar_tabela():
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS `captura{mac}` (
                idCaptura INT AUTO_INCREMENT PRIMARY KEY,
                CPUPercent DOUBLE,
                CPUFreq DOUBLE,
                RAMTotal DOUBLE,
                RAMDisponivel DOUBLE,
                RAMPercentual DOUBLE,
                DISKTotal DOUBLE,
                DISKDisponivel DOUBLE,
                DISKPercentual DOUBLE,
                REDERecebida DOUBLE,
                REDEEnviada DOUBLE,
                dtHora DATETIME
            );
        """)
        conn.commit()
        conn.close()

    criar_tabela()

    i = 0
    while i < quantidade:
        # Inicializa tudo como None
        CPUPercent = CPUFreq = RAMTotal = RAMDisponivel = RAMPercentual = None
        DISKTotal = DISKDisponivel = DISKPercentual = None
        REDERecebida = REDEEnviada = None

        # Coleta com base nas configurações
        if 'CPU' in configuracoes:
            if 'CPUPercent' in configuracoes['CPU']:
                CPUPercent = psutil.cpu_percent()
            if 'CPUFreq' in configuracoes['CPU']:
                CPUFreq = psutil.cpu_freq().current

        if 'RAM' in configuracoes:
            mem = psutil.virtual_memory()
            if 'RAMTotal' in configuracoes['RAM']:
                RAMTotal = mem.total
            if 'RAMDisponivel' in configuracoes['RAM']:
                RAMDisponivel = mem.available
            if 'RAMPercentual' in configuracoes['RAM']:
                RAMPercentual = mem.percent

        if 'DISCO' in configuracoes:
            disk = psutil.disk_usage('/')
            if 'DISKTotal' in configuracoes['DISCO']:
                DISKTotal = disk.total
            if 'DISKDisponivel' in configuracoes['DISCO']:
                DISKDisponivel = disk.free
            if 'DISKPercentual' in configuracoes['DISCO']:
                DISKPercentual = disk.percent

        if 'REDE' in configuracoes:
            reds = psutil.net_io_counters()
            if 'REDERecebida' in configuracoes['REDE']:
                REDERecebida = reds.packets_recv
            if 'REDEEnviada' in configuracoes['REDE']:
                REDEEnviada = reds.packets_sent

        # Inserir no banco
        conn = conectar()
        cursor = conn.cursor()
        insert = f"""INSERT INTO `captura{mac}` (
            CPUPercent, CPUFreq, RAMTotal, RAMDisponivel, RAMPercentual,
            DISKTotal, DISKDisponivel, DISKPercentual, REDERecebida, REDEEnviada, dtHora
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, now())"""

        cursor.execute(insert, (
            CPUPercent, CPUFreq,
            RAMTotal, RAMDisponivel, RAMPercentual,
            DISKTotal, DISKDisponivel, DISKPercentual,
            REDERecebida, REDEEnviada
        ))

        conn.commit()
        conn.close()

        i += 1
        hora = datetime.now().strftime('%H:%M:%S %d/%m/%Y')
        print(f"\n✅ {i}° Leitura - {hora}")

        time.sleep(tempo)

    print("\nObrigado por utilizar a nossa solução, até a próxima! ✅\n")
