# ﻿CLARITAS

**Cognitive Linguistic Audio Recognition and Identification Technology for Alzheimer Support**

<img src="img/Logo-Claritas.png">

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Use Case Diagram](#use-case-diagram)
- [Getting Started](#getting-started)
- [Development Progress](#development-progress)
  - [Progress 1: Core UI/UX Implementation](#progress-1-core-uiux-implementation-)
  - [Progress 2: AI Integration & CareView](#progress-2-ai-integration--careview-)
- [Team](#team)
- [Features](#features)
- [License](#license)

## 📌 Project Overview
CLARITAS adalah platform berbasis web yang memanfaatkan teknologi AI untuk mendeteksi dini perubahan kognitif pada pasien Alzheimer melalui analisis mendalam terhadap pola bicara, termasuk aspek akustik dan leksikal. Sistem ini dirancang untuk membantu tenaga medis dalam pemantauan kognitif pasien secara berkelanjutan. Untuk memperoleh pemahaman yang lebih mendalam mengenai sistem CLARITAS, silakan **[klik di sini](https://shzirley.github.io/introduction-claritas/)**.


## 📁 Project Structure

```
CLARITAS/
├── ai/                      # AI models & pipeline
│   ├── __init__.py
│   ├── config.py
│   ├── example_usage.py
│   ├── features.py
│   ├── requirements.txt
│   ├── model.py
│   ├── __pycache__/
│   └── models/
│       ├── catboost_final.pkl
│       ├── cnn_lstm_final.pt
│       ├── ensemble_weights.pkl
│       ├── feature_scaler.pkl
│       ├── lightgbm_final.pkl
│       ├── random_forest_final.pkl
│       ├── random_forest_full.pkl
│       └── xgboost_full.pkl
│
├── img/                     # Logo & UCD
│   ├── Logo-Claritas.png
│   └── UCD-Claritas.png
│
├── .gitignore
├── LICENSE
├── README.md
├── app.py                   # Flask backend entrypoint
├── index.html               # Frontend main page
├── scripts.js               # Frontend logic
└── styles.css               # Frontend styling
```


## 🛠️ Tech Stack

- **Backend**: PHP (Laravel) / Python (Flask)
- **Frontend**: HTML, CSS, JavaScript
- **AI/ML**: Python, TensorFlow/Scikit-learn
- **Database**: MySQL
- **Audio Processing**: librosa
- **Version Control**: Git, GitHub
- **Model**: Whisper OpenAI

## 💼 Use Case Diagram
<img src="img/UCD-Claritas.png">

## 🚀 Getting Started

### Prerequisites

- Python 3.x.x
- pip (Python package manager)
- Virtual environment tool

### Environment Setup

#### 1. Clone Repository

```bash
git clone https://github.com/nittsuj/CLARITAS.git
cd CLARITAS
```

# AI
cara memakai
1. buat Venv dan instal req
    ```py
    python -m venv venv
    .\venv\Scripts\Activate
    pip install -r ai/requirements.txt
    ```

2. Cara mengambil metrik dan klasifikasi

    ```py
    from ai import ClaritasModel

    model = ClaritasModel()
    result = model.predict(
        audio_path="...",
        text_path="..."
    )
    print(result['classification']['predicted_class'])
    ```
    result memiliki banyak metrik seperti

    ```py
    api_response = {
        'status': 'success',
        'data': {
            'prediction': {
                'class': result['classification']['predicted_class'],
                'label': result['classification']['predicted_label'],
                'confidence': result['classification']['confidence'],
                'probabilities': result['classification']['probabilities']
            },
            'scores': {
                'speech_fluency': result['speech_fluency_score'],
                'lexical_coherence': result['lexical_coherence_score']
            },
            'risk_assessment': {
                'level': result['risk_level'],
                'description': {
                    'low': 'No significant cognitive impairment detected',
                    'medium': 'Mild cognitive changes observed',
                    'high': 'Significant cognitive impairment detected'
                }[result['risk_level']]
            },
            'features': {
                'acoustic': {
                    'pause_ratio': result['fitur_akustik']['pause_ratio'],
                    'voice_ratio': result['fitur_akustik']['voice_ratio']
                },
                'lexical': {
                    'ttr': result['fitur_leksikal']['ttr'],
                    'lexical_density': result['fitur_leksikal']['lexical_density'],
                    'speech_rate': result['fitur_leksikal']['speech_rate'],
                    'repetition_ratio': result['fitur_leksikal']['total_repetitions']
                }
            }
        }
    }
    ```

    NOTE : Model membutuh kan sebuah Audio dan Text

## 📈 Development Progress

### Progress 1: Core UI/UX Implementation ✅

**Completed Features**:

#### 1. Landing Page
- ✅ Modern hero section with gradient background
- ✅ Feature showcase cards (CogniView, CareView, Fitur)
- ✅ Sticky navigation bar
- ✅ Google OAuth integration
- ✅ Responsive design
- ✅ Call-to-action buttons

#### 2. Dashboard
- ✅ Patient information cards
- ✅ Sidebar navigation
- ✅ User profile display (from Google OAuth)
- ✅ Quick access to CogniView and CareView
- ✅ Modern card-based layout

#### 3. CogniView (Cognitive Assessment)
- ✅ Multi-step assessment flow:
  - Introduction screen
  - Task selection (Deskripsi Gambar / Baca Kalimat)
  - Content setup (Image gallery / Sentence input)
  - Audio recording interface
  - Analysis processing
- ✅ Audio recording with MediaRecorder API
- ✅ File upload support for audio analysis
- ✅ Real-time recording timer
- ✅ Progress indicators
- ✅ Task-specific content management

#### 4. Navigation & Authentication
- ✅ Authenticated navigation component with tabs
- ✅ Google OAuth login/logout
- ✅ Protected routes
- ✅ User session management
- ✅ Clickable logo to return to landing page

**Tech Stack**:
- Frontend: React + TypeScript + Vite
- Styling: Vanilla CSS with modern design
- Icons: React Icons
- Auth: Google OAuth 2.0
- Routing: React Router

---

### Progress 2: AI Integration & CareView ✅

**Completed Features**:

#### 1. Backend AI Integration
- ✅ FastAPI backend with audio analysis endpoint
- ✅ Audio format detection (WAV, MP3, WebM, OGG, FLAC)
- ✅ FFmpeg audio conversion (webm → WAV)
- ✅ Integration with ClaritasModel AI
- ✅ Mock mode for testing without AI model
- ✅ Comprehensive error handling
- ✅ CORS configuration for frontend

**API Endpoints**:
```python
POST /analyze-audio
- Input: Audio file (webm, wav, mp3, etc.)
- Output: Analysis results with scores
  - speech_fluency: 0-100
  - lexical_score: 0-100
  - coherence_score: 0-100
  - risk_band: Baik/Sedang/Buruk
  - summary: AI-generated diagnosis
  - technical: Detailed metrics
```

#### 2. Session Result Page
- ✅ Detailed analysis results display
- ✅ Session information card (date, task type, duration, caregiver)
- ✅ Score cards (Speech Fluency, Lexical, Coherence, Risk Band)
- ✅ Diagnosis section with AI summary
- ✅ Collapsible technical details:
  - Metrik Akustik (pitch, energy, MFCC, etc.)
  - Metrik Leksikal (word count, vocabulary, etc.)
  - Koherensi score with progress bar
- ✅ Action buttons (Transkrip & Timeline, Back to CareView)

#### 3. CareView (Patient Monitoring)
- ✅ Overall Cognitive Health Score dashboard
- ✅ Three metric cards with trend indicators:
  - Speech Fluency
  - Lexical Score
  - Coherence Score
- ✅ Session history table with:
  - Date, task type, scores
  - Risk band badges
  - "Lihat Detail" navigation
- ✅ Trend chart placeholder (ready for Chart.js)
- ✅ Clinical Report Preview (when no sessions)

#### 4. Clinical Report Preview
- ✅ Professional clinical report layout
- ✅ Patient information section
- ✅ Overall cognitive score (73/100)
- ✅ Three main cognitive metrics with explanations
- ✅ Monthly progress summary
- ✅ Recent session history table
- ✅ Clinical recommendations section (hardcoded, ready for LLM)
- ✅ Print & Download PDF buttons
- ✅ Professional styling matching medical reports

#### 5. Data Flow & Storage
- ✅ Session storage utilities (localStorage)
- ✅ Session management functions:
  - Save session results
  - Retrieve session history
  - Calculate overall scores
  - Get trend data
  - Calculate score trends
- ✅ Automatic navigation flow:
  - CogniView → Session Result → CareView
- ✅ Session detail view from history

**Tech Stack**:
- Backend: FastAPI + Python
- AI: ClaritasModel (ensemble ML models)
- Audio: librosa, FFmpeg (imageio-ffmpeg)
- Storage: localStorage (frontend)
- Future: LLM integration for clinical recommendations

**Files Created/Modified**:
```
Backend:
- claritas/backend/app/main.py (AI integration)
- claritas/backend/app/utils.py (audio processing)

Frontend:
- claritas/frontend/src/pages/SessionResult.tsx (new)
- claritas/frontend/src/pages/CareView.tsx (new)
- claritas/frontend/src/components/ClinicalReportPreview.tsx (new)
- claritas/frontend/src/utils/sessions.ts (new)
- claritas/frontend/src/utils/api.ts (new)
- claritas/frontend/src/pages/CogniView.tsx (updated)
- claritas/frontend/src/App.tsx (routes)
```

**Known Limitations**:
- LLM recommendations currently hardcoded (Phase 3 pending)
- PDF generation not yet implemented
- Transcript & Timeline feature placeholder
- Chart visualization placeholder (needs Chart.js)
- Patient selection hardcoded (Budi Santoso)

---
 
## 👥 Team
| Nama | Peran |
|------|-------|
| **Justin Valentino** | Backend |
| **Ananda** | Business |
| **Angela** | Frontend & Research |
| **Daffa** | AI Model |
| **Tavasya** | UI/UX |


## 🔒 License

Hak Milik: Tembok Ratapan Solo


## 📧 Contact & Support

Untuk pertanyaan atau dukungan teknis, silakan buat issue di repository ini atau hubungi tim development.
