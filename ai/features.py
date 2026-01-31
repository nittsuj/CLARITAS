"""
Feature extraction for acoustic and lexical analysis
"""

import numpy as np
import librosa
import webrtcvad
import re
from collections import Counter
from typing import Dict, Optional, List


class AcousticFeatureExtractor:
    """Extract acoustic features from audio"""

    def __init__(self, sr=16000, frame_duration_ms=30, aggressiveness=1):
        self.sr = sr
        self.frame_duration_ms = frame_duration_ms
        self.aggressiveness = aggressiveness

    def extract(self, audio_path: str) -> Dict[str, float]:
        """Extract all acoustic features from audio file"""
        # Load audio
        audio, _ = librosa.load(audio_path, sr=self.sr, mono=True)

        # Feature 1: Pause analysis (VAD-based)
        pause_features = self._extract_pause_features(audio)

        # Feature 2: Prosody (pitch, energy, ZCR)
        prosody_features = self._extract_prosody_features(audio)

        # Combine all features
        features = {**pause_features, **prosody_features}

        return features

    def _extract_pause_features(self, audio: np.ndarray) -> Dict[str, float]:
        """Extract pause and silence features using VAD"""
        # Convert to int16 for VAD
        audio_int16 = (audio * 32768).astype(np.int16).tobytes()

        # Initialize VAD
        vad = webrtcvad.Vad(self.aggressiveness)
        frame_length = int(self.sr * self.frame_duration_ms / 1000) * 2

        # Process frames
        speech_frames = []
        offset = 0
        frame_count = 0

        while offset + frame_length <= len(audio_int16):
            frame = audio_int16[offset : offset + frame_length]
            try:
                is_speech = vad.is_speech(frame, self.sr)
                speech_frames.append(1 if is_speech else 0)
                frame_count += 1
            except:
                pass
            offset += frame_length

        speech_mask = np.array(speech_frames)
        frame_duration_s = self.frame_duration_ms / 1000.0
        total_duration = len(audio) / self.sr

        # Find pause segments
        pauses = []
        in_pause = False
        pause_start = 0

        for i, is_speech in enumerate(speech_mask):
            if is_speech == 0 and not in_pause:
                in_pause = True
                pause_start = i
            elif is_speech == 1 and in_pause:
                pause_duration = (i - pause_start) * frame_duration_s
                pauses.append(pause_duration)
                in_pause = False

        if in_pause:
            pause_duration = (len(speech_mask) - pause_start) * frame_duration_s
            pauses.append(pause_duration)
            # need to store long pause and short pause like how long

        # Calculate statistics
        total_pause_duration = sum(pauses)
        pause_ratio = total_pause_duration / total_duration if total_duration > 0 else 0
        voice_ratio = 1 - pause_ratio
        speech_duration = voice_ratio * total_duration

        short_pauses = sum(1 for p in pauses if p < 1.0)
        long_pauses = sum(1 for p in pauses if p > 2.0)

        mean_pause = np.mean(pauses) if len(pauses) > 0 else 0
        std_pause = np.std(pauses) if len(pauses) > 0 else 0
        max_pause = max(pauses) if len(pauses) > 0 else 0

        return {
            "pause_ratio": pause_ratio,
            "mean_pause_duration": mean_pause,
            "std_pause_duration": std_pause,
            "max_pause_duration": max_pause,
            "num_pauses": len(pauses),
            "short_pauses_count": short_pauses,
            "long_pauses_count": long_pauses,
            "voice_ratio": voice_ratio,
            "speech_duration": speech_duration,
            "total_duration": total_duration,
        }

    def _extract_prosody_features(self, audio: np.ndarray) -> Dict[str, float]:
        """Extract pitch, energy, and zero-crossing rate"""
        # Pitch (F0)
        pitches, magnitudes = librosa.piptrack(y=audio, sr=self.sr, fmin=75, fmax=400)

        pitch_values = []
        for t in range(pitches.shape[1]):
            index = magnitudes[:, t].argmax()
            pitch = pitches[index, t]
            if pitch > 0:
                pitch_values.append(pitch)

        mean_pitch = np.mean(pitch_values) if len(pitch_values) > 0 else 0
        std_pitch = np.std(pitch_values) if len(pitch_values) > 0 else 0
        pitch_range = (
            max(pitch_values) - min(pitch_values) if len(pitch_values) > 0 else 0
        )

        # Energy (RMS)
        rms = librosa.feature.rms(y=audio)[0]
        mean_energy = np.mean(rms)
        std_energy = np.std(rms)

        # Zero-crossing rate
        zcr = librosa.feature.zero_crossing_rate(audio)[0]
        mean_zcr = np.mean(zcr)
        std_zcr = np.std(zcr)

        return {
            "mean_pitch": mean_pitch,
            "std_pitch": std_pitch,
            "pitch_range": pitch_range,
            "mean_energy": mean_energy,
            "std_energy": std_energy,
            "mean_zcr": mean_zcr,
            "std_zcr": std_zcr,
        }


