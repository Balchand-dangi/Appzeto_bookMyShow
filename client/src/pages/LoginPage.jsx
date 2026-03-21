import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/movies';

    // Redirect if already logged in
    if (isAuthenticated) {
        navigate('/movies', { replace: true });
        return null;
    }

    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError('Please fill in all fields.');
            return;
        }
        try {
            setLoading(true);
            setError('');
            const res = await api.post('/auth/login', form);
            login(res.data.user, res.data.token);
            navigate(res.data.user.role === 'admin' ? '/admin' : from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)', padding: 'clamp(10px, 4vw, 24px) 10px 60px' }}>
            <div style={{ width: '100%', maxWidth: 'clamp(300px, 95vw, 420px)' }}>

                {/* Logo / Heading */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(20px, 6vw, 32px)' }}>
                    <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', marginBottom: '8px' }}>🎬</div>
                    <h1 className="page-title" style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', marginBottom: '8px', letterSpacing: '-0.3px' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>Sign in to continue booking tickets</p>
                </div>

                <div className="glass-card" style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                id="login-email"
                                className="form-input"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                id="login-password"
                                className="form-input"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button
                            id="login-submit"
                            className="btn btn-primary btn-full btn-lg"
                            type="submit"
                            disabled={loading}
                            style={{ marginTop: '8px' }}
                        >
                            {loading ? 'Signing in...' : '🔐 Sign In'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 'clamp(16px, 3vw, 24px)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'var(--text-secondary)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                            Create one
                        </Link>
                    </div>
                </div>

                {/* Demo hint */}
                <div style={{ marginTop: 'clamp(16px, 3vw, 24px)', padding: 'clamp(14px, 3vw, 20px)', background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(34, 197, 94, 0.08))', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', alignItems: 'flex-start', marginBottom: 'clamp(12px, 2vw, 16px)' }}>
                        <span style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', flexShrink: 0 }}>💡</span>
                        <div>
                            <div style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', fontWeight: '700', color: 'var(--cyan)', marginBottom: '8px' }}>Demo Accounts Guide</div>
                            <div style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                You can register with two roles:
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(140px, 100%, 180px), 1fr))', gap: 'clamp(10px, 2vw, 14px)' }}>
                        <div style={{ padding: 'clamp(10px, 2vw, 14px)', background: 'rgba(245, 197, 24, 0.1)', border: '1px solid rgba(245, 197, 24, 0.3)', borderRadius: '6px' }}>
                            <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', marginBottom: '6px' }}>👑</div>
                            <div style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', fontWeight: '600', color: 'var(--gold)', marginBottom: '4px' }}>Admin Role</div>
                            <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                Create & manage movies and show times
                            </div>
                        </div>

                        <div style={{ padding: 'clamp(10px, 2vw, 14px)', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)', borderRadius: '6px' }}>
                            <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', marginBottom: '6px' }}>👤</div>
                            <div style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', fontWeight: '600', color: 'var(--cyan)', marginBottom: '4px' }}>User Role</div>
                            <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                Browse movies & book tickets
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
