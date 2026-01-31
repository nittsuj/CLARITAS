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
                position: 'sticky',
                top: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 2rem',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e5e7eb',
                zIndex: 100,
            }}
        >
            {/* Logo - Left */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img src={logoImage} alt="Claritas" style={{ height: '48px' }} />
            </Link>

            {/* Navigation Tabs - Center */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link
                    to="/dashboard"
                    style={{
                        color: isActive('/dashboard') ? '#2563eb' : '#6b7280',
                        fontWeight: isActive('/dashboard') ? 600 : 500,
                        textDecoration: 'none',
                        padding: '1rem 0',
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
                        padding: '1rem 0',
                        borderBottom: isActive('/cogniview') ? '3px solid #2563eb' : '3px solid transparent',
                        transition: 'all 0.2s',
                    }}
                >
                    CogniView
                </Link>
                <Link
                    to="/careview"
                    style={{
                        color: isActive('/careview') ? '#2563eb' : '#6b7280',
                        fontWeight: isActive('/careview') ? 600 : 500,
                        textDecoration: 'none',
                        padding: '1rem 0',
                        borderBottom: isActive('/careview') ? '3px solid #2563eb' : '3px solid transparent',
                        transition: 'all 0.2s',
                    }}
                >
                    CareView
                </Link>
            </div>

            {/* Right Side - Fitur, Tentang, User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <a
                    href="/#fitur"
                    style={{
                        color: '#6b7280',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                    }}
                >
                    Fitur
                </a>
                <a
                    href="/#tentang"
                    style={{
                        color: '#6b7280',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                    }}
                >
                    Tentang
                </a>

                {user && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img
                                src={user.picture}
                                alt={user.name}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    border: '2px solid #e5e7eb',
                                }}
                            />
                            <span style={{ color: '#374151', fontSize: '0.9rem', fontWeight: 500 }}>
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
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                            }}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default AuthenticatedNav;
