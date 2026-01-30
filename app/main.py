import sys
import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

# ---------------------------------------------------------
# 1. SETUP PATHS
# ---------------------------------------------------------
# Add parent directory to path so we can import 'ai'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from ai.model import ClaritasModel
except ImportError as e:
    print(f"❌ Critical Error: Could not import ClaritasModel. {e}")
    sys.exit(1)

# ---------------------------------------------------------
# 2. INITIALIZE APP
# ---------------------------------------------------------
app = FastAPI(
    title="Claritas AI Backend",
    description="API for Cognitive Health Screening (Alzheimer's Detection)",
    version="1.0.0"
)

# Enable CORS for Figma/Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Model Instance
model: Optional[ClaritasModel] = None

@app.on_event("startup")
async def load_model():
    """Load the heavy AI model into memory on startup"""
    global model
    print("⏳ Loading Claritas AI Brain... (This takes ~5-10 seconds)")
    try:
        model = ClaritasModel()
        print("✅ Claritas AI Model Loaded Successfully!")
    except Exception as e:
        print(f"🔥 Model Load Failed: {e}")
        # We don't exit here so the server can still run, 
        # but predictions will fail gracefully.

@app.get("/")
def health_check():
    return {"status": "online", "model_loaded": model is not None}

@app.post("/predict")
async def predict_audio(file: UploadFile = File(...)):
    """
    Endpoint for 'Menganalisis Audio' screen.
    Returns data for 'Hasil Sesi' and 'Detail Teknis'.
    """
    if not model:
        raise HTTPException(status_code=503, detail="AI Model is still loading. Please wait.")

    # 1. Save upload to temp file
    temp_filename = f"temp_{file.filename}"
    
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        print(f"🎤 Processing audio: {file.filename}")
        
        # 2. Run Analysis (Blocking)
        # Note: In production (Layer 2), this moves to Celery
        result = model.predict(audio_path=temp_filename)
        
        # 3. Extract & Format Data for Frontend
        # We map the AI's internal keys to the Figma design labels
        
        acoustic = result['fitur_akustik']
        lexical = result['fitur_leksikal']
        
        response = {
            "status": "success",
            "session_info": {
                "filename": file.filename,
                "duration_seconds": round(acoustic.get('total_duration', 0), 1),
                "predicted_label": result['classification']['predicted_label'],
            },
            
            # --- CARD 1: SKOR UTAMA (Main Scores) ---
            #
            "scores": {
                "risk_band": result['risk_level'].upper(),  # "SEDANG", "TINGGI"
                "fluency_score": round(result['speech_fluency_score'], 0),
                "lexical_score": round(result['fitur_leksikal']['lexical_density'] * 100, 0), # Approximate mapping
                "coherence_score": round(result['lexical_coherence_score'], 0)
            },
            
            # --- CARD 2: DETAIL TEKNIS (Technical Dropdown) ---
            #
            "technical_metrics": {
                "acoustic": {
                    "pause_ratio": round(acoustic['pause_ratio'], 2),             # "Pause Ratio"
                    "mean_pause_duration": round(acoustic['mean_pause_duration'], 2), # "Rata-rata Durasi Jeda"
                    "voice_ratio": round(acoustic['voice_ratio'], 2),             # "Voice Ratio"
                    "long_pauses": acoustic['long_pauses_count']                  # "Jeda Panjang" count
                },
                "lexical": {
                    "speech_rate": round(lexical.get('speech_rate', 0), 1),       # "Speech Rate" (kata/menit)
                    "lexical_density": round(lexical['lexical_density'], 2),      # "Lexical Density"
                    "ttr": round(lexical['ttr'], 2),                              # "Type-Token Ratio"
                    "deictic_ratio": round(lexical['deictic_ratio'], 2),          # "Rasio Kata Deiktik"
                    "repetitions": lexical['total_repetitions']                   # "Repetisi Kata"
                }
            },
            
            # --- CARD 3: TRANSCRIPT (Placeholder) ---
            #
            # Since we don't have Whisper yet, we return an empty list
            # to prevent the frontend from crashing.
            "transcript_segments": [] 
        }
        
        return response

    except Exception as e:
        print(f"🔥 Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        # 4. Cleanup
        if os.path.exists(temp_filename):
            os.remove(temp_filename)