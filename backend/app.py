from flask import Flask, jsonify

# Assuming github_tracker.py is in the same directory
from github_tracker import get_github_activity

app = Flask(__name__)

# New route for the root URL ("/")
@app.route('/', methods=['GET'])
def index():
    """
    Handles requests to the root URL.
    Returns a simple message or can be expanded to serve an HTML page.
    """
    return "Welcome to the GitHub Activity Tracker! Navigate to /api/github-activity to see data."

@app.route('/api/github-activity', methods=['GET'])
def github_activity():
    """
    Handles requests to the /api/github-activity endpoint.
    Fetches GitHub activity data and returns it as JSON.
    """
    try:
        data = get_github_activity()
        return jsonify(data)
    except Exception as e:
        # Basic error handling for the API endpoint
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask application in debug mode for development
    # debug=True allows for automatic reloading on code changes and provides a debugger
    app.run(debug=True)
