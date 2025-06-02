import boto3
import os
import json
import tempfile
import datetime

client = boto3.client('ce', region_name='us-east-1')
s3 = boto3.client('s3')
inicio = None
fim = datetime.date.today() - datetime.timedelta(days=1)

try:
    s3.get_object(
        Bucket="bclient-streamline",
        Key="analiseAWS/Capturas_AWS.json"
    )
    print("Já existe o histórico!")
    inicio = datetime.date.today() - datetime.timedelta(days=2)
except:
    print("Não existe o histórico!")
    inicio = "2025-02-01"

print(f'{inicio} - {fim}') 

response = client.get_cost_and_usage(
    TimePeriod={
        'Start': str(inicio),
        'End': str(fim)
    },
    Granularity='DAILY',
    Metrics=['UnblendedCost', 'UsageQuantity'],
    Filter = {
        "Dimensions": {
        "Key": "SERVICE",
        "Values": [
        "AWS Lambda", 
        "Amazon Simple Storage Service", 
        "EC2 - Other",
        "EC2 - Compute",
        "Amazon Elastic Block",
        "AmazonCloudWatch",
        "Amazon API Gateway"
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

print(json.dumps(response, indent=4))
dadosAws = os.path.join(tempfile.gettempdir(), f'Capturas_AWS.json')

with open(dadosAws, mode='wt') as f:
    json.dump(response, f)

s3.upload_file(
    Filename=dadosAws,
    Bucket='braw-streamline',
    Key=f'analiseAWS/Capturas_AWS.json')