from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)

    sessions = relationship("Session", back_populates="user")

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    task_type = Column(String, nullable=True)  # deskripsi-gambar / baca-kalimat
    created_at = Column(DateTime, default=datetime.utcnow)

    duration_sec = Column(Integer, nullable=True)

    speech_fluency = Column(Float, nullable=False)
    lexical_score = Column(Float, nullable=False)
    coherence_score = Column(Float, nullable=False)
    risk_band = Column(String, nullable=False)

    summary = Column(Text, nullable=False)
    technical_json = Column(Text, nullable=True)

    audio_path = Column(String, nullable=True)

    user = relationship("User", back_populates="sessions")
