import boto3
import json
import requests
from datetime import date

def enviar_dados(jsonParaEnviar):
    url = "http://localhost:3333/aws/enviarDetalhesAws"
    resposta = requests.post(url, json=jsonParaEnviar)
    print(resposta)


ec2 = boto3.client('ec2', region_name="us-east-1")
s3 = boto3.client('s3')
awsLambda = boto3.client('lambda', region_name="us-east-1")
cloudWatch = boto3.client('cloudwatch', region_name="us-east-1")

respostaLambda = awsLambda.list_functions()

respostaS3 = s3.list_buckets()

respostaEc2 = ec2.describe_instances()

funcoesLambda = []

jsonReposta = {
    "ec2": [],
    "s3": [],
    "lambda": []
}
for funcao in respostaLambda['Functions']:
    nomeFuncao = funcao['FunctionName']
    linguagemUsada = funcao['Runtime']
    timeout = funcao['Timeout']
    memoria = funcao['MemorySize']
    leituraLambda = {
        "nomeFuncao": nomeFuncao,
        "linguagem": linguagemUsada,
        "timeout": timeout,
        "memoria": memoria
    }
    funcoesLambda.append(nomeFuncao)
    jsonReposta['lambda'].append(leituraLambda)

for lambdaAtual in funcoesLambda:
    respostaCloudwatch = cloudWatch.get_metric_statistics(
    Namespace='AWS/Lambda',
    MetricName='Number of invokes',
    Dimensions=[
        {
            'Name': 'FunctionName',
            'Value': lambdaAtual
        }
    ],
    StartTime=date(2025, 5, 27).strftime("%Y/%m/%d"),
    EndTime=date.today().strftime("%Y/%m/%d"),
    Period=60,
    Statistics=[
        'SampleCount'
    ]
)
    print(respostaCloudwatch)
    


for bucket in respostaS3['Buckets']:
    listaObj = []
    tamanhoBucket = 0
    qtdArqBuckets = 0
    nomeBucket = bucket["Name"]
    respostaListaObj = s3.list_objects_v2(Bucket = nomeBucket)
    for obj in respostaListaObj.get("Contents", []):
        tamanhoBucket += obj['Size']
        listaObj.append(obj['Key'])
        qtdArqBuckets = len(listaObj)
        
    leituraS3 = {
        "nome": nomeBucket,
        "tamanhoBucket": tamanhoBucket,
        "quantidadeArquivos": qtdArqBuckets
    }
    jsonReposta['s3'].append(leituraS3)

for respostas in respostaEc2["Reservations"]:
    for instancias in respostas['Instances']:
        tipo = instancias['InstanceType']
        status = instancias['State']['Name']
        nome = instancias['Tags'][0]['Value']
        id = instancias['NetworkInterfaces'][0]['MacAddress']
        mac = instancias['InstanceId']
        leituraEc2 = {
            "nome": nome,
            "id": id,
            "mac": mac,
            "status": status,
            "tipo": tipo
        }
        jsonReposta['ec2'].append(leituraEc2)

print(json.dumps(jsonReposta, indent=4))

enviar_dados(jsonReposta)
