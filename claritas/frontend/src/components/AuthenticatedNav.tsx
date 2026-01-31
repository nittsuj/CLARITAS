import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../assets/images/logo-claritas.png';

interface GoogleUser {
    email: string;
    name: string;
    picture: string;
    sub: string;
}

const AuthenticatedNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<GoogleUser | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('claritas_current_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('claritas_current_user');
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                backgroundColor: '#ffffff',
                borderBottom: '2px solid #e5e7eb',
            }}
        >
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logoImage} alt="Claritas" style={{ height: '56px' }} />
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link
                        to="/dashboard"
                        style={{
                            color: isActive('/dashboard') ? '#2563eb' : '#6b7280',
                            fontWeight: isActive('/dashboard') ? 600 : 500,
                            textDecoration: 'none',
                            paddingBottom: '0.5rem',
                            borderBottom: isActive('/dashboard') ? '3px solid #2563eb' : '3px solid transparent',
                            transition: 'all 0.2s',
                        }}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/cogniview"
                        style={{
                            color: isActive('/cogniview') ? '#2563eb' : '#6b7280',
                            fontWeight: isActive('/cogniview') ? 600 : 500,
                            textDecoration: 'none',
                            paddingBottom: '0.5rem',
                            borderBottom: isActive('/cogniview') ? '3px solid #2563eb' : '3px solid transparent',
                            transition: 'all 0.2s',
                        }}
                    >
                        CogniView
                    </Link>
                    <Link
                        to="/dashboard"
                        style={{
                            color: '#6b7280',
                            fontWeight: 500,
                            textDecoration: 'none',
                            paddingBottom: '0.5rem',
                            borderBottom: '3px solid transparent',
                            transition: 'all 0.2s',
                        }}
                    >
                        CareView
                    </Link>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {user && (
                    <>
                        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                            Caregiver: <span style={{ fontWeight: 600, color: '#374151' }}>{user.name}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#2563eb',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                            }}
                        >
                            Keluar
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default AuthenticatedNav;
