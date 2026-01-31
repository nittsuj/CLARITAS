
import os
import json
import google.generativeai as genai
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class GeminiService:
    def __init__(self):
        # Switching to specific version 001 to resolve 404/429 errors
        self.model_name = "gemini-1.5-flash-001"
        print(f"🤖 GeminiService initialized with model: {self.model_name}")
        self.model = genai.GenerativeModel(self.model_name)

    def analyze_audio(self, audio_path: str) -> Dict[str, Any]:
        """
        Uploads audio to Gemini and requests cognitive health analysis.
        Returns a structured dictionary with scores and details.
        """
        # Logging to file for debugging
        with open("debug_gemini.log", "a", encoding="utf-8") as f:
            f.write(f"\n--- New Request ---\n")
            f.write(f"Model: {self.model_name}\n")
            f.write(f"API Key present: {bool(api_key)}\n")
            if api_key:
                f.write(f"API Key start: {api_key[:5]}...\n")
            f.write(f"Audio Path: {audio_path}\n")

        if not api_key:
            with open("debug_gemini.log", "a") as f: f.write("❌ ERROR: API Key missing\n")
            raise ValueError("GEMINI_API_KEY not found in .env")

        try:
            import time
            start_time = time.time()
            
            print(f"⏱️  [{time.strftime('%H:%M:%S')}] Starting Gemini Analysis ({self.model_name})...")
            print(f"📤 Uploading file to Gemini: {audio_path}")
            
            upload_start = time.time()
            audio_file = genai.upload_file(path=audio_path)
            upload_duration = time.time() - upload_start
            print(f"✅ Upload Complete ({upload_duration:.2f}s)")
            
            with open("debug_gemini.log", "a") as f: 
                f.write(f"Upload success in {upload_duration:.2f}s\n")
                f.write(f"File URI: {audio_file.uri}\n")
            
            print("🤖 Sending prompt to Gemini (Inference)...")
            inference_start = time.time()
            prompt = """
            Analyze this audio recording of a patient performing a cognitive assessment task (Picture Description or Sentence Reading).
            Act as an expert neurologist and speech pathologist.
            
            Assess the patient for signs of Mild Cognitive Impairment (MCI) or Alzheimer's Disease (AD) based on:
            1. Speech Fluency (pauses, rate, flow)
            2. Lexical Complexity (vocabulary, sentence structure)
            3. Coherence (relevance, logic)

            Return ONLY a valid JSON object with the following structure (no markdown formatting):
            {
                "speech_fluency_score": float (0-100),
                "lexical_coherence_score": float (0-100),
                "risk_band": "Baik" | "Sedang" | "Buruk",
                "summary": "A concise expert clinical summary (in Indonesian) explaining the diagnosis and key observations.",
                "technical_details": {
                    "acoustic_features": {
                        "pause_ratio": float (0.0-1.0),
                        "mean_pause_duration": float (seconds),
                        "speech_rate": float (words/min),
                        "voice_ratio": float (0.0-1.0),
                        "short_pauses_count": int,
                        "long_pauses_count": int
                    },
                    "lexical_features": {
                        "ttr": float (0.0-1.0, Type-Token Ratio),
                        "lexical_density": float (0.0-1.0),
                        "deictic_ratio": float (0.0-1.0),
                        "total_repetitions": int,
                        "speech_rate": float (words/min, same as acoustic)
                    },
                    "coherence_score": float (0-100)
                }
            }
            
            IMPORTANT: Provide REALISTIC estimates for the technical metrics based on the audio evidence.
            """

            response = self.model.generate_content([prompt, audio_file])
            
            # Clean response text (sometimes Gemini adds ```json block)
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            
            result = json.loads(text.strip())
            print("✅ Gemini Analysis Complete")
            
            with open("debug_gemini.log", "a") as f: f.write("✅ Analysis Success\n")
            return result
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Gemini Error: {error_msg}")
            with open("debug_gemini.log", "a", encoding="utf-8") as f: 
                f.write(f"❌ EXCEPTION: {error_msg}\n")
                import traceback
                traceback.print_exc(file=f)
                
            # Fallback mock data if API fails (prevent crash)
            return self._get_fallback_data(error_msg)

    def _get_fallback_data(self, error_msg=""):
        """Returns mock data structure in case of API failure"""
        return {
            "speech_fluency_score": 0,
            "lexical_coherence_score": 0,
            "risk_band": "Sedang",
            "summary": f"Gagal [Model: {self.model_name}]: {error_msg}. Coba refresh/rekam ulang.",
            "technical_details": {
                "acoustic_features": {},
                "lexical_features": {},
                "coherence_score": 0
            }
        }
