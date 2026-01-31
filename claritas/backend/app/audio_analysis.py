"""
Simple audio analysis module.

At the time of the hackathon we cannot run sophisticated speech analysis
models, so this module computes synthetic metrics based on the size of
the uploaded audio file.  It is separated from the FastAPI route so
that a real model can be dropped in later without changing the API
surface.
"""
from typing import Dict
import numpy as np


def analyze_audio_content(content: bytes) -> Dict[str, float]:
    """
    Produce fake analysis metrics from the raw file content.

    The function interprets the byte sequence as numerical data using
    NumPy to generate deterministic but pseudo‑random scores.  The
    resulting metrics roughly fall within [40, 90] and change with
    different input lengths.
    """
    # Convert bytes to integers in range [0, 255]
    arr = np.frombuffer(content, dtype=np.uint8)
    if arr.size == 0:
        # No data at all; return mid‑range scores
        return {"speech_fluency": 60.0, "lexical_score": 60.0, "coherence_score": 60.0}

    # Use the first few values to seed deterministic random values
    seed = int(arr[:4].mean()) if arr.size >= 4 else int(arr.mean())
    rng = np.random.default_rng(seed)
    # Generate three scores between 40 and 90
    speech_fluency = float(rng.uniform(50, 90))
    lexical_score = float(rng.uniform(40, 85))
    coherence_score = float(rng.uniform(45, 80))
    return {
        "speech_fluency": round(speech_fluency, 2),
        "lexical_score": round(lexical_score, 2),
        "coherence_score": round(coherence_score, 2),
    }