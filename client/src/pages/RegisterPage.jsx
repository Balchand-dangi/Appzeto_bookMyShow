import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function RegisterPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    if (isAuthenticated) {
        navigate('/movies', { replace: true });
        return null;
    }

    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            setError('Please fill in all fields.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        try {
            setLoading(true);
            setError('');
            const res = await api.post('/auth/register', form);
            login(res.data.user, res.data.token);
            navigate(res.data.user.role === 'admin' ? '/admin' : '/movies', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)', padding: 'clamp(10px, 4vw, 24px) 10px 60px' }}>
            <div style={{ width: '100%', maxWidth: 'clamp(300px, 95vw, 440px)' }}>

                {/* Heading */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(20px, 6vw, 32px)' }}>
                    <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', marginBottom: '8px' }}>🎟️</div>
                    <h1 className="page-title" style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', marginBottom: '8px', letterSpacing: '-0.3px' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>Join BookMyShow Lite++ to start booking</p>
                </div>

                <div className="glass-card" style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                id="register-name"
                                className="form-input"
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                id="register-email"
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
                            <label className="form-label">Password <span style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.68rem, 1.5vw, 0.78rem)' }}>(min. 6 chars)</span></label>
                            <input
                                id="register-password"
                                className="form-input"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Account Type</label>
                            <div style={{ display: 'flex', gap: 'clamp(8px, 3vw, 12px)', flexWrap: 'wrap' }}>
                                {['user', 'admin'].map(r => (
                                    <label
                                        key={r}
                                        id={`role-${r}`}
                                        style={{
                                            flex: 1,
                                            minWidth: '140px',
                                            padding: 'clamp(10px, 2.5vw, 12px)',
                                            border: `2px solid ${form.role === r ? 'var(--accent)' : 'var(--border)'}`,
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            background: form.role === r ? 'var(--accent-dim)' : 'var(--bg-secondary)',
                                            transition: 'all var(--transition)',
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={r}
                                            checked={form.role === r}
                                            onChange={handleChange}
                                            style={{ accentColor: 'var(--accent)' }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', textTransform: 'capitalize', color: form.role === r ? 'var(--accent)' : 'var(--text-primary)' }}>
                                                {r === 'admin' ? '👑 Admin' : '👤 User'}
                                            </div>
                                            <div style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.72rem)', color: 'var(--text-muted)' }}>
                                                {r === 'admin' ? 'Manage movies & shows' : 'Book movie tickets'}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            id="register-submit"
                            className="btn btn-primary btn-full btn-lg"
                            type="submit"
                            disabled={loading}
                            style={{ marginTop: '8px' }}
                        >
                            {loading ? 'Creating account...' : '🚀 Create Account'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 'clamp(16px, 3vw, 24px)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'var(--text-secondary)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                            Sign in
                        </Link>
                    </div>
                </div>

                {/* Role info section */}
                <div style={{ marginTop: 'clamp(16px, 3vw, 24px)', padding: 'clamp(14px, 3vw, 20px)', background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(34, 197, 94, 0.08))', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', alignItems: 'flex-start', marginBottom: 'clamp(12px, 2vw, 16px)' }}>
                        <span style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', flexShrink: 0 }}>ℹ️</span>
                        <div>
                            <div style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', fontWeight: '700', color: 'var(--cyan)', marginBottom: '8px' }}>Choose Your Role</div>
                            <div style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                Select the role that best fits your needs:
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(140px, 100%, 180px), 1fr))', gap: 'clamp(10px, 2vw, 14px)' }}>
                        <div style={{ padding: 'clamp(10px, 2vw, 14px)', background: 'rgba(245, 197, 24, 0.1)', border: '1px solid rgba(245, 197, 24, 0.3)', borderRadius: '6px' }}>
                            <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', marginBottom: '6px' }}>👑</div>
                            <div style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', fontWeight: '600', color: 'var(--gold)', marginBottom: '4px' }}>Admin</div>
                            <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                Manage movies & show times
                            </div>
                        </div>

                        <div style={{ padding: 'clamp(10px, 2vw, 14px)', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)', borderRadius: '6px' }}>
                            <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', marginBottom: '6px' }}>👤</div>
                            <div style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', fontWeight: '600', color: 'var(--cyan)', marginBottom: '4px' }}>User</div>
                            <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                Browse & book tickets
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
