import boto3
import os
import json
import tempfile
from datetime import datetime


client = boto3.client('ce', region_name='us-east-1')
s3 = boto3.client('s3')
diaAtual = str(datetime.now().strftime("%Y-%m-%d"))

response = client.get_cost_and_usage(
    TimePeriod={
        'Start': '2025-01-01',
        'End': diaAtual
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

# s3.upload_file(
#     Filename=dadosAws,
#     Bucket='brawstreamline2',
#     Key=f'analiseAWS/Capturas_AWS.json')