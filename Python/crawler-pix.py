import json
import requests
import tempfile
import os
import boto3
from datetime import datetime

def lambda_handler(event, context):
    url = "https://olinda.bcb.gov.br/olinda/servico/Pix_DadosAbertos/versao/v1/odata/EstatisticasTransacoesPix(Database=@Database)?@Database='202503'&$top=500&$format=json&$select=AnoMes,PAG_PFPJ,REC_PFPJ,PAG_REGIAO,REC_REGIAO,PAG_IDADE,REC_IDADE,FORMAINICIACAO,NATUREZA,FINALIDADE,VALOR,QUANTIDADE"

    try:
        resultado = requests.get(url)
        resultado.raise_for_status() #se der erro joga uma exceção para o except

        dados = resultado.json()
        transacoes = dados['value']

        # dicionario com a troca dos nomes
        renomear_campos = {
            "AnoMes": "ANO_MES",
            "PAG_PFPJ": "TIPO_PAGADOR",
            "REC_PFPJ": "TIPO_RECEBEDOR",
            "PAG_REGIAO": "REGIAO_PAGADOR",
            "REC_REGIAO": "REGIAO_RECEBEDOR",
            "PAG_IDADE": "IDADE_PAGADOR",
            "REC_IDADE": "IDADE_RECEBEDOR",
            "FORMAINICIACAO": "FORMA_INICIACAO", #se foi qrcode, chave pix ou manual (numero da agencia e tals)
            "NATUREZA": "NATUREZA_TRANSACAO",
            "FINALIDADE": "FINALIDADE",
            "VALOR": "VALOR_TOTAL",
            "QUANTIDADE": "NUMERO_TRANSACOES"
        }

        # vai guardar o nome renomeado (e valor) de cada dicionario no json recebido, é isso que vou mandar para o bucket
        transacoes_renomeadas = []

        #item é um dicionário no json
        for item in transacoes:
            transacao = {} # cria um dicionario novo (que é o que vou add na lista acima)
            for chave, valor in item.items():
                nova_chave = renomear_campos.get(chave, chave)  # usa a chave original se não estiver no dicionário que fiz lá em cima
                transacao[nova_chave] = valor # guarda a chave e o valor de cada chave
            transacoes_renomeadas.append(transacao) # adiciona a nova lista


        nome_arquivo = os.path.join(tempfile.gettempdir(), f'dados_{datetime.now().strftime('%d-%m-%Y_%H-%M-%S')}.json')

        # Salva o novo JSON com campos renomeados
        with open(nome_arquivo, mode='wt') as f:
            json.dump(transacoes_renomeadas, f)

        # Faz o upload do arquivo JSON para o bucket S3
        s3 = boto3.client('s3')

        s3.upload_file(
            Filename=nome_arquivo, # Caminho do arquivo local que será enviado
            Bucket='braw-streamline', # Nome do bucket
            Key=f'dados_{datetime.now().strftime('%d-%m-%Y_%H-%M-%S')}.json' # Caminho (chave) dentro do bucket onde o arquivo será salvo (pasta 'pix/')
        )

        print("Arquivo salvo com sucesso!")
        return transacoes_renomeadas

    # Caso de erro na requisicao
    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição: {e}")
        return None

    # Caso de erro ao decodificar o json
    except json.JSONDecodeError as e:
        print(f"Erro ao decodificar JSON: {e}")
        print(f"Resposta completa da API: {resultado.text}")
        return None

lambda_handler(None, None)
