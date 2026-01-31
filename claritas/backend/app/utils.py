"""
Utility functions for audio file handling and conversion
"""

import os
import subprocess
import tempfile
import imageio_ffmpeg
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
    Convert audio file to WAV format using bundled ffmpeg (imageio-ffmpeg).
    Works without system ffmpeg or PATH.
    """
    ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()

    input_path = str(input_path)

    if output_path is None:
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        temp_file.close()
        output_path = temp_file.name

    cmd = [
        ffmpeg_path,
        "-y",
        "-i", input_path,
        "-ar", "16000",
        "-ac", "1",
        output_path
    ]

    proc = subprocess.run(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        timeout=30
    )

    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg conversion failed: {proc.stderr[:800]}")

    if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
        raise RuntimeError("Conversion produced empty WAV file")

    return output_path



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