class LexicalFeatureExtractor:
    """Extract lexical features from transcribed text"""

    # Content and function words for multiple languages
    CONTENT_WORDS = {
        "english": [
            "boy",
            "girl",
            "woman",
            "mother",
            "child",
            "children",
            "cookie",
            "cookies",
            "jar",
            "stool",
            "chair",
            "sink",
            "water",
            "window",
            "curtain",
            "dish",
            "dishes",
            "fall",
            "falling",
            "reach",
            "reaching",
            "wash",
            "washing",
            "overflow",
            "overflowing",
            "stand",
            "standing",
            "get",
            "getting",
            "take",
            "taking",
            "dry",
            "drying",
            "see",
            "look",
            "looking",
            "kitchen",
            "floor",
            "counter",
            "cupboard",
        ],
        "chinese": [
            "男孩",
            "女孩",
            "女人",
            "母亲",
            "孩子",
            "饼干",
            "罐子",
            "凳子",
            "椅子",
            "水槽",
            "水",
            "窗户",
            "窗帘",
            "碗",
            "盘子",
            "掉",
            "落",
            "够",
            "洗",
            "溢出",
            "站",
            "拿",
            "擦",
            "看",
            "厨房",
            "地板",
        ],
        "indonesian": [
            "anak",
            "laki",
            "perempuan",
            "wanita",
            "ibu",
            "kue",
            "toples",
            "bangku",
            "kursi",
            "wastafel",
            "air",
            "jendela",
            "tirai",
            "piring",
            "jatuh",
            "ambil",
            "cuci",
            "meluap",
            "berdiri",
            "keringkan",
            "lihat",
            "dapur",
            "lantai",
        ],
    }

    # Function words (pronouns, prepositions, articles, conjunctions)
    FUNCTION_WORDS = {
        "english": [
            "the",
            "a",
            "an",
            "is",
            "are",
            "was",
            "were",
            "be",
            "been",
            "being",
            "have",
            "has",
            "had",
            "do",
            "does",
            "did",
            "will",
            "would",
            "should",
            "could",
            "may",
            "might",
            "must",
            "can",
            "shall",
            "and",
            "or",
            "but",
            "if",
            "because",
            "as",
            "of",
            "to",
            "for",
            "with",
            "on",
            "in",
            "at",
            "by",
            "from",
            "up",
            "about",
            "into",
            "through",
            "during",
            "before",
            "after",
            "above",
            "below",
            "between",
            "under",
            "again",
            "further",
            "then",
            "once",
            "here",
            "there",
            "when",
            "where",
            "why",
            "how",
            "all",
            "both",
            "each",
            "few",
            "more",
            "most",
            "other",
            "some",
            "such",
            "no",
            "nor",
            "not",
            "only",
            "own",
            "same",
            "so",
            "than",
            "too",
            "very",
        ],
        "chinese": [
            "的",
            "了",
            "在",
            "是",
            "和",
            "与",
            "或",
            "但",
            "如果",
            "因为",
            "从",
            "到",
            "对",
            "为",
            "以",
            "把",
            "被",
            "给",
            "让",
            "使",
            "这",
            "那",
            "什么",
            "谁",
            "哪",
            "怎么",
            "为什么",
            "都",
            "也",
            "还",
        ],
        "indonesian": [
            "yang",
            "dan",
            "atau",
            "tetapi",
            "jika",
            "karena",
            "dengan",
            "dari",
            "ke",
            "untuk",
            "pada",
            "di",
            "oleh",
            "adalah",
            "ini",
            "itu",
            "apa",
            "siapa",
            "mana",
            "bagaimana",
            "mengapa",
            "juga",
            "masih",
        ],
    }

    DEICTIC_WORDS = {
        "english": [
            "this",
            "that",
            "it",
            "thing",
            "things",
            "stuff",
            "something",
            "here",
            "there",
            "one",
            "ones",
        ],
        "chinese": ["这", "那", "东西", "事情", "这个", "那个", "这里", "那里", "什么"],
        "indonesian": ["ini", "itu", "hal", "sesuatu", "di sini", "di sana", "satu"],
    }

    def extract(
        self, text: Optional[str], speech_duration: float, total_duration: float
    ) -> Dict[str, float]:
        """Extract all lexical features from text"""
        if not text or text.strip() == "":
            return self._get_default_features()

        text = self._preprocess_text(text)
        tokens = self._tokenize(text)

        if len(tokens) == 0:
            return self._get_default_features()

        lang = self._detect_language(text)

        # Feature 1: Type-Token Ratio
        ttr_features = self._extract_ttr(tokens)

        # Feature 2: Lexical Density
        density_features = self._extract_lexical_density(tokens, lang)

        # Feature 3: Deictic expressions
        deictic_features = self._extract_deictic(tokens, lang)

        # Feature 4: Repetition
        repetition_features = self._extract_repetition(tokens)

        # Feature 5: Speaking rate
        rate_features = self._extract_speaking_rate(
            text, speech_duration, total_duration
        )

        return {
            "has_text": 1,  # Flag indicating text is available
            **ttr_features,
            **density_features,
            **deictic_features,
            **repetition_features,
            **rate_features,
        }

    def _preprocess_text(self, text: str) -> str:
        """Clean and normalize text"""
        text = str(text).lower()
        text = " ".join(text.split())
        return text

    def _tokenize(self, text: str) -> List[str]:
        """Split text into tokens"""
        return re.findall(r"\b\w+\b", text.lower())

    def _detect_language(self, text: str) -> str:
        """Simple language detection"""
        indonesian_indicators = ["yang", "adalah", "dengan", "dari", "untuk"]
        if any(word in text.lower() for word in indonesian_indicators):
            return "indonesian"
        return "english"

    def _extract_ttr(self, tokens: List[str]) -> Dict[str, float]:
        """Type-Token Ratio: lexical diversity"""
        total_tokens = len(tokens)
        unique_tokens = len(set(tokens))
        ttr = unique_tokens / total_tokens if total_tokens > 0 else 0

        return {
            "total_tokens": total_tokens,
            "unique_tokens": unique_tokens,
            "ttr": ttr,
        }

    def _extract_lexical_density(
        self, tokens: List[str], lang: str
    ) -> Dict[str, float]:
        """Ratio of content words to total words"""
        content_list = self.CONTENT_WORDS.get(lang, self.CONTENT_WORDS["english"])
        function_list = self.FUNCTION_WORDS.get(lang, self.FUNCTION_WORDS["english"])

        content_count = sum(1 for token in tokens if token in content_list)
        function_count = sum(1 for token in tokens if token in function_list)

        lexical_density = content_count / len(tokens) if len(tokens) > 0 else 0

        return {
            "content_word_count": content_count,
            "function_word_count": function_count,
            "lexical_density": lexical_density,
        }

    def _extract_deictic(self, tokens: List[str], lang: str) -> Dict[str, float]:
        """Count vague reference words"""
        deictic_list = self.DEICTIC_WORDS.get(lang, self.DEICTIC_WORDS["english"])

        deictic_count = sum(1 for token in tokens if token in deictic_list)
        deictic_ratio = deictic_count / len(tokens) if len(tokens) > 0 else 0

        return {"deictic_count": deictic_count, "deictic_ratio": deictic_ratio}

    def _extract_repetition(self, tokens: List[str]) -> Dict[str, float]:
        """Detect word and phrase repetitions"""
        if len(tokens) < 2:
            return {
                "word_repetitions": 0,
                "phrase_repetitions": 0,
                "total_repetitions": 0,
                "repetition_ratio": 0.0,
            }

        # Word repetitions
        word_reps = 0
        for i in range(len(tokens) - 1):
            if tokens[i] == tokens[i + 1]:
                word_reps += 1

        # Phrase repetitions (bigrams)
        bigrams = [" ".join(tokens[i : i + 2]) for i in range(len(tokens) - 1)]
        bigram_counts = Counter(bigrams)
        phrase_reps = sum(count - 1 for count in bigram_counts.values() if count > 1)

        total_reps = word_reps + phrase_reps
        repetition_ratio = total_reps / len(tokens) if len(tokens) > 0 else 0

        return {
            "word_repetitions": word_reps,
            "phrase_repetitions": phrase_reps,
            "total_repetitions": total_reps,
            "repetition_ratio": repetition_ratio,
        }

    def _extract_speaking_rate(
        self, text: str, speech_duration: float, total_duration: float
    ) -> Dict[str, float]:
        """Calculate speech rate and articulation rate"""
        syllables = self._count_syllables(text)

        # Speech rate: syllables per minute (including pauses)
        speech_rate = (syllables / total_duration) * 60 if total_duration > 0 else 0

        # Articulation rate: syllables per minute (excluding pauses)
        articulation_rate = (
            (syllables / speech_duration) * 60 if speech_duration > 0 else 0
        )

        return {
            "syllable_count": syllables,
            "speech_rate": speech_rate,
            "articulation_rate": articulation_rate,
        }

    def _count_syllables(self, text: str) -> int:
        """Simple syllable counting"""
        if not text:
            return 0

        text = text.lower()
        vowels = "aeiouy"
        syllable_count = 0
        previous_was_vowel = False

        for char in text:
            is_vowel = char in vowels
            if is_vowel and not previous_was_vowel:
                syllable_count += 1
            previous_was_vowel = is_vowel

        if text.endswith("e"):
            syllable_count -= 1

        if syllable_count == 0 and len(text) > 0:
            syllable_count = 1

        return syllable_count

    def _get_default_features(self) -> Dict[str, float]:
        """Return default features when text is not available"""
        return {
            "has_text": 0,  # Flag indicating no text
            "total_tokens": 0,
            "unique_tokens": 0,
            "ttr": 0.0,
            "content_word_count": 0,
            "function_word_count": 0,
            "lexical_density": 0.0,
            "deictic_count": 0,
            "deictic_ratio": 0.0,
            "word_repetitions": 0,
            "phrase_repetitions": 0,
            "total_repetitions": 0,
            "repetition_ratio": 0.0,
            "syllable_count": 0,
            "speech_rate": 0.0,
            "articulation_rate": 0.0,
        }
