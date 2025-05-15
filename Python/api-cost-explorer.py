import boto3
import requests as req
import os
import json
import tempfile
from datetime import datetime


client = boto3.client('ce', region_name='us-east-1')
s3 = boto3.client('s3')

response = client.get_cost_and_usage(
    TimePeriod={
        'Start': '2025-01-01',
        'End': '2025-05-01'
    },
    Granularity='DAILY',
    Metrics=['UnblendedCost'],
    Filter = {
        "Dimensions": {
        "Key": "SERVICE",
        "Values": [
        "AWS Lambda", 
        "Amazon Simple Storage Service", 
        "Amazon Elastic Compute Cloud - Compute"
        ]
        }
        },
        GroupBy=[
        {
            'Type': 'DIMENSION',
            'Key': 'SERVICE'
        }
    ]
)

jsonEstruturado = []
leitura = {}
# print((response))
i = 0
for tempo in response['ResultsByTime']:
    inicio = response.get('ResultsByTime')[i].get('TimePeriod').get('Start')
    fim = response.get('ResultsByTime')[i].get('TimePeriod').get('End')
    # Preco = response.get('ResultsByTime')[i].get('Total').get('UnblendedCost').get('Amount')

    for grupo in tempo['Groups']:
        servico = grupo.get('Keys')
        custo = float(grupo['Metrics']['UnblendedCost'].get('Amount'))
        leitura = {
            "Inicio": inicio,
            "Fim": fim,
            "Servico": servico,
            "Custo": custo,
        }
        jsonEstruturado.append(leitura)


    i += 1
    
    # print(grupo)
    

print(jsonEstruturado)
# dadosAws = os.path.join(tempfile.gettempdir(), f'Capturas_AWS_{datetime.now().strftime('%d-%m-%Y_%H-%M-%S')}.json')

# with open(dadosAws, mode='wt') as f:
#     json.dump(response, f)

# s3.upload_file(
#     Filename=dadosAws,
#     Bucket='brawstreamline',
#     Key=f'analiseAWS/Capturas_AWS_{datetime.now()}.json')

# print(response)