from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from pyngrok import ngrok
from werkzeug.utils import secure_filename

NGROK_AUTH_TOKEN = "" 

openai.api_key = ""

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = '/tmp/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

if __name__ == '__main__':
    ngrok.set_auth_token(NGROK_AUTH_TOKEN)    
    public_url = ngrok.connect(5000)
    print(f"🚀 Public URL: {public_url}")
    
    app.run(port=5000)