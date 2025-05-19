from jira import JIRA

jira_options = {'server': 'https://bancostreamline.atlassian.net/'}
jira_login = {'username': 'bancostreamline@gmail.com', 'password': 'Urubu@100'}
jira = JIRA(options=jira_options, **jira_login)

issue_fields = {
    'project': {'key': 'G1ALERTAS'},
    'issuetype': {'name': 'Alertas de hardware'},
    'summary': f'Falha de {componente} no atm {fkAtm}',
    'description': f'O ATM de ID {fkAtm} apresentou falha no {componente} no valor de {valor}.',
    'priority': {'name': categoria}
}

new_issue = jira.create_issue(fields=issue_fields)
print(f"Issue criado com sucesso: {new_issue.key}")