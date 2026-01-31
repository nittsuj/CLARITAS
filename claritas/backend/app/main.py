from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

from .audio_analysis import analyze_audio_content

app = FastAPI(title="Claritas Backend API", description="API for audio analysis")

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


@app.post("/analyze-audio", response_model=AnalysisResult)
async def analyze_audio(file: UploadFile = File(...)) -> AnalysisResult:
    """
    Accept an audio recording and return simple analysis metrics.

    The current implementation uses the size of the uploaded file as a
    surrogate feature.  In a production system this function should
    call a proper speech analysis model.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    # Compute naive metrics based on file length
    metrics = analyze_audio_content(content)
    speech_fluency = metrics["speech_fluency"]
    lexical_score = metrics["lexical_score"]
    coherence_score = metrics["coherence_score"]

    # Determine a risk band – purely illustrative
    avg_score = (speech_fluency + lexical_score + coherence_score) / 3.0
    if avg_score >= 70:
        risk_band = "Baik"
    elif avg_score >= 50:
        risk_band = "Sedang"
    else:
        risk_band = "Buruk"

    # Generate a simple summary – in practice this would come from an LLM
    summary = (
        f"Skor kelancaran bicara {speech_fluency:.0f}, skor leksikal {lexical_score:.0f} dan "
        f"koherensi {coherence_score:.0f}. Secara keseluruhan tingkat risiko adalah {risk_band}."
    )
    technical = {
        "uploaded_bytes": len(content),
        "average_score": avg_score,
    }

    return AnalysisResult(
        speech_fluency=speech_fluency,
        lexical_score=lexical_score,
        coherence_score=coherence_score,
        risk_band=risk_band,
        summary=summary,
        technical=technical,
    )