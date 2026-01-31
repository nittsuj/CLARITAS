# Claritas Platform

This repository contains a simple prototype of the **Claritas** platform.  
Claritas is designed to help caregivers monitor the cognitive health of
Alzheimer's patients.  The project is split into two parts:

* **frontend** – A React application powered by Vite and TypeScript.  It
  implements a landing page, authentication screens (sign‑up and login),
  a basic dashboard with charts and tables, a cognitive assessment flow
  (CogniView) with audio recording, and a results page that displays
  analysis returned from the backend.  The user interface loosely
  follows the layouts found in the provided UI/UX PDF.  Components are
  styled using simple CSS and the [`react‑icons`](https://github.com/react-icons/react-icons)
  library for icons.
* **backend** – A small FastAPI server that exposes a single `/analyze-audio`
  endpoint.  This endpoint accepts an uploaded audio file and returns
  synthetic analysis metrics.  The analysis logic lives in
  `audio_analysis.py` and currently derives its scores from the size of
  the uploaded file.  This makes the server lightweight and easy to
  deploy during a hackathon while still demonstrating the end‑to‑end
  flow from audio capture to analysis.

## Running the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
uvicorn app.main:app --reload
```

By default the backend listens on `http://localhost:8000`.  You can
inspect the OpenAPI documentation at `http://localhost:8000/docs` when
the server is running.

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

The development server starts on `http://localhost:5173` by default.
Open that URL in your browser and navigate through the pages.  The
frontend expects the backend to be running on `http://localhost:8000`.
If you run the backend on another port or host you can change the
endpoint URL in `src/utils/config.ts`.

## Deployment

Both the frontend and backend are designed to be deployable with
minimal effort.  The backend uses only pure‑Python dependencies and
does not require a system‑wide installation of `ffmpeg` or other
heavyweight tools.  The frontend is bundled with Vite and can be
served from any static file host or integrated into a container image.

## Disclaimer

This prototype is intended for demonstration purposes.  The audio
analysis implemented here is trivial and should be replaced with a
proper model in production.  The UI aims to capture the spirit of the
provided designs but does not replicate every detail exactly.  Feel
free to adjust the styles, components and analysis logic to suit your
needs.