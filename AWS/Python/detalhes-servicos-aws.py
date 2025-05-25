import boto3
import json

ec2 = boto3.client('ec2', region_name="us-east-1")
s3 = boto3.client('s3')

respostaS3 = s3.list_buckets()

respostaEc2 = ec2.describe_instances()

jsonReposta = {
    "ec2": [],
    "s3": []
}

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
        nome = instancias['Tags'][0]['Value']
        id = instancias['NetworkInterfaces'][0]['MacAddress']
        mac = instancias['InstanceId']
        leituraEc2 = {
            "nome": nome,
            "id": id,
            "mac": mac
        }
        jsonReposta['ec2'].append(leituraEc2)

print(json.dumps(jsonReposta, indent=4))

