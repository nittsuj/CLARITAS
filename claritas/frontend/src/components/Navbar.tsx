import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import logoImage from '../assets/images/logo-claritas.png';

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

/**
 * Navbar component used on the public pages such as the landing page.
 */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<GoogleUser | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('claritas_current_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, []);

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const decoded: any = jwtDecode(credentialResponse.credential);
        const googleUser: GoogleUser = {
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          sub: decoded.sub,
        };

        // Store user data
        localStorage.setItem('claritas_current_user', JSON.stringify(googleUser));
        setUser(googleUser);

        // Navigate to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error decoding Google credential:', error);
      }
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
  };

  const handleLogout = () => {
    localStorage.removeItem('claritas_current_user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src={logoImage} alt="Claritas" style={{ height: '56px' }} />
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            {/* Center Navigation for Logged In Users */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginRight: '2rem' }}>
              <Link to="/dashboard" style={{ color: '#6b7280', fontWeight: 500, textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/cogniview" style={{ color: '#6b7280', fontWeight: 500, textDecoration: 'none' }}>CogniView</Link>
              <Link to="/careview" style={{ color: '#6b7280', fontWeight: 500, textDecoration: 'none' }}>CareView</Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={user.picture}
                alt={user.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid #2563eb',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                <span style={{ color: '#374151', fontWeight: 600, fontSize: '0.875rem' }}>
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <a href="#fitur" style={{ color: '#374151', fontWeight: 500, textDecoration: 'none' }}>
              Fitur
            </a>
            <a href="#tentang" style={{ color: '#374151', fontWeight: 500, textDecoration: 'none' }}>
              Tentang
            </a>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signin_with"
                shape="rectangular"
                theme="outline"
                size="medium"
              />
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;