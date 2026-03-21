import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { moviesAPI, showsAPI } from '../services/api';

export default function MovieDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [movie, setMovie] = useState(null);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Parallel API calls using Promise.all for better performance
            const promises = [
                moviesAPI.getById(id),
                showsAPI.getByMovieId(id),
            ];

            const [movieRes, showsRes] = await Promise.all(promises);
            setMovie(movieRes.data.movie);
            setShows(showsRes.data.shows || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load movie details');
        } finally {
            setLoading(false);
        }
    };

    const durationLabel = (min) => {
        const h = Math.floor(min / 60);
        const m = min % 60;
        return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}` : `${m}m`;
    };

    const getAvailableSeats = (show) => {
        if (!show.seats) return show.totalSeats;
        return show.seats.filter(s => !s.isBooked && !s.lockedBy).length;
    };

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading-center">
                        <div className="spinner"></div>
                        <span>Loading movie details...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">⚠️ {error || 'Movie not found'}</div>
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>← Back to Movies</button>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>
                    ← Back
                </button>

                {/* Movie Header */}
                <div className="glass-card" style={{ padding: 'clamp(16px, 4vw, 28px)', marginBottom: 'clamp(20px, 4vw, 28px)' }}>
                    <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 24px)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', background: 'var(--bg-elevated)', width: 'clamp(80px, 20vw, 100px)', height: 'clamp(110px, 25vw, 130px)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            🎬
                        </div>
                        <div style={{ flex: 1, minWidth: '220px' }}>
                            <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: '800', marginBottom: '12px', lineHeight: '1.2' }}>{movie.title}</h1>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(6px, 2vw, 8px)', marginBottom: '16px' }}>
                                <span className="badge badge-accent">{movie.genre}</span>
                                <span className="badge badge-muted">🕐 {durationLabel(movie.duration)}</span>
                                <span className="badge badge-cyan">🌐 {movie.language}</span>
                                <span className="badge badge-gold">📅 {new Date(movie.releaseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>{movie.description}</p>
                            <div style={{ display: 'flex', gap: 'clamp(6px, 2vw, 8px)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px', whiteSpace: 'nowrap' }}>CAST:</span>
                                <div style={{ display: 'flex', gap: 'clamp(4px, 1vw, 6px)', flexWrap: 'wrap' }}>
                                    {movie.cast.map((actor, i) => (
                                        <span key={i} className="badge badge-muted" style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)' }}>👤 {actor}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shows */}
                <div className="section">
                    <div className="section-title">Available Shows</div>
                    {shows.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🎭</div>
                            <div className="empty-state-title">No shows scheduled</div>
                            <div className="empty-state-desc">Check back later or ask the admin to add shows</div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 80vw, 220px), 1fr))', gap: 'clamp(12px, 3vw, 24px)' }}>
                            {shows.map(show => {
                                const available = getAvailableSeats(show);
                                const isAlmostFull = available <= 5;
                                return (
                                    <div
                                        key={show._id}
                                        className="card"
                                        style={{ padding: 'clamp(14px, 3vw, 20px)', cursor: 'pointer' }}
                                        onClick={() => navigate(`/shows/${show._id}/seats`, { state: { movie, show } })}
                                    >
                                        <div style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', marginBottom: '10px' }}>🕐</div>
                                        <div style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', fontWeight: '800', marginBottom: '6px' }}>{show.time}</div>
                                        <div style={{ display: 'flex', gap: 'clamp(4px, 1vw, 6px)', marginBottom: '14px', flexWrap: 'wrap' }}>
                                            <span className={`badge ${isAlmostFull ? 'badge-accent' : 'badge-green'}`}>
                                                {available} seats left
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', color: 'var(--text-muted)', marginBottom: '14px' }}>
                                            <span>Row A: ₹150</span>
                                            <span>Row B: ₹180</span>
                                            <span>Row C: ₹200</span>
                                        </div>
                                        <button className="btn btn-primary btn-full btn-sm">Select Seats</button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
