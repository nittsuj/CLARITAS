from ai import ClaritasModel, generate_clinical_report
import json


TEXT_TRANSCRIPT_PATH = "ai/data/CN TXT.txt"
AUDIO_FILE_PATH = "ai/data/CN WAV.wav"

"""Example for API integration"""
print("\n" + "=" * 60)
print("FULL PIPELINE: API Response Format")
print("=" * 60)

model = ClaritasModel()

result = model.predict(audio_path=AUDIO_FILE_PATH, text=TEXT_TRANSCRIPT_PATH)

# Format for API response
api_response = {
    "status": "success",
    "data": {
        "prediction": {
            "class": result["classification"]["predicted_class"],
            "label": result["classification"]["predicted_label"],
            "confidence": result["classification"]["confidence"],
            "probabilities": result["classification"]["probabilities"],
        },
        "scores": {
            "speech_fluency": result["speech_fluency_score"],
            "lexical_coherence": result["lexical_coherence_score"],
        },
        "risk_assessment": {
            "level": result["risk_level"],
            "description": {
                "low": "No significant cognitive impairment detected",
                "medium": "Mild cognitive changes observed",
                "high": "Significant cognitive impairment detected",
            }[result["risk_level"]],
        },
        "features": {
            "acoustic": {
                "pause_ratio": result["fitur_akustik"]["pause_ratio"],
                "voice_ratio": result["fitur_akustik"]["voice_ratio"],
            },
            "lexical": {
                "ttr": result["fitur_leksikal"]["ttr"],
                "lexical_density": result["fitur_leksikal"]["lexical_density"],
                "speech_rate": result["fitur_leksikal"]["speech_rate"],
                "repetition_ratio": result["fitur_leksikal"]["total_repetitions"],
            },
        },
    },
}

print("\nAPI Response (JSON):")
print(json.dumps(api_response, indent=2))

with open(TEXT_TRANSCRIPT_PATH, "r", encoding="utf-8") as f:
    transcript_text = f.read().strip()

report = generate_clinical_report(api_response, transcript_text)

# Print Output
print("\nGenerated Clinical Report:")
print(TEXT_TRANSCRIPT_PATH)
print(AUDIO_FILE_PATH)
print(json.dumps(report, indent=2, ensure_ascii=False))
