from jira import JIRA

jira_options = {'server': 'https://streamlineatm-1741820046277.atlassian.net/jira/your-work'}
jira_login = {'username': 'streamlineatm@gmail.com', 'password': 'SPTechUrubu100'}
jira = JIRA(options=jira_options, **jira_login)

issue_fields = {
    'project': {'key': 'PROJECT_KEY'},
    'issuetype': {'name': 'Bug'},
    'summary': 'Bug na tela de login',
    'description': 'Detalhes do bug',
    'priority': {'name': 'High'}
}

new_issue = jira.create_issue(fields=issue_fields)
print(f"Issue criado com sucesso: {new_issue.key}")