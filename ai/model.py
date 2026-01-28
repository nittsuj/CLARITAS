"""
Main Claritas Model Class
"""

import numpy as np
import joblib
import os
import torch
import torch.nn as nn
import torch.nn.functional as F
import librosa
from pathlib import Path
from typing import Dict, Optional, Union
import warnings
warnings.filterwarnings('ignore')

from .config import ModelConfig
from .features import AcousticFeatureExtractor, LexicalFeatureExtractor

# =========================================================
# 1. DEFINE DEEP LEARNING ARCHITECTURE
# (Must match training exactly for weights to load)
# =========================================================

class CNNLSTM(nn.Module):
    """CNN-LSTM model for spectrogram classification"""
    def __init__(self, num_classes=3, n_mels=128, dropout=0.5):
        super().__init__()
        
        # CNN layers for feature extraction
        self.conv_layers = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Dropout2d(0.2),
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Dropout2d(0.3),
            
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Dropout2d(0.3),
        )
        
        # Calculate size after conv layers (128 / 8 = 16)
        conv_output_size = (n_mels // 8) * 128
        
        # Bidirectional LSTM
        self.lstm = nn.LSTM(
            conv_output_size, 256, num_layers=2, 
            batch_first=True, bidirectional=True, dropout=0.3
        )
        
        # Attention mechanism
        self.attention = nn.Sequential(
            nn.Linear(512, 256),
            nn.Tanh(),
            nn.Linear(256, 1)
        )
        
        # Classification head
        self.classifier = nn.Sequential(
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(128, num_classes)
        )
    
    def forward(self, x):
        # CNN feature extraction
        x = self.conv_layers(x)
        
        # Reshape for LSTM
        batch, channels, height, width = x.size()
        x = x.permute(0, 3, 2, 1).contiguous()
        x = x.view(batch, width, -1)
        
        # LSTM
        lstm_out, _ = self.lstm(x)
        
        # Attention pooling
        attn_weights = torch.softmax(self.attention(lstm_out), dim=1)
        x = torch.sum(attn_weights * lstm_out, dim=1)
        
        # Classification
        logits = self.classifier(x)
        return logits

# =========================================================
# 2. MAIN CLARITAS MODEL CLASS
# =========================================================

class ClaritasModel:
    """
    Multimodal Alzheimer's Detection System
    Combines: CNN-LSTM (Audio Spectrograms) + Ensemble ML (Acoustic/Lexical Features)
    """
    
    def __init__(self, config: Optional[ModelConfig] = None):
        """Initialize Claritas model"""
        self.config = config or ModelConfig()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Ensure model files exist
        self.config.ensure_models_exist()
        
        print(f"🚀 Initializing Claritas AI on {self.device}...")
        
        # 1. Load Scaler
        self.scaler = joblib.load(self.config.SCALER_PATH)

        # 2. Load Machine Learning Models
        print("   Loading ML Ensemble (CatBoost, RF, LightGBM)...")
        self.cat_model = joblib.load(self.config.CAT_FINAL_PATH)
        self.rf_model = joblib.load(self.config.RF_FINAL_PATH)
        self.lgbm_model = joblib.load(self.config.LGBM_FINAL_PATH)
        
        # 3. Load Deep Learning Model
        print("   Loading Deep Learning Model (CNN-LSTM)...")
        self.cnn_model = CNNLSTM(num_classes=3, n_mels=128).to(self.device)
        
        # Load weights safely
        state_dict = torch.load(self.config.CNN_LSTM_FINAL_PATH, map_location=self.device)
        self.cnn_model.load_state_dict(state_dict)
        self.cnn_model.eval() # Set to inference mode
        
        print("✅ All models loaded successfully")
        
        # Initialize feature extractors
        self.acoustic_extractor = AcousticFeatureExtractor(
            sr=self.config.SAMPLE_RATE,
            frame_duration_ms=self.config.FRAME_DURATION_MS,
            aggressiveness=self.config.VAD_AGGRESSIVENESS
        )
        self.lexical_extractor = LexicalFeatureExtractor()
    
    def predict(self, audio_path: Union[str, Path], 
                text: Optional[Union[str, Path]] = None) -> Dict:
        """
        Predict from audio file using Hybrid Ensemble Strategy
        """
        print(f"\n🎵 Analyzing audio: {audio_path}")
        
        # --- Handle Text Input ---
        text_content = self._resolve_text_input(text)

        # --- Step 1: Extract Tabular Features (For ML Models) ---
        print("Extracting acoustic features...")
        acoustic_features = self.acoustic_extractor.extract(str(audio_path))
        
        print("Extracting lexical features...")
        lexical_features = self.lexical_extractor.extract(
            text_content,
            acoustic_features['speech_duration'],
            acoustic_features['total_duration']
        )
        
        # Prepare tabular vector
        all_features = {**acoustic_features, **lexical_features}
        feature_vector = self._prepare_features(all_features)
        
        # --- Step 2: Extract Spectrogram (For Deep Learning Model) ---
        print("Generating spectrogram for CNN...")
        spectrogram_tensor = self._preprocess_spectrogram(str(audio_path))
        
        # --- Step 3: Run Classification ---
        print("Running Grand Ensemble classification...")
        classification_result = self._classify(feature_vector, spectrogram_tensor)
        
        # --- Step 4: Calculate Scores ---
        fluency_score = self._calculate_fluency_score(acoustic_features)
        coherence_score = self._calculate_coherence_score(lexical_features)
        risk_level = self._determine_risk_level(classification_result)
        
        result = {
            'fitur_akustik': acoustic_features,
            'fitur_leksikal': lexical_features,
            'speech_fluency_score': fluency_score,
            'lexical_coherence_score': coherence_score,
            'classification': classification_result,
            'risk_level': risk_level
        }
        
        print(f"Analysis complete!")
        print(f"   Prediction: {classification_result['predicted_class']}")
        print(f"   Risk Level: {risk_level.upper()}")
        
        return result

    def _resolve_text_input(self, text):
        """Helper to handle file path vs raw string text"""
        if not text: return ""
        text_str = str(text)
        if os.path.isfile(text_str):
            try:
                with open(text_str, 'r', encoding='utf-8') as f:
                    return f.read().strip()
            except:
                return ""
        return text_str

    def _preprocess_spectrogram(self, audio_path, sr=16000, n_mels=128, max_length=500):
        """Convert audio file to Normalized Mel Spectrogram Tensor"""
        try:
            # 1. Load Audio
            audio, _ = librosa.load(audio_path, sr=sr, mono=True)
            
            # 2. Extract Mel Spectrogram
            mel_spec = librosa.feature.melspectrogram(
                y=audio, sr=sr, n_mels=n_mels, 
                n_fft=2048, hop_length=512, fmax=8000
            )
            mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
            
            # 3. Normalize (Same as training)
            mel_spec_db = (mel_spec_db - mel_spec_db.mean()) / (mel_spec_db.std() + 1e-6)
            
            # 4. Pad or Truncate
            if mel_spec_db.shape[1] < max_length:
                pad_width = max_length - mel_spec_db.shape[1]
                mel_spec_db = np.pad(mel_spec_db, ((0, 0), (0, pad_width)), mode='constant')
            else:
                mel_spec_db = mel_spec_db[:, :max_length]
            
            # 5. Convert to Tensor (Add Batch and Channel Dimensions)
            # Shape: (1, 1, 128, 500)
            tensor = torch.FloatTensor(mel_spec_db).unsqueeze(0).unsqueeze(0)
            return tensor.to(self.device)
            
        except Exception as e:
            print(f"⚠️ Spectrogram Error: {e}")
            # Return empty tensor to prevent crash (batch=1, channel=1, freq=128, time=500)
            return torch.zeros((1, 1, n_mels, max_length)).to(self.device)

    def _prepare_features(self, features: Dict) -> np.ndarray:
        """Prepare tabular features for ML models"""
        feature_order = self.config.ACOUSTIC_FEATURES + self.config.LEXICAL_FEATURES
        feature_values = [features.get(feat, 0) for feat in feature_order]
        feature_array = np.array(feature_values).reshape(1, -1)
        return self.scaler.transform(feature_array)
    
    def _classify(self, features_tabular: np.ndarray, spectrogram_tensor: torch.Tensor) -> Dict:
        """
        Run 4-Way Ensemble Classification
        """
        # 1. Get ML Probabilities (CPU)
        try:
            p_cat  = self.cat_model.predict_proba(features_tabular)[0]
            p_rf   = self.rf_model.predict_proba(features_tabular)[0]
            p_lgbm = self.lgbm_model.predict_proba(features_tabular)[0]
        except:
            # Fallback if model fails
            p_cat = p_rf = p_lgbm = np.array([0.33, 0.33, 0.33])

        # 2. Get Deep Learning Probabilities (GPU/CPU)
        with torch.no_grad():
            outputs = self.cnn_model(spectrogram_tensor)
            p_cnn = F.softmax(outputs, dim=1).cpu().numpy()[0]

        # 3. Weighted Ensemble (Soft Voting)
        # Weights from your optimization: CNN=0.65, Cat=0.20, LGBM=0.10, RF=0.05
        w_cnn, w_cat, w_lgbm, w_rf = 0.65, 0.20, 0.10, 0.05
        
        ensemble_proba = (
            (w_cnn  * p_cnn) + 
            (w_cat  * p_cat) + 
            (w_lgbm * p_lgbm) + 
            (w_rf   * p_rf)
        )
        
        ensemble_pred_idx = np.argmax(ensemble_proba)
        
        return {
            'predicted_class': self.config.CLASS_NAMES[ensemble_pred_idx],
            'predicted_label': self.config.CLASS_LABELS[ensemble_pred_idx],
            'probabilities': {
                'HC': float(ensemble_proba[0]),
                'MCI': float(ensemble_proba[1]),
                'AD': float(ensemble_proba[2])
            },
            'confidence': float(ensemble_proba[ensemble_pred_idx]),
            'details': {
                'cnn_conf': float(p_cnn[ensemble_pred_idx]),
                'ml_conf': float(p_cat[ensemble_pred_idx])
            }
        }
    
    def _calculate_fluency_score(self, acoustic_features: Dict) -> float:
        """
        Calculate speech fluency score (0-100)
        Based on pause patterns and voice quality
        """
        # Components:
        # 1. Voice proportion (higher = better)
        voice_score = acoustic_features['voice_ratio'] * 30
        
        # 2. Pause pattern (fewer long pauses = better)
        max_pauses = 10  # normalize
        pause_penalty = min(acoustic_features['long_pauses_count'] / max_pauses, 1.0)
        pause_score = (1 - pause_penalty) * 30
        
        # 3. Speech rate (within normal range = better)
        # Normal: 120-180 syllables/min
        speech_rate = acoustic_features.get('speech_rate', 0)
        if 120 <= speech_rate <= 180:
            rate_score = 25
        elif speech_rate < 120:
            rate_score = max(0, 25 * (speech_rate / 120))
        else:
            rate_score = max(0, 25 * (180 / speech_rate))
        
        # 4. Pitch variation (moderate = better)
        pitch_std = acoustic_features['std_pitch']
        if 10 <= pitch_std <= 40:
            pitch_score = 15
        else:
            pitch_score = max(0, 15 * (1 - abs(pitch_std - 25) / 25))
        
        total_score = voice_score + pause_score + rate_score + pitch_score
        return min(100, max(0, total_score))
    
    def _calculate_coherence_score(self, lexical_features: Dict) -> float:
        """
        Calculate lexical coherence score (0-100)
        Based on vocabulary diversity and structure
        """
        # Components:
        # 1. Type-Token Ratio (diversity)
        ttr = lexical_features['ttr']
        ttr_score = min(ttr * 35, 35)
        
        # 2. Lexical density (content vs function words)
        density = lexical_features['lexical_density']
        density_score = min(density * 30, 30)
        
        # 3. Deictic ratio (lower = better, less vague)
        deictic_ratio = lexical_features['deictic_ratio']
        deictic_score = max(0, 20 * (1 - min(deictic_ratio * 5, 1)))
        
        # 4. Repetition (lower = better)
        repetition_ratio = lexical_features['repetition_ratio']
        repetition_score = max(0, 15 * (1 - min(repetition_ratio * 5, 1)))
        
        total_score = ttr_score + density_score + deictic_score + repetition_score
        return min(100, max(0, total_score))
    
    def _determine_risk_level(self, classification: Dict) -> str:
        """
        Determine risk level based on classification probabilities
        """
        # Calculate combined impairment probability (MCI + AD)
        impairment_prob = classification['probabilities']['MCI'] + \
                         classification['probabilities']['AD']
        
        thresholds = self.config.RISK_THRESHOLDS
        
        if impairment_prob < thresholds['low']:
            return 'low'
        elif impairment_prob < thresholds['high']:
            return 'medium'
        else:
            return 'high'
    
    def get_feature_importance(self) -> Dict:
        """Get averaged feature importance from the ML ensemble (CatBoost + RF + LightGBM)"""
        feature_names = self.config.ACOUSTIC_FEATURES + self.config.LEXICAL_FEATURES
        
        # 1. Get importances from each model
        # Note: CatBoost and LGBM returns raw scores, RF returns 0-1 probabilities.
        # We normalize them so they are comparable.
        
        # CatBoost
        cat_imp = self.cat_model.feature_importances_
        cat_imp = cat_imp / np.sum(cat_imp) # Normalize to 0-1
        
        # Random Forest
        rf_imp = self.rf_model.feature_importances_
        rf_imp = rf_imp / np.sum(rf_imp)
        
        # LightGBM
        lgbm_imp = self.lgbm_model.feature_importances_
        lgbm_imp = lgbm_imp / np.sum(lgbm_imp)
        
        # 2. Average them
        avg_importances = (cat_imp + rf_imp + lgbm_imp) / 3.0
        
        # 3. Create dictionary
        importance_dict = {}
        for name, importance in zip(feature_names, avg_importances):
            importance_dict[name] = float(importance)
        
        # 4. Sort by importance
        sorted_importance = dict(
            sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)
        )
        
        return sorted_importance