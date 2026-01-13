"""
Configuration for Claritas AI Model
"""

import os
from pathlib import Path


class ModelConfig:
    """Configuration settings for Claritas model"""
    
    # Audio processing parameters
    SAMPLE_RATE = 16000
    MAX_AUDIO_LENGTH = 10  # seconds
    FRAME_DURATION_MS = 30
    VAD_AGGRESSIVENESS = 1
    
    # Model paths (relative to ai/ folder)
    BASE_DIR = Path(__file__).parent
    MODELS_DIR = BASE_DIR / "models"
    SCALER_PATH = MODELS_DIR / "feature_scaler.pkl"
    RF_MODEL_PATH = MODELS_DIR / "random_forest_full.pkl"
    XGB_MODEL_PATH = MODELS_DIR / "xgboost_full.pkl"
    
    CAT_FINAL_PATH = MODELS_DIR / "catboost_final.pkl"
    LGBM_FINAL_PATH = MODELS_DIR / "lightgbm_final.pkl"
    RF_FINAL_PATH = MODELS_DIR / "random_forest_final.pkl"
    XGB_FINAL_PATH = MODELS_DIR / "xgboost_final.pkl"
    CNN_LSTM_FINAL_PATH = MODELS_DIR / "cnn_lstm_final.pt"
    
    # Acoustic feature names (A1-A5 + prosody) - 17 features
    ACOUSTIC_FEATURES = [
        'pause_ratio',              # A1
        'mean_pause_duration',      # A2
        'std_pause_duration',
        'max_pause_duration',
        'num_pauses',
        'short_pauses_count',
        'long_pauses_count',
        'voice_ratio',              # A5
        'speech_duration',
        'total_duration',
        'mean_pitch',               # Prosody
        'std_pitch',
        'pitch_range',
        'mean_energy',
        'std_energy',
        'mean_zcr',
        'std_zcr'
    ]
    
    # Lexical feature names (L1-L5) - 16 features (total 33 with acoustic)
    LEXICAL_FEATURES = [
        'has_text',                 # Flag: whether text is available
        'total_tokens',
        'unique_tokens',
        'ttr',                      # L1: Type-Token Ratio
        'content_word_count',
        'function_word_count',
        'lexical_density',          # L2: Lexical Density
        'deictic_count',
        'deictic_ratio',            # L3: Deictic Proportion
        'word_repetitions',
        'phrase_repetitions',
        'total_repetitions',
        'repetition_ratio',         # L4: Repetition
        'syllable_count',
        'speech_rate',              # A3: Speech Rate
        'articulation_rate'         # A4: Articulation Rate
    ]
    
    # Risk classification thresholds
    RISK_THRESHOLDS = {
        'low': 0.30,      # < 30% probability of impairment
        'medium': 0.60,   # 30-60% probability
        'high': 0.60      # > 60% probability
    }
    
    # Class labels
    CLASS_NAMES = ['HC', 'MCI', 'AD']
    CLASS_LABELS = {
        0: 'Healthy Control',
        1: 'Mild Cognitive Impairment',
        2: "Alzheimer's Disease"
    }
    
    @classmethod
    def ensure_models_exist(cls):
        """Check if required model files exist"""
        required_files = [
            cls.SCALER_PATH,
            cls.RF_MODEL_PATH,
            cls.XGB_MODEL_PATH
        ]
        
        missing = []
        for file_path in required_files:
            if not file_path.exists():
                missing.append(str(file_path))
        
        if missing:
            raise FileNotFoundError(
                f"Required model files not found:\n" + 
                "\n".join(f"  - {f}" for f in missing) +
                "\n\nPlease copy model files from notebook to ai/models/"
            )
        
        return True