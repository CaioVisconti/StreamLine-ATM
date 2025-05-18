import boto3
import os
import json
import tempfile

client = boto3.client('ce', region_name='us-east-1')
s3 = boto3.resource('s3')
s3Client = boto3.client('s3')

buckets = s3.Bucket('btrustedstreamline')

objeto = s3Client.get_object(Bucket='btrustedstreamline', Key='analiseAWS/Capturas_AWS.json')
string = objeto['Body'].read().decode('utf-8')
response = json.loads(string)

i = 0
for dadoAtual in response:
    Servico = response[i]['Servico']
    if(Servico == ['AWS Lambda']):
        response[i]['Custo'] * 100
    elif(Servico == ['Amazon Elastic Compute Cloud - Compute']):
        response[i]['Custo'] * 200
    elif(Servico == ['Amazon Simple Storage Service']):
        response[i]['Custo'] * 150
    print(response[i])
    i += 1

print(json.dumps(response, indent=4))

dadosEstruturados = os.path.join(tempfile.gettempdir(), f'Capturas_AWS.json')

with open(dadosEstruturados, mode='wt') as f:
    json.dump(response, f)

s3Client.upload_file(
    Filename=dadosEstruturados,
    Bucket='bclientstreamline',
    Key=f'analiseAWS/Capturas_AWS.json')