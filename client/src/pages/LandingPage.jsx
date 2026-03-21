import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Redirect authenticated users to movie listing
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/movies', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleGetStarted = () => {
        navigate('/register');
    };

    const handleSignIn = () => {
        navigate('/login');
    };

    return (
        <div className="page" style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-elevated) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(8px, 3vw, 24px)', minHeight: 'auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 'clamp(280px, 95vw, 800px)', width: '100%' }}>
                {/* Welcome Section */}
                <div style={{ marginBottom: 'clamp(24px, 6vw, 60px)' }}>
                    {/* Hero Icon */}
                    <div style={{ fontSize: 'clamp(3rem, 12vw, 6rem)', marginBottom: 'clamp(12px, 3vw, 32px)', animation: 'pulse 2s infinite' }}>
                        🎬
                    </div>

                    {/* Welcome Title */}
                    <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 2.8rem)', fontWeight: '800', marginBottom: 'clamp(6px, 1.5vw, 16px)', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                        Welcome to
                    </h1>

                    {/* Main Heading */}
                    <h2 style={{ fontSize: 'clamp(1.6rem, 5.5vw, 3.5rem)', fontWeight: '900', marginBottom: 'clamp(12px, 3vw, 28px)', background: 'linear-gradient(135deg, var(--accent), var(--gold))', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent', lineHeight: '1.1' }}>
                        BookMyShow Lite++
                    </h2>

                    {/* Subheading */}
                    <p style={{ fontSize: 'clamp(0.8rem, 2.2vw, 1.1rem)', color: 'var(--text-secondary)', marginBottom: 'clamp(16px, 4vw, 36px)', lineHeight: '1.6' }}>
                        Your ultimate destination for hassle-free movie booking. Browse the latest releases, pick your perfect seats, and grab your tickets in just a few clicks!
                    </p>
                </div>

                {/* Features Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(130px, 48vw, 200px), 1fr))', gap: 'clamp(10px, 2.5vw, 20px)', marginBottom: 'clamp(24px, 6vw, 52px)', width: '100%' }}>
                    <div className="glass-card" style={{ padding: 'clamp(12px, 2.5vw, 24px)', textAlign: 'center', transition: 'all var(--transition)', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(229, 9, 20, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                        <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: 'clamp(8px, 2vw, 12px)' }}>🎭</div>
                        <div style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Latest Movies</div>
                        <div style={{ fontSize: 'clamp(0.65rem, 1.3vw, 0.85rem)', color: 'var(--text-muted)', lineHeight: '1.4' }}>Discover new releases, blockbusters & classics</div>
                    </div>

                    <div className="glass-card" style={{ padding: 'clamp(12px, 2.5vw, 24px)', textAlign: 'center', transition: 'all var(--transition)', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 212, 255, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                        <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: 'clamp(8px, 2vw, 12px)' }}>💺</div>
                        <div style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Choose Your Seats</div>
                        <div style={{ fontSize: 'clamp(0.65rem, 1.3vw, 0.85rem)', color: 'var(--text-muted)', lineHeight: '1.4' }}>Pick your perfect spot</div>
                    </div>

                    <div className="glass-card" style={{ padding: 'clamp(12px, 2.5vw, 24px)', textAlign: 'center', transition: 'all var(--transition)', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(34, 197, 94, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                        <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: 'clamp(8px, 2vw, 12px)' }}>🎟️</div>
                        <div style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Instant Booking</div>
                        <div style={{ fontSize: 'clamp(0.65rem, 1.3vw, 0.85rem)', color: 'var(--text-muted)', lineHeight: '1.4' }}>Secure & fast booking</div>
                    </div>

                    <div className="glass-card" style={{ padding: 'clamp(12px, 2.5vw, 24px)', textAlign: 'center', transition: 'all var(--transition)', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(245, 197, 24, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                        <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: 'clamp(8px, 2vw, 12px)' }}>⚡</div>
                        <div style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Fast & Easy</div>
                        <div style={{ fontSize: 'clamp(0.65rem, 1.3vw, 0.85rem)', color: 'var(--text-muted)', lineHeight: '1.4' }}>Minimal steps</div>
                    </div>

                    <div className="glass-card" style={{ padding: 'clamp(12px, 2.5vw, 24px)', textAlign: 'center', transition: 'all var(--transition)', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 212, 255, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                        <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: 'clamp(8px, 2vw, 12px)' }}>🔒</div>
                        <div style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Secure & Safe</div>
                        <div style={{ fontSize: 'clamp(0.65rem, 1.3vw, 0.85rem)', color: 'var(--text-muted)', lineHeight: '1.4' }}>Protected data</div>
                    </div>

                    <div className="glass-card" style={{ padding: 'clamp(12px, 2.5vw, 24px)', textAlign: 'center', transition: 'all var(--transition)', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(34, 197, 94, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                        <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: 'clamp(8px, 2vw, 12px)' }}>📱</div>
                        <div style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Mobile Friendly</div>
                        <div style={{ fontSize: 'clamp(0.65rem, 1.3vw, 0.85rem)', color: 'var(--text-muted)', lineHeight: '1.4' }}>Book anytime</div>
                    </div>
                </div>

                {/* How It Works Section */}
                <div style={{ marginBottom: 'clamp(20px, 5vw, 52px)', padding: 'clamp(14px, 3vw, 32px)', background: 'rgba(0, 212, 255, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: '700', color: 'var(--cyan)', marginBottom: 'clamp(12px, 2.5vw, 24px)' }}>How It Works 🎯</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(100px, 45vw, 150px), 1fr))', gap: 'clamp(8px, 2vw, 16px)', color: 'var(--text-muted)', fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)' }}>
                        <div style={{ padding: 'clamp(8px, 2vw, 12px)', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                            <div style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: 'clamp(4px, 1vw, 8px)' }}>1️⃣</div>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px', fontSize: 'clamp(0.75rem, 1.8vw, 0.95rem)' }}>Sign Up</div>
                            <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)' }}>Create account</div>
                        </div>
                        <div style={{ padding: 'clamp(8px, 2vw, 12px)', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                            <div style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: 'clamp(4px, 1vw, 8px)' }}>2️⃣</div>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px', fontSize: 'clamp(0.75rem, 1.8vw, 0.95rem)' }}>Browse</div>
                            <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)' }}>Find movies</div>
                        </div>
                        <div style={{ padding: 'clamp(8px, 2vw, 12px)', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                            <div style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: 'clamp(4px, 1vw, 8px)' }}>3️⃣</div>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px', fontSize: 'clamp(0.75rem, 1.8vw, 0.95rem)' }}>Seats</div>
                            <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)' }}>Pick spots</div>
                        </div>
                        <div style={{ padding: 'clamp(8px, 2vw, 12px)', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                            <div style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: 'clamp(4px, 1vw, 8px)' }}>4️⃣</div>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px', fontSize: 'clamp(0.75rem, 1.8vw, 0.95rem)' }}>Pay</div>
                            <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)' }}>Get tickets</div>
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2vw, 16px)', width: '100%', marginBottom: 'clamp(20px, 4vw, 48px)' }}>
                    <button
                        onClick={handleGetStarted}
                        className="btn btn-primary"
                        style={{
                            padding: 'clamp(12px, 2vw, 18px) clamp(16px, 4vw, 40px)',
                            fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
                            fontWeight: '700',
                            width: '100%',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            transition: 'all var(--transition)',
                            border: 'none',
                            background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                            color: 'white',
                            boxShadow: '0 0 20px rgba(229, 9, 20, 0.3)',
                            letterSpacing: '0.5px',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.boxShadow = '0 0 40px rgba(229, 9, 20, 0.6)';
                            e.target.style.transform = 'translateY(-3px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.boxShadow = '0 0 20px rgba(229, 9, 20, 0.3)';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        🚀 Get Started
                    </button>

                    <button
                        onClick={handleSignIn}
                        className="btn btn-secondary"
                        style={{
                            padding: 'clamp(14px, 2.5vw, 18px) clamp(24px, 5vw, 40px)',
                            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                            fontWeight: '700',
                            width: '100%',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            transition: 'all var(--transition)',
                            background: 'transparent',
                            border: '2px solid var(--cyan)',
                            color: 'var(--cyan)',
                            letterSpacing: '0.5px',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(0, 212, 255, 0.1)';
                            e.target.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.4)';
                            e.target.style.transform = 'translateY(-3px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.boxShadow = 'none';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        🔑 Sign In
                    </button>
                </div>

                {/* Footer Info */}
                <div style={{ paddingTop: 'clamp(16px, 3vw, 32px)', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 'clamp(0.7rem, 1.3vw, 0.9rem)' }}>
                    <p style={{ lineHeight: '1.6', marginBottom: 'clamp(8px, 2vw, 12px)' }}>
                        🎬 <strong>BookMyShow Lite++</strong> - Premium Movie Booking
                    </p>
                    <p style={{ lineHeight: '1.5', marginBottom: 'clamp(10px, 2vw, 12px)', fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)' }}>
                        Book your favorite movies in seconds!
                    </p>
                    <div style={{ display: 'flex', gap: 'clamp(6px, 1.5vw, 12px)', justifyContent: 'center', flexWrap: 'wrap', fontSize: 'clamp(0.65rem, 1.1vw, 0.8rem)' }}>
                        <span style={{ padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '20px', border: '1px solid var(--cyan)' }}>✓ Secure</span>
                        <span style={{ padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '20px', border: '1px solid var(--green)' }}>✓ Fast</span>
                        <span style={{ padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)', background: 'rgba(245, 197, 24, 0.1)', borderRadius: '20px', border: '1px solid var(--gold)' }}>✓ Reliable</span>
                    </div>
                </div>
            </div>

            {/* Pulse animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.05);
                    }
                }

                @media (max-width: 768px) {
                    .btn-primary, .btn-secondary {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
