export interface SessionResult {
    id: string;
    date: string;
    taskType: 'deskripsi-gambar' | 'baca-kalimat';
    caregiver: string;
    patient: string;
    scores: {
        speech_fluency: number;
        lexical_score: number;
        coherence_score: number;
    };
    risk_band: string;
    summary: string;
    technical: any;
}

const STORAGE_KEY = 'claritas_sessions';

export const getSessions = (): SessionResult[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading sessions from localStorage:', error);
        return [];
    }
};

export const saveSession = (session: SessionResult): void => {
    try {
        const sessions = getSessions();
        sessions.push(session);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
        console.error('Error saving session to localStorage:', error);
    }
};

export const getSessionById = (id: string): SessionResult | null => {
    const sessions = getSessions();
    return sessions.find(s => s.id === id) || null;
};

export const calculateOverallScore = (sessions: SessionResult[]): number => {
    if (sessions.length === 0) return 0;

    const totalScore = sessions.reduce((sum, session) => {
        const avg = (
            session.scores.speech_fluency +
            session.scores.lexical_score +
            session.scores.coherence_score
        ) / 3;
        return sum + avg;
    }, 0);

    return Math.round(totalScore / sessions.length);
};

export const getLatestScores = (sessions: SessionResult[]) => {
    if (sessions.length === 0) {
        return {
            speech_fluency: 0,
            lexical_score: 0,
            coherence_score: 0,
        };
    }

    const latest = sessions[sessions.length - 1];
    return latest.scores;
};

export const getTrendData = (sessions: SessionResult[]) => {
    return sessions.map(session => ({
        date: new Date(session.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short'
        }),
        speech_fluency: session.scores.speech_fluency,
        lexical_score: session.scores.lexical_score,
        coherence_score: session.scores.coherence_score,
        overall: (
            session.scores.speech_fluency +
            session.scores.lexical_score +
            session.scores.coherence_score
        ) / 3,
    }));
};

export const getScoreTrend = (sessions: SessionResult[], metric: 'speech_fluency' | 'lexical_score' | 'coherence_score'): 'up' | 'down' | 'stable' => {
    if (sessions.length < 2) return 'stable';

    const latest = sessions[sessions.length - 1].scores[metric];
    const previous = sessions[sessions.length - 2].scores[metric];

    const diff = latest - previous;

    if (diff > 2) return 'up';
    if (diff < -2) return 'down';
    return 'stable';
};
