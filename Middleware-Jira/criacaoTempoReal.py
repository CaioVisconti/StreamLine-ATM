import matplotlib.pyplot as plt
import requests
from io import BytesIO
import time

dados = None
url = "ip:8080/recebimentoTempoReal/"

def atualizacaoImagem(capturas, usuario, fkAtm, velocidade):
    
    linha1 = []
    linha2 = []
    momentos = []
    
    maisAlto = ""
    
    for captura in capturas:
        linha1.append(captura["captura"])
        linha2.append(captura["limite"])
        momentos.append(captura["segundo"])
        
        if captura["captura"] >= captura["limite"]:
            maisAlto = linha1
        else:
            maisAlto = linha2
    
    plt.figure()
    plt.plot(momentos, linha1, marker = 'o', linestyle = "-", label = "Captura", color= "blue")
    plt.plot(momentos, linha2, marker = 'o', linestyle = "-", label = "Limite", color = "red")
    plt.ylim(0, max(maisAlto) * 1.1)
    plt.xlabel("Tempo (s)")
    plt.ylabel("Medida")
    plt.title(f"Andamento do ATM{fkAtm} às HORARIO")
    plt.grid(True)
    
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()
    
    try:
        response = requests.post(url, files ={'image': (f'grafico{usuario}.png', buffer, 'image/png')})
    except Exception as e:
        print(f'Erro ao enviar: {e}')
    

def pesquisaBinaria(lista, momento):
    inn = 0
    fn = len(lista) - 1
    
    while inn <= fn:
        meio = (inn + fn) / 2
        termo = lista[meio]
        
        if termo == momento:
            return meio
        elif termo > momento:
            fn = meio - 1
        else:
            inn = meio + 1
    
    return None

def tratamentoJson(lista):
    vetor = lista
    usuario = vetor[len(vetor)]["idUsuario"]
    fkAtm = vetor[0]["fkAtm"]
    inicio = vetor[len(vetor)]["inicio"]
    
    inicio = pesquisaBinaria(lista, inicio)
    
    fim = vetor[len(vetor)]["fim"]
    
    fim = pesquisaBinaria(lista, fim)
    
    velocidade = vetor[len(vetor)]["velocidade"]
    
    if velocidade == "1x":
        velocidade = 5
    elif velocidade == "2x":
        velocidade = 2.5
    elif velocidade == "0.5x":
        velocidade = 10
    
    segundo = 0
    capturas = []
    
    while inicio < fim:
        segundo += 5
        
        if segundo == 60:
            segundo = 0
    
        captura = vetor[inicio]["valor"]
        limite = vetor[inicio]["limite"]
        
        registro = {"captura": captura, "limite": limite, "segundo": segundo}
        
        capturas.append(registro)
        
        if len(capturas) <= 6:
            atualizacaoImagem(capturas, usuario, fkAtm)
        else:
            capturas.remove(0)
            atualizacaoImagem(capturas, usuario, fkAtm)
        
        inicio += 1
        time.sleep(velocidade)

def recebimentoNovoJson():
    try:
        response = requests.get(url)
        
        if response.status.code == 200:
            lista = response.json()
            tratamentoJson(lista)
        else:
            return
    except Exception as e:
        print('')

recebimentoNovoJson()