
import os
import sys
from dotenv import load_dotenv
import google.generativeai as genai

# Load env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

print(f"🔑 API Key loaded: {'Yes' if api_key else 'No'}")
if api_key:
    print(f"🔑 Key fragment: {api_key[:5]}...")

try:
    import google.generativeai as genai
    print("✅ google-generativeai imported successfully")
except ImportError as e:
    print(f"❌ Failed to import google-generativeai: {e}")
    sys.exit(1)

if not api_key:
    print("❌ Error: Message 'GEMINI_API_KEY' not found in .env")
    sys.exit(1)

genai.configure(api_key=api_key)

try:
    print("🤖 Testing simple text generation...")
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello, are you online?")
    print(f"✅ Response received: {response.text}")
except Exception as e:
    print(f"❌ Gemini API Error: {e}")
