import requests
import pandas as pd
import os
from dotenv import load_dotenv
import json

load_dotenv()

USERNAME = os.getenv("GITHUB_USERNAME")
TOKEN = os.getenv("GITHUB_TOKEN")
headers = {'Authorization': f'token {TOKEN}'}

def get_github_activity():
    url = f"https://api.github.com/users/{USERNAME}/repos"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        try:
            error_message_body = response.json()
        except json.JSONDecodeError:
            error_message_body = response.text
        return {"error": f"GitHub API error: {response.status_code}", "message": error_message_body}

    repos = response.json()

    if not isinstance(repos, list):
        return {"error": "Unexpected API response format", "data": repos}

    data = []
    for repo in repos:
        repo_name = repo['name']

        # Commits
        commits_url = f"https://api.github.com/repos/{USERNAME}/{repo_name}/commits"
        commits_resp = requests.get(commits_url, headers=headers, params={'per_page': 1})

        total_commits = 0
        if commits_resp.status_code == 200:
            if 'Link' in commits_resp.headers:
                last_link = [link for link in commits_resp.headers['Link'].split(',') if 'rel="last"' in link]
                if last_link:
                    total_commits = int(last_link[0].split('page=')[-1].split('>')[0])
                elif commits_resp.json():
                    total_commits = len(commits_resp.json())
            elif commits_resp.json():
                total_commits = len(commits_resp.json())

        # Languages
        lang_url = f"https://api.github.com/repos/{USERNAME}/{repo_name}/languages"
        lang_resp = requests.get(lang_url, headers=headers)
        try:
            languages = ', '.join(lang_resp.json().keys()) if lang_resp.status_code == 200 else "N/A"
        except json.JSONDecodeError:
            languages = "N/A (Failed to parse languages)"

        # ADDED: Fetch stargazers_count and forks_count directly from the repo object
        stargazers_count = repo.get('stargazers_count', 0)
        forks_count = repo.get('forks_count', 0)

        data.append({
            'repo': repo_name,
            'commits': total_commits,
            'languages': languages,
            'stars': stargazers_count, # ADDED
            'forks': forks_count # ADDED
        })

    df = pd.DataFrame(data)
    df.to_json("github_data.json", orient="records", indent=4)
    return data