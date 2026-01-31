import os
import json
import time
import re
import google.generativeai as genai
from dotenv import load_dotenv
from google.api_core import exceptions

# 1. Load API Key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("WARNING: GEMINI_API_KEY not found in .env")

genai.configure(api_key=api_key)

# --- GROUND TRUTH ---
COOKIE_THEFT_DESC = (
    "The image depicts a chaotic kitchen scene where a woman stands oblivious to an "
    "overflowing sink while two children behind her attempt to steal cookies, "
    "with the boy perilously balanced on a tipping stool."
)


def clean_and_parse_json(text_res):
    """
    Robust function to extract JSON from LLM text.
    """
    try:
        return json.loads(text_res)
    except json.JSONDecodeError:
        # Regex to find the JSON block { ... }
        match = re.search(r"\{[\s\S]*\}", text_res)
        if match:
            json_str = match.group(0)
            try:
                return json.loads(json_str)
            except:
                pass
    return None


def generate_clinical_report(
    api_response, transcript, image_ground_truth=COOKIE_THEFT_DESC
):

    # --- Extract Data ---
    data = api_response["data"]
    feats = data["features"]

    pred_label = data["prediction"]["label"]
    confidence = data["prediction"]["confidence"]
    fluency_score = data["scores"]["speech_fluency"]
    coherence_score = data["scores"]["lexical_coherence"]

    pause_ratio = feats["acoustic"]["pause_ratio"]
    speech_rate = feats["lexical"]["speech_rate"]
    ttr = feats["lexical"]["ttr"]
    repetitions = feats["lexical"]["repetition_ratio"]

    # --- Construct Prompt ---
    prompt = f"""
    Role: You are an expert Neurologist analyzing a patient's description of the 'Cookie Theft' picture.
    
    **Context (The Image Ground Truth):**
    "{image_ground_truth}"
    
    **Patient Data:**
    - Diagnosis Prediction: {pred_label} (Confidence: {confidence:.2f})
    - Transcript: "{transcript}"
    
    **Quantitative Metrics:**
    - Speech Fluency Score: {fluency_score:.2f} (Rate: {speech_rate:.0f} wpm, Pause Ratio: {pause_ratio:.2f})
    - Lexical/Coherence Score: {coherence_score:.2f}
    - Vocabulary Diversity (TTR): {ttr:.2f}
    - Repetitions: {repetitions}
    
    **Task:**
    Generate a JSON response containing exactly 4 clinical insight sentences in **Indonesian**.
    
    1. **overall**: A 1-sentence summary. Compare the Patient Transcript against the Image Ground Truth. Does the patient mention the key elements (water, cookies, falling)? Combine this with the prediction ({pred_label}).
    2. **fluency**: Analyze tempo and pauses based on the metrics provided.
    3. **lexical**: Analyze vocabulary usage (TTR) and word choice.
    4. **coherence**: Analyze if the patient's story makes logical sense compared to the Ground Truth image.
    
    **Required JSON Output Format:**
    {{
      "overall": "...",
      "fluency": "...",
      "lexical": "...",
      "coherence": "..."
    }}
    """

    # --- MODEL FALLBACK LIST ---
    # We try models in this order based on your available list
    models_to_try = [
        "gemini-2.0-flash-lite-001",  # Try Lite first (often lower quota usage)
        "gemini-flash-latest",  # Try the generic alias
        "gemini-2.0-flash",  # Try the standard flash
    ]

    for model_name in models_to_try:
        print(f"🔄 Trying model: {model_name}...")
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)

            # Robust Parsing
            parsed_json = clean_and_parse_json(response.text)

            if parsed_json:
                return parsed_json
            else:
                # If JSON parsing failed, just continue to next model/retry logic
                print(f"⚠️ Failed to parse JSON from {model_name}")

        except exceptions.ResourceExhausted:
            print(f"⚠️ Quota exceeded for {model_name}. Trying next model...")
            time.sleep(1)  # Short pause before switching
            continue

        except Exception as e:
            print(f"⚠️ Error with {model_name}: {e}")
            # If it's a 404 (Not Found), we simply continue to the next model
            continue

    # If ALL models fail
    return {
        "overall": "Gagal menghasilkan laporan (API Error/Quota).",
        "fluency": "Analisis tidak tersedia.",
        "lexical": "-",
        "coherence": "-",
    }
