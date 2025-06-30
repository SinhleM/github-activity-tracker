import requests
import pandas as pd
import os
from dotenv import load_dotenv
import json # Import json for safer parsing

load_dotenv()

USERNAME = os.getenv("GITHUB_USERNAME")
TOKEN = os.getenv("GITHUB_TOKEN")
# Make sure your token is valid and has the 'repo' scope.
headers = {'Authorization': f'token {TOKEN}'}

def get_github_activity():
    url = f"https://api.github.com/users/{USERNAME}/repos"
    response = requests.get(url, headers=headers)

    # Check if the request was successful
    if response.status_code != 200:
        # Try to parse as JSON, but fall back to text if it's not JSON
        try:
            error_message_body = response.json()
        except json.JSONDecodeError:
            error_message_body = response.text # If not JSON, get the raw text (which might be HTML)
        
        return {"error": f"GitHub API error: {response.status_code}", "message": error_message_body}

    repos = response.json()
    
    # Check if the response is a list (as expected)
    if not isinstance(repos, list):
        return {"error": "Unexpected API response format", "data": repos}

    data = []
    for repo in repos:
        repo_name = repo['name']

        # Commits
        commits_url = f"https://api.github.com/repos/{USERNAME}/{repo_name}/commits"
        commits_resp = requests.get(commits_url, headers=headers, params={'per_page': 1})
        
        total_commits = 0 # Default to 0
        if commits_resp.status_code == 200:
            if 'Link' in commits_resp.headers:
                last_link = [link for link in commits_resp.headers['Link'].split(',') if 'rel="last"' in link]
                if last_link:
                    total_commits = int(last_link[0].split('page=')[-1].split('>')[0])
                elif commits_resp.json(): # Changed to safer access
                    total_commits = len(commits_resp.json())
            elif commits_resp.json(): # Changed to safer access
                total_commits = len(commits_resp.json())


        # Languages
        lang_url = f"https://api.github.com/repos/{USERNAME}/{repo_name}/languages"
        lang_resp = requests.get(lang_url, headers=headers)
        # Safer parsing for languages as well
        try:
            languages = ', '.join(lang_resp.json().keys()) if lang_resp.status_code == 200 else "N/A"
        except json.JSONDecodeError:
            languages = "N/A (Failed to parse languages)"


        data.append({
            'repo': repo_name,
            'commits': total_commits,
            'languages': languages
        })

    df = pd.DataFrame(data)
    df.to_json("github_data.json", orient="records", indent=4) # Using indent for readability
    return data