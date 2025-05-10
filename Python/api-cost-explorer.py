import boto3
import requests as req

client = boto3.client('ce')

response = client.get_cost_and_usage(
    TimePeriod={
        'Start': '2025-03-20',
        'End': '2025-05-07'
    },
    Granularity='MONTHLY',
    Metrics=['BLENDED_COST'],   
    GroupBy=[
        {
            'Type': 'DIMENSION',
            'Key': 'SERVICE'
        }
    ],
    Filter = {"Or": [{"Dimensions": {"Key": "SERVICE", "Values": ["AWS Lambda"]}},
        {"Dimensions": {"Key": "SERVICE", "Values": ["Amazon Simple Storage Service"]}},
        {"Dimensions": {"Key": "SERVICE", "Values": ["Amazon Elastic Compute Cloud - Compute"]}}
        ]
    }
)
print(response)
jsonEstruturado = {}
periodo =  response['ResultsByTime'][0]['TimePeriod'] 
jsonEstruturado['Periodo'] = periodo

print(jsonEstruturado)

# requisicao = req.post('http://localhost:3333/apiAws/enviarDados', json=response)

# print(requisicao)