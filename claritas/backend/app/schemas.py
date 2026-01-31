from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime

class SessionOut(BaseModel):
    id: int
    task_type: Optional[str]
    created_at: datetime
    duration_sec: Optional[int]

    speech_fluency: float
    lexical_score: float
    coherence_score: float
    risk_band: str
    summary: str
    technical: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class SessionListItem(BaseModel):
    id: int
    task_type: Optional[str]
    created_at: datetime
    risk_band: str
    speech_fluency: float
    lexical_score: float
    coherence_score: float

    class Config:
        from_attributes = True
