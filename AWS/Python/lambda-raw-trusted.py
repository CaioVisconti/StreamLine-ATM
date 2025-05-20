import boto3
import os
import json
import tempfile
from datetime import datetime

client = boto3.client('ce', region_name='us-east-1')
s3 = boto3.resource('s3')
s3Client = boto3.client('s3')

jsonEstruturado = []
leitura = {}

buckets = s3.Bucket('brawstreamline2')

objeto = s3Client.get_object(Bucket='brawstreamline2', Key='analiseAWS/Capturas_AWS.json')
string = objeto['Body'].read().decode('utf-8')
response = json.loads(string)

print(response)

i = 0
for tempo in response['ResultsByTime']:
    inicio = response.get('ResultsByTime')[i].get('TimePeriod').get('Start')
    fim = response.get('ResultsByTime')[i].get('TimePeriod').get('End')

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
    

print(json.dumps(jsonEstruturado, indent=4))

dadosEstruturados = os.path.join(tempfile.gettempdir(), f'Capturas_AWS_{datetime.now().strftime('%d-%m-%Y_%H-%M-%S')}.json')

with open(dadosEstruturados, mode='wt') as f:
    json.dump(jsonEstruturado, f)

s3Client.upload_file(
    Filename=dadosEstruturados,
    Bucket='btrustedstreamline',
    Key=f'analiseAWS/Capturas_AWS.json')