# ﻿CLARITAS

**Cognitive Linguistic Audio Recognition and Identification Technology for Alzheimer Support**

<img src="img/Logo-Claritas.png">

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Use Case Diagram](#use-case-diagram)
- [Getting Started](#getting-started)
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




>>>>>>> origin/main
