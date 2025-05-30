import os
import json
import tempfile
import boto3
from jira import JIRA 
from requests.auth import HTTPBasicAuth
import psutil
import time
from datetime import datetime
import requests
from getmac import get_mac_address


mac = get_mac_address()
print(f"🔎 MAC Address detectado: {mac}")

# def conectar_jira():
#     options = {'server': 'https://bancostreamline.atlassian.net/'}
#     auth = HTTPBasicAuth("bancostreamline@gmail.com", "")
#     return JIRA(options=options, basic_auth=(auth.username, auth.password))

def consultar_atm():
    try:
        url_get = f"http://localhost:3333/validarAtm/mac/{mac}"
        response = requests.get(url_get)
        if response.status_code == 200:
            dados = response.json()

            print("\n📡 Dados recebidos da API:")
            
            configuracoes = {}
            fkAtm = None  

            for item in dados:
                if fkAtm is None:
                    fkAtm = item['fkAtm']
                
                if item['tipo'] not in configuracoes:
                    configuracoes[item['tipo']] = []
                configuracoes[item['tipo']].append({
                        "unidade": item['unidadeMedida'],
                        "idParametro": item['idParametro'],
                        "limite": item['limite']
                        })   


                print(f" - Tipo: {item['tipo']}, Unidade de Medida: {item['unidadeMedida']}, FKATM: {item['fkAtm']}, Limite: {item['limite']}")

            return configuracoes, fkAtm

        elif response.status_code == 404:
            print("⚠️ Nenhum dado encontrado para esse MAC.")
        else:
            print(f"⚠️ Falha no GET. Status code: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao consultar dados (GET): {e}")

    time.sleep(1)

def coletar_valor(tipo):
    try:
        if tipo == 'CPUPercent':
            return psutil.cpu_percent() 
        elif tipo == 'CPUFreq':
            return round(psutil.cpu_freq().current / 1000, 1)
        elif tipo == 'RAMDisponivel':
            return round(psutil.virtual_memory().available / (1024 ** 3), 2)
        elif tipo == 'RAMPercentual':
            return psutil.virtual_memory().percent
        elif tipo == 'DISKDisponivel':
            return round(psutil.disk_usage('/').free / (1024 ** 3), 2)
        elif tipo == 'DISKPercentual':
            return psutil.disk_usage('/').percent
        elif tipo == 'REDERecebida':
            valor = psutil.net_io_counters().packets_recv / (1024 * 1024)
            valor_arredondado = round(valor, 2)
            return valor_arredondado
        elif tipo == 'REDEEnviada':
            valor = psutil.net_io_counters().packets_sent / (1024 * 1024)
            valor_arredondado = round(valor, 2)
            return valor_arredondado
        elif tipo == 'PROCESSOSAtivos':
            return sum(1 for p in psutil.process_iter(['status']) if p.info['status'] == 'running')
        elif tipo == 'PROCESSOSDesativado':
            return sum(1 for p in psutil.process_iter(['status']) if p.info['status'] != 'running')
        else:
            return None
    except Exception as e:
        print(f"⚠️ Erro ao coletar valor para {tipo}: {e}")
        return None
    

configuracoes, fkAtm = consultar_atm()

