import json
import requests
import tempfile
import os
import boto3

def lambda_handler(event, context):

    # URL da API do Banco Central que retorna os dados das transações Pix em formato JSON
    url ="https://olinda.bcb.gov.br/olinda/servico/Pix_DadosAbertos/versao/v1/odata/EstatisticasTransacoesPix(Database=@Database)?@Database='202310'&$top=500&$format=json&$select=AnoMes,PAG_PFPJ,REC_PFPJ,PAG_REGIAO,REC_REGIAO,PAG_IDADE,REC_IDADE,FORMAINICIACAO,NATUREZA,FINALIDADE,VALOR,QUANTIDADE"   

    try:

        # Envia uma requisição HTTP do tipo GET para a URL, a var resultado vai guardar a resposta da requisição (tudo q retornou do server)
        resultado = requests.get(url)

        # Verifica se a requisição foi bem-sucedida
        resultado.raise_for_status()

        # Decodifica o JSON
        dados = resultado.json()

        # Extrai a lista de transações Pix
        transacoes = dados['value']

        # Cria um arquivo temporário chamado 'dados.json' para armazenar os dados
        nome_arquivo = os.path.join(tempfile.gettempdir(), 'dados.json')

        # Salva os dados das transações Pix no arquivo JSON temporário
        with open(nome_arquivo, mode='wt') as f:
            json.dump(transacoes, f)

        # Faz o upload do arquivo JSON para o bucket S3
        s3 = boto3.client('s3')

        s3.upload_file(
            Filename=nome_arquivo, # Caminho do arquivo local que será enviado
            Bucket='my-python-bucket-01', # Nome do bucket
            Key='pix/dados.json' # Caminho (chave) dentro do bucket onde o arquivo será salvo (pasta 'pix/')
        )

        return transacoes
    
    # Caso de erro na requisicao
    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição: {e}")
        return None

    # Caso de erro ao decodificar o json
    except json.JSONDecodeError as e:
        print(f"Erro ao decodificar JSON: {e}")
        print(f"Resposta completa da API: {resultado.text}")
        return None

print(lambda_handler(None, None)) # Print