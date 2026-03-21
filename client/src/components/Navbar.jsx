import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/welcome', { replace: true });
        setMobileMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <NavLink to={isAuthenticated ? "/movies" : "/welcome"} className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
                    🎬 <span>Book<span className="accent">My</span>Show</span>
                </NavLink>

                {/* Mobile menu toggle */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                    style={{
                        display: 'none',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                    }}
                    id="mobile-menu-toggle"
                >
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>

                <div
                    className="navbar-links"
                    id="navbar-links"
                    style={{
                        display: 'flex',
                    }}
                >
                    {isAuthenticated && (
                        <NavLink
                            to="/movies"
                            end
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Movies
                        </NavLink>
                    )}

                    {isAuthenticated && (
                        <NavLink
                            to="/bookings"
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            My Bookings
                        </NavLink>
                    )}

                    {isAdmin && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Admin Panel
                        </NavLink>
                    )}

                    {isAuthenticated ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px', flexWrap: 'wrap' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                fontSize: '0.8rem',
                                minWidth: 0,
                            }}>
                                <span style={{ color: isAdmin ? 'var(--gold)' : 'var(--cyan)', flexShrink: 0 }}>
                                    {isAdmin ? '👑' : '👤'}
                                </span>
                                <span style={{ color: 'var(--text-secondary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user?.name}
                                </span>
                                {isAdmin && (
                                    <span style={{ fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.5px', flexShrink: 0 }}>ADMIN</span>
                                )}
                            </div>
                            <button
                                id="logout-btn"
                                className="btn btn-ghost btn-sm"
                                onClick={handleLogout}
                                style={{ padding: '6px 12px', whiteSpace: 'nowrap' }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '6px', marginLeft: '4px', flexWrap: 'wrap' }}>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="btn btn-primary btn-sm"
                                style={{ textDecoration: 'none' }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Register
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile menu styles */}
            <style>{`
                @media (max-width: 768px) {
                    #mobile-menu-toggle {
                        display: block !important;
                        z-index: 101;
                        transition: all var(--transition);
                    }

                    #mobile-menu-toggle:hover {
                        color: var(--accent);
                        transform: scale(1.1);
                    }

                    #navbar-links {
                        position: absolute;
                        top: 60px;
                        left: 0;
                        right: 0;
                        background: rgba(10, 11, 15, 0.95);
                        backdrop-filter: blur(20px);
                        border-bottom: 1px solid var(--border);
                        flex-direction: column !important;
                        gap: 2px !important;
                        padding: 8px;
                        display: ${mobileMenuOpen ? 'flex' : 'none'} !important;
                        max-height: calc(100vh - 60px);
                        overflow-y: auto;
                        animation: ${mobileMenuOpen ? 'slideDown 0.3s ease-out' : 'slideUp 0.3s ease-in'};
                    }

                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes slideUp {
                        from {
                            opacity: 1;
                            transform: translateY(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                    }

                    .nav-link {
                        width: 100%;
                        text-align: left;
                        padding: 10px 12px;
                        border-radius: var(--radius-sm);
                        color: var(--text-primary);
                        transition: all var(--transition);
                        border-left: 3px solid transparent;
                        animation: slideInLeft 0.3s ease-out backwards;
                    }

                    .nav-link:nth-child(1) { animation-delay: 0.05s; }
                    .nav-link:nth-child(2) { animation-delay: 0.1s; }
                    .nav-link:nth-child(3) { animation-delay: 0.15s; }
                    .nav-link:nth-child(4) { animation-delay: 0.2s; }

                    .nav-link:hover {
                        background: rgba(229, 9, 20, 0.15);
                        border-left-color: var(--accent);
                        transform: translateX(4px);
                    }

                    .nav-link.active {
                        background: linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(245, 197, 24, 0.1));
                        border-left-color: var(--accent);
                        animation: glow 0.6s ease-in-out infinite;
                    }

                    .navbar-links > div {
                        flex-direction: column !important;
                        width: 100%;
                        gap: 8px !important;
                        animation: slideInUp 0.4s ease-out;
                    }

                    .navbar-links > div > div:first-child {
                        width: 100%;
                        background: linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(34, 197, 94, 0.08));
                        border: 1px solid rgba(0, 212, 255, 0.2);
                        padding: 8px 12px;
                        border-radius: var(--radius-sm);
                        animation: slideInUp 0.4s ease-out 0.05s backwards;
                        transition: all var(--transition);
                    }

                    .navbar-links > div > div:first-child:hover {
                        background: linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(34, 197, 94, 0.15));
                        border-color: rgba(0, 212, 255, 0.4);
                    }

                    .navbar-links > div > button {
                        width: 100%;
                        background: linear-gradient(135deg, var(--accent), var(--accent-light));
                        color: white;
                        border: none;
                        font-weight: 600;
                        padding: 10px 12px;
                        border-radius: var(--radius-sm);
                        cursor: pointer;
                        transition: all var(--transition);
                        animation: slideInUp 0.4s ease-out 0.1s backwards;
                    }

                    .navbar-links > div > button:hover {
                        box-shadow: 0 0 20px rgba(229, 9, 20, 0.4);
                        transform: translateY(-2px);
                    }

                    .navbar-links > div > button:active {
                        transform: scale(0.98);
                    }
                }
            `}</style>
        </nav>
    );
}