if fkAtm:
    quantidade = int(input("\n📖 Quantas inserções deseja fazer? \nDigite: "))

    capturas = []

    print("\nIniciando monitoramento... 🔃")
    time.sleep(2)

    interrompido = False
    try:
        i = 0
        while i < quantidade:
            configuracoes, fkAtm = consultar_atm()
            print(f"\n🔄 Início da leitura {i+1}")

            leitura = {
                "fkAtm": fkAtm,
                "dataHora": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            for tipo_componente, lista_parametros in configuracoes.items():
                for parametro in lista_parametros:
                    unidade = parametro["unidade"]
                    id_parametro = parametro["idParametro"]
                    limite = parametro["limite"]

                    valor = coletar_valor(tipo_componente)
                    print(f"\n🧪 Coleta: [{tipo_componente}] ({unidade}) → Valor: {valor}")
                    print(f"🔗 fkParametro localizado: {id_parametro} | Limite: {limite}")

                    # exemplo de uso
                    if "Disponivel" not in tipo_componente and valor > limite or (valor >= (limite - (limite * 0.10)) and valor < limite):
                        print(f"🚨 ALERTA: Valor {valor} ultrapassou o limite de {limite} ({tipo_componente})")
                    elif "Disponivel" in tipo_componente and valor < limite or (valor <= (limite + (limite * 0.10)) and valor > limite):
                        print(f"🚨 ALERTA: Valor {valor} ultrapassou o limite de {limite} ({tipo_componente})")
                    else:
                        print("🟢 Valor dentro do limite.")
                    
                    leitura[tipo_componente] = valor
                    if "Disponivel" not in tipo_componente:
                        leitura[f"limite {tipo_componente}"] = limite
                        leitura[f"alerta {tipo_componente}"] = valor > limite  or (valor >= (limite - (limite * 0.10)) and valor < limite)
                        leitura[f"fkParametro {tipo_componente}"] = id_parametro

                    
                    elif "Disponivel" in tipo_componente:
                        leitura[f"limite {tipo_componente}"] = limite
                        leitura[f"alerta {tipo_componente}"] = valor < limite  or (valor <= (limite + (limite * 0.10)) and valor > limite)
                        leitura[f"fkParametro {tipo_componente}"] = id_parametro
                    else:
                        print(f"❌ Parâmetro não encontrado no banco para [{tipo_componente}] ({unidade})")

            # cria um dicionario para mandar pra uma rota na wbviz
            dicionario = {
                "maquina": fkAtm, 
                "dados": leitura
            }

            # print(type(leitura))
            # print(leitura)
            # print(type(dicionario))  # deve ser dict
            # print(type(dicionario.get("dados")))  # deve ser list
            # print(dicionario["dados"]) 

            try:
                url = "http://localhost:3333/tempoReal/monitoramento/0"
                response = requests.get(url, json=dicionario)
                if response.status_code == 200:
                    print("📡 Dados enviados com sucesso para a API.")
                else:
                    print(f"⚠️ Falha ao enviar dados para a API. Status code: {response.status_code}")
            except Exception as e:
                print(f"⚠️ Erro ao enviar dados para a API: {e}")


            registro = dicionario["dados"]
            alertas = []
            # print(registro)

            for chave, valor in registro.items():
                if chave.startswith("alerta") and valor is True:
                    nome_parametro = chave.split("alerta ")[1]  
                    valor_parametro = registro.get(nome_parametro)
                    valor_limite = (registro.get(f"limite {nome_parametro}"))
                    categoria = ""
                    # print(nome_parametro)
                    # print(valor_parametro)
                    # print(valor_limite)

                    if "Disponivel" not in nome_parametro:                    
                        if valor_parametro >= (valor_limite * 0.9) and valor_parametro <= valor_limite:
                            categoria = 'Medium'
                        elif valor_parametro > valor_limite:
                            categoria = 'High'

                    elif "Disponivel" in nome_parametro:
                        if valor_parametro <= (valor_limite * 1.1) and valor_parametro >= valor_limite:
                            categoria = 'Medium'
                        elif valor_parametro < valor_limite:
                            categoria = 'High'

                    # print(categoria)

                    alertas.append({
                        "dataHora": registro["dataHora"],
                        "parametro": nome_parametro,
                        "valor": valor_parametro,
                        "limite": valor_limite,
                        "categoria": categoria,
                        "fkParametro": registro.get(f"fkParametro {nome_parametro}")
                    })


                    # jira = conectar_jira()

                    # issue_fields = {
                    #     'project': {'key': 'G1ALERTAS'},
                    #     'issuetype': {'name': '[System] Incident'},
                    #     'summary': f'ATM {fkAtm} - {nome_parametro} {registro.get(nome_parametro)}',
                    #     'description': f'O ATM de ID {fkAtm} apresentou falha no {nome_parametro} no valor de {registro.get(nome_parametro)}.',
                    #     'priority': {'name': str(categoria)}
                    # }

                    # new_issue = jira.create_issue(fields=issue_fields)
                    # print(f"Issue criado com sucesso: {new_issue.key}")

            if alertas:
                dicionarioAlerta = {
                    "fkAtm": registro["fkAtm"],
                    "alertas": alertas
                }
                try:
                    url = "http://localhost:3333/dadosInsert/alerta/0"
                    response = requests.get(url, json=dicionarioAlerta) 
                    if response.status_code == 200:
                        print("🚨 Alerta enviado com sucesso para a API.")
                    else:
                        print(f"⚠️ Falha ao enviar alerta para a API. Status code: {response.status_code}")
                except Exception as e:
                    print(f"⚠️ Erro ao enviar alerta para a API: {e}")



            i += 1
            hora = datetime.now().strftime('%H:%M:%S %d/%m/%Y')
            print(f"\n📅 {i}° Leitura concluída - {hora}")

            time.sleep(10)
            capturas.append(leitura)
            # print(len(capturas))

            # aqui em baixo dá para implementar e enviar para o bucket, bd....
    except KeyboardInterrupt:
        print("\n Monitoramento Interrompido! ⛔")
        interrompido = True
    
    if len(capturas) == 7200 or i == quantidade or interrompido:
        print("\n📂 Gerando Arquivo JSON!\n")
        caminhoArquivo = os.path.join(tempfile.gettempdir(), f'Capturas_ATM_{fkAtm}_{datetime.now().strftime('%d-%m-%Y_%H-%M-%S')}.json')
        with open (caminhoArquivo, mode="wt") as arquivo: # o python vai abrir o arquivo para leitura (por isso o "w", de write). Se o arq nao existir, ele o cria
            json.dump(capturas, arquivo, indent=4)

        s3 = boto3.client('s3')
        s3.upload_file(
            Filename=caminhoArquivo,
            Bucket='raw-teste-pix',
            Key=f'Capturas_ATM_{fkAtm}_{datetime.now().strftime('%d-%m-%Y_%H-%M-%S')}.json')
                
        print("\n Arquivo JSON Gerado! ✅\n")

    print("\n🏁 Monitoramento finalizado com sucesso! ✅\n")



