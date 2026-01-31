import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config/google-oauth';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CogniView from './pages/CogniView';
import CareView from './pages/CareView';
import SessionResult from './pages/SessionResult';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cogniview" element={<CogniView />} />
        <Route path="/careview" element={<CareView />} />
        <Route path="/session-result/:sessionId" element={<SessionResult />} />
        <Route path="/result" element={<SessionResult />} />
      </Routes>
    </GoogleOAuthProvider>
  );
};

export default App;