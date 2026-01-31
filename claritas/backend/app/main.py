"""
FastAPI Backend for Claritas - Alzheimer's Detection System
Integrates Google Gemini API for Multimodal Audio Analysis
"""

import sys
import os
import shutil
from pathlib import Path

# Add parent directory to path to import from ../ai if needed
ROOT = Path(__file__).resolve()
while ROOT.name != "claritasweb" and ROOT.parent != ROOT:
    ROOT = ROOT.parent
sys.path.insert(0, str(ROOT))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import traceback

from .utils import save_upload_to_temp, convert_audio_to_wav, detect_audio_format
from .services.gemini_service import GeminiService

app = FastAPI(
    title="Claritas Backend API",
    description="AI-powered audio analysis using Google Gemini"
)

# Allow cross origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Service
gemini_service = GeminiService()

class AnalysisResult(BaseModel):
    """Response model returned by the audio analysis endpoint."""
    speech_fluency: float
    lexical_score: float
    coherence_score: float
    risk_band: str
    summary: str
    technical: Dict[str, Any]


print("\n" + "="*60)
print("🚀 CLARITAS BACKEND v2.0 (GEMINI ENABLED) STARTING...")
print("="*60 + "\n")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Claritas Backend API (Gemini Powered)",
        "status": "running",
        "model": "gemini-1.5-flash"
    }


@app.post("/analyze-audio", response_model=AnalysisResult)
async def analyze_audio(file: UploadFile = File(...)) -> AnalysisResult:
    """
    Accept an audio recording and return cognitive health analysis.
    Uses Google Gemini API for multimodal analysis.
    """
    
    # === Validation ===
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # === Read uploaded file ===
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")
    
    if not content or len(content) < 100:
        raise HTTPException(status_code=400, detail="File too small")
    
    # === Save to temp file ===
    detected_format = detect_audio_format(content)
    print(f"📁 Processing file: {file.filename} ({len(content)} bytes, {detected_format})")
    
    temp_input_path = None
    
    try:
        # Save original file
        temp_input_path = save_upload_to_temp(content, suffix=detected_format)
        
        # === Call Gemini API ===
        print("🚀 Sending to Gemini Service...")
        ai_result = gemini_service.analyze_audio(temp_input_path)
        
        # === Format Response ===
        result = _format_gemini_response(ai_result, len(content))
        
        print(f"✅ Analysis complete: {result.risk_band}")
        return result
        
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )
    finally:
        # === Cleanup ===
        if temp_input_path and os.path.exists(temp_input_path):
            try:
                os.unlink(temp_input_path)
            except:
                pass


def _format_gemini_response(ai_result: Dict, file_size: int) -> AnalysisResult:
    """Map Gemini JSON to frontend API schema"""
    
    technical = ai_result.get("technical_details", {})
    
    # Ensure acoustic/lexical features exist
    if "acoustic_features" not in technical:
        technical["acoustic_features"] = {}
    if "lexical_features" not in technical:
        technical["lexical_features"] = {}
        
    # Add metadata
    technical["uploaded_bytes"] = file_size
    technical["model_provider"] = "Google Gemini 1.5 Flash"
    
    return AnalysisResult(
        speech_fluency=float(ai_result.get("speech_fluency_score", 0)),
        lexical_score=float(ai_result.get("lexical_coherence_score", 0)),
        coherence_score=float(technical.get("coherence_score", 0)),  # Often inside technical
        risk_band=ai_result.get("risk_band", "Sedang"),
        summary=ai_result.get("summary", "Tidak ada ringkasan."),
        technical=technical
    )