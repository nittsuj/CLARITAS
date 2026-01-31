"""
Utility functions for audio file handling and conversion
"""

import os
import subprocess
import tempfile
from pathlib import Path
from typing import Optional


def save_upload_to_temp(file_bytes: bytes, suffix: str = ".wav") -> str:
    """
    Save uploaded file bytes to a temporary file.
    
    Args:
        file_bytes: Raw audio file bytes
        suffix: File extension (e.g., ".wav", ".mp3", ".webm")
    
    Returns:
        Path to the temporary file
        
    Note:
        Caller must delete the file after use with os.unlink(path)
    """
    # Create temp file with delete=False so it persists after closing
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        temp_file.write(file_bytes)
        temp_file.flush()
        return temp_file.name
    finally:
        temp_file.close()


def convert_audio_to_wav(input_path: str, output_path: Optional[str] = None) -> str:
    """
    Convert audio file to WAV format using ffmpeg.
    
    Args:
        input_path: Path to input audio file (any format)
        output_path: Optional output path. If None, creates a temp file.
    
    Returns:
        Path to the converted WAV file
        
    Raises:
        RuntimeError: If ffmpeg is not installed or conversion fails
        
    Note:
        If output_path is None, caller must delete the temp file after use
    """
    if output_path is None:
        # Create temp file for output
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        temp_file.close()
        output_path = temp_file.name
    
    try:
        # Run ffmpeg to convert to 16kHz mono WAV
        # -y: overwrite output file
        # -i: input file
        # -ar 16000: sample rate 16kHz (matches model expectation)
        # -ac 1: mono channel
        # -loglevel error: only show errors
        result = subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", input_path,
                "-ar", "16000",
                "-ac", "1",
                output_path
            ],
            capture_output=True,
            text=True,
            timeout=30  # 30 second timeout for safety
        )
        
        if result.returncode != 0:
            raise RuntimeError(
                f"ffmpeg conversion failed: {result.stderr}"
            )
        
        if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
            raise RuntimeError("Conversion produced empty file")
        
        return output_path
        
    except FileNotFoundError:
        raise RuntimeError(
            "ffmpeg not found. Please install ffmpeg and add to PATH. "
            "Windows: https://www.gyan.dev/ffmpeg/builds/ or 'choco install ffmpeg'"
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError("Audio conversion timeout (file too large or corrupted)")


def detect_audio_format(file_bytes: bytes) -> str:
    """
    Detect audio format from file header (magic bytes).
    
    Args:
        file_bytes: Raw file bytes
    
    Returns:
        File extension hint (".wav", ".mp3", ".webm", or ".unknown")
    """
    if len(file_bytes) < 12:
        return ".unknown"
    
    # Check common audio format signatures
    header = file_bytes[:12]
    
    # WAV: "RIFF....WAVE"
    if header[:4] == b'RIFF' and header[8:12] == b'WAVE':
        return ".wav"
    
    # MP3: Starts with 0xFF 0xFB or ID3
    if header[:2] == b'\xff\xfb' or header[:3] == b'ID3':
        return ".mp3"
    
    # WebM: Starts with 0x1A 0x45 0xDF 0xA3
    if header[:4] == b'\x1a\x45\xdf\xa3':
        return ".webm"
    
    # OGG: "OggS"
    if header[:4] == b'OggS':
        return ".ogg"
    
    # FLAC: "fLaC"
    if header[:4] == b'fLaC':
        return ".flac"
    
    return ".unknown"
