import { API_BASE_URL } from '../config/api';

export interface AnalysisResult {
    speech_fluency: number;
    lexical_score: number;
    coherence_score: number;
    risk_band: 'Baik' | 'Sedang' | 'Buruk';
    summary: string;
    technical: {
        uploaded_bytes: number;
        ai_classification: 'HC' | 'MCI' | 'AD';
        confidence: number;
        probabilities: Record<string, number>;
        acoustic_features: Record<string, number>;
        model_version: string;
    };
}

export async function analyzeAudio(audioBlob: Blob): Promise<AnalysisResult> {
    const formData = new FormData();

    // Use File for better compatibility + keeps mimeType
    const type = audioBlob.type || 'audio/webm';
    const ext = type.includes('mp4') ? 'mp4' : 'webm';
    const file = new File([audioBlob], `recording.${ext}`, { type });

    formData.append('file', file); // MUST be "file"

    const response = await fetch(`${API_BASE_URL}/analyze-audio`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        // FastAPI usually returns JSON: {"detail": "..."}
        let message = `API Error (${response.status})`;
        try {
            const err = await response.json();
            message = err?.detail ? `${message}: ${err.detail}` : `${message}: ${JSON.stringify(err)}`;
        } catch {
            const text = await response.text().catch(() => '');
            if (text) message = `${message}: ${text}`;
        }
        throw new Error(message);
    }

    return response.json();
}
