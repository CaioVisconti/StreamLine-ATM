import boto3
import requests as req
import os
import json
import tempfile
from datetime import datetime


client = boto3.client('ce')
s3 = boto3.client('s3')

response = client.get_cost_and_usage(
    TimePeriod={
        'Start': '2025-03-20',
        'End': '2025-05-13'
    },
    Granularity='MONTHLY',
    Metrics=['UnblendedCost'],   
    GroupBy=[
        {
            'Type': 'DIMENSION',
            'Key': 'SERVICE'
        }
    ],
    Filter = {
        "Dimensions": {
        "Key": "SERVICE",
        "Values": ["AWS Lambda", 
        "Amazon Simple Storage Service", 
        "Amazon Elastic Compute Cloud - Compute"]
        }
        }
        
)

# dadosAws = os.path.join(tempfile.gettempdir(), f'Capturas_AWS_{datetime.now().strftime('%d-%m-%Y_%H-%M-%S')}.json')

# with open(dadosAws, mode='wt') as f:
#     json.dump(response, f)

# s3.upload_file(
#     Filename=dadosAws,
#     Bucket='brawstreamline',
#     Key=f'analiseAWS/Capturas_AWS_{datetime.now()}.json')

print(response)