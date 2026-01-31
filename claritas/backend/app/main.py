"""
FastAPI Backend for Claritas - Alzheimer's Detection System
Integrates ClaritasModel (CNN-LSTM + ML Ensemble) for real-time audio analysis
"""

import sys
import os
from pathlib import Path

# Add parent directory to path to import from ../ai
ROOT = Path(__file__).resolve()
while ROOT.name != "CLARITAS" and ROOT.parent != ROOT:
    ROOT = ROOT.parent
sys.path.insert(0, str(ROOT))

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Header
from sqlalchemy.orm import Session as OrmSession
import json
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import traceback

from .utils import save_upload_to_temp, convert_audio_to_wav, detect_audio_format

from .db import Base, engine, SessionLocal, get_db
from .models import User, Session as SessionModel

claritas_model = None
whisper_model = None

Base.metadata.create_all(bind=engine)

def get_or_create_user(db: OrmSession, email: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user

    user = User(email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


app = FastAPI(
    title="Claritas Backend API",
    description="AI-powered audio analysis for cognitive health assessment"
)

# Allow cross origin requests from all origins – helpful for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalysisResult(BaseModel):
    """Response model returned by the audio analysis endpoint."""
    speech_fluency: float
    lexical_score: float
    coherence_score: float
    risk_band: str
    summary: str
    technical: Dict[str, Any]


@app.on_event("startup")
async def load_model():
    """
    Load ClaritasModel once at server startup.
    This prevents reloading heavy models (2GB+) on every request.
    """
    global claritas_model, whisper_model
    
    print("\n" + "="*60)
    print("🚀 CLARITAS BACKEND STARTUP")
    print("="*60)
    
    try:
        # Import here to catch import errors gracefully
        from ai import ClaritasModel
        import whisper
        
        print("📦 Loading ClaritasModel (this may take 10-30 seconds)...")
        claritas_model = ClaritasModel()
        
        print("📦 Loading WhisperModel (this may take 10-30 seconds)...")
        whisper_model = whisper.load_model("base")

        print("✅ Model loaded successfully!")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ FATAL ERROR: Failed to load AI model")
        print(f"Error: {e}")
        print(f"\nTraceback:")
        traceback.print_exc()
        print("\n" + "="*60)
        print("⚠️  Server will start but /analyze-audio will not work")
        print("="*60 + "\n")


@app.get("/")
async def root():
    """Health check endpoint"""
    model_status = "loaded" if claritas_model is not None else "not loaded"
    whisper_status = "loaded" if whisper_model is not None else "not loaded"
    return {
        "service": "Claritas Backend API",
        "status": "running",
        "model_status": model_status,
        "whisper_status": whisper_status,
    }

@app.post("/analyze-audio", response_model=AnalysisResult)
async def analyze_audio(
    file: UploadFile = File(...),
    x_user_email: str = Header(..., alias="X-User-Email"),
    db: OrmSession = Depends(get_db),
) -> AnalysisResult:
    """
    Accept an audio recording and return cognitive health analysis.
    
    Process:
    1. Validate file upload
    2. Save to temporary file
    3. Convert to WAV if needed (for .webm compatibility)
    4. Run ClaritasModel.predict()
    5. Map AI results to response schema
    6. Clean up temp files
    """
    
    # === Validation ===
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    if claritas_model is None or whisper_model is None:
        raise HTTPException(
            status_code=503,
            detail="AI models not loaded. Check server startup logs."
        )

    
    # === Read uploaded file ===
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to read uploaded file: {str(e)}"
        )
    
    if not content or len(content) < 100:  # Minimum viable audio file
        raise HTTPException(status_code=400, detail="Uploaded file is empty or too small")
    
    # === Detect format and save to temp file ===
    detected_format = detect_audio_format(content)
    print(f"📁 Received file: {file.filename} ({len(content)} bytes, detected: {detected_format})")
    
    # Save uploaded bytes to temp file
    temp_input_path = None
    temp_wav_path = None
    
    try:
        # Save original file
        temp_input_path = save_upload_to_temp(content, suffix=detected_format)
        
        # === Convert to WAV if needed ===
        # librosa can handle most formats, but .webm often fails
        # So we convert .webm (and other problematic formats) to WAV using ffmpeg
        needs_conversion = detected_format in [".webm", ".unknown"]
        
        if needs_conversion:
            print(f"🔄 Converting {detected_format} to WAV using ffmpeg...")
            try:
                temp_wav_path = convert_audio_to_wav(temp_input_path)
                audio_path_for_model = temp_wav_path
                print(f"✅ Conversion successful")
            except RuntimeError as e:
                # If conversion fails, try librosa anyway (might work for some files)
                print(f"⚠️  ffmpeg conversion failed: {e}")
                print(f"⚠️  Attempting to use original file with librosa...")
                audio_path_for_model = temp_input_path
        else:
            # Use original file directly (.wav, .mp3, etc.)
            audio_path_for_model = temp_input_path
        
        # === Run AI Model ===
        print(f"🤖 Running ClaritasModel.predict()...")
        
        try:

            # Transcribe audio to text
            transcription = whisper_model.transcribe(audio_path_for_model)
            pure_text = transcription.get("text", "").strip()

            # Run Claritas prediction
            ai_result = claritas_model.predict(
                audio_path=audio_path_for_model,
                text=pure_text
            )

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"AI model prediction failed: {str(e)}"
            )

        
        # === Map AI results to response schema ===
        result = _format_response(ai_result, content)

        # 1) Get/Create user
        user = get_or_create_user(db, x_user_email)

        # 2) Insert session row
        session_row = SessionModel(
            user_id=user.id,
            task_type=None,        # nanti kita isi dari FE
            duration_sec=None,     # nanti kita isi dari FE
            speech_fluency=result.speech_fluency,
            lexical_score=result.lexical_score,
            coherence_score=result.coherence_score,
            risk_band=result.risk_band,
            summary=result.summary,
            technical_json=json.dumps(result.technical),
        )

        db.add(session_row)
        db.commit()
        db.refresh(session_row)

        print(f"✅ Analysis complete: {result.risk_band} (session_id={session_row.id})")
        return result
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Catch any other unexpected errors
        print(f"❌ Unexpected error: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
    finally:
        # === Cleanup temp files ===
        if temp_input_path and os.path.exists(temp_input_path):
            try:
                os.unlink(temp_input_path)
            except:
                pass
        
        if temp_wav_path and os.path.exists(temp_wav_path):
            try:
                os.unlink(temp_wav_path)
            except:
                pass


def _format_response(ai_result: Dict, original_file_bytes: bytes) -> AnalysisResult:
    """
    Convert ClaritasModel output to API response schema.
    
    AI Model Output:
    {
        'speech_fluency_score': float (0-100),
        'lexical_coherence_score': float (0-100),
        'classification': {...},
        'risk_level': 'low' | 'medium' | 'high',
        'fitur_akustik': {...},
        'fitur_leksikal': {...}
    }
    
    API Response Schema:
    {
        'speech_fluency': float,
        'lexical_score': float,
        'coherence_score': float,
        'risk_band': 'Baik' | 'Sedang' | 'Buruk',
        'summary': str,
        'technical': {...}
    }
    """
    
    # Extract scores
    fluency = ai_result['speech_fluency_score']
    lexical = ai_result['lexical_coherence_score']
    
    # For coherence_score, use lexical score (they represent similar concepts)
    # In future, you can add a separate coherence metric if needed
    coherence = lexical
    
    # Map risk_level to Indonesian risk bands
    risk_mapping = {
        'low': 'Baik',      # Good cognitive health
        'medium': 'Sedang', # Moderate risk
        'high': 'Buruk'     # High risk
    }
    risk_band = risk_mapping.get(ai_result['risk_level'], 'Sedang')
    
    # Get classification details
    classification = ai_result['classification']
    predicted_class = classification['predicted_class']
    confidence = classification['confidence'] * 100  # Convert to percentage
    
    # Generate summary in Indonesian
    class_labels = {
        'HC': 'sehat',
        'MCI': 'gangguan kognitif ringan',
        'AD': 'Alzheimer'
    }
    class_label_id = class_labels.get(predicted_class, 'tidak diketahui')
    
    summary = (
        f"Skor kelancaran bicara {fluency:.0f}, skor leksikal {lexical:.0f}, dan "
        f"koherensi {coherence:.0f}. "
        f"Prediksi AI: {class_label_id} (keyakinan {confidence:.0f}%). "
        f"Tingkat risiko: {risk_band}."
    )
    
    # Technical details for debugging/transparency
    technical = {
        "uploaded_bytes": len(original_file_bytes),
        "ai_classification": predicted_class,
        "confidence": confidence,
        "probabilities": classification['probabilities'],
        "acoustic_features": {
            k: round(v, 3) if isinstance(v, float) else v
            for k, v in list(ai_result['fitur_akustik'].items())[:5]  # First 5 for brevity
        },
        "model_version": "1.0.0"
    }
    
    return AnalysisResult(
        speech_fluency=round(fluency, 1),
        lexical_score=round(lexical, 1),
        coherence_score=round(coherence, 1),
        risk_band=risk_band,
        summary=summary,
        technical=technical
    )