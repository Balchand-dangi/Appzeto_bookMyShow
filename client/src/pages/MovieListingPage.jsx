import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { moviesAPI } from '../services/api';

const GENRE_COLORS = {
    'Action': 'badge-accent',
    'Comedy': 'badge-gold',
    'Drama': 'badge-cyan',
    'Sci-Fi': 'badge-accent',
    'Horror': 'badge-muted',
    'Romance': 'badge-gold',
    'Thriller': 'badge-cyan',
};

const GENRE_EMOJIS = ['🎬', '🎭', '🎪', '🎥', '🍿', '🎞️', '✨', '🌟'];

export default function MovieListingPage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const res = await moviesAPI.getAll();
            setMovies(res.data.movies || []);
        } catch (err) {
            setError('Failed to load movies. Make sure the server is running.');
        } finally {
            setLoading(false);
        }
    };

    const durationLabel = (min) => {
        if (!min) return '';
        const h = Math.floor(min / 60);
        const m = min % 60;
        return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}` : `${m}m`;
    };

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading-center">
                        <div className="spinner"></div>
                        <span>Loading movies...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title gradient-text">Now Showing</h1>
                    <p className="page-subtitle">Browse all movies and book your seats in seconds</p>
                </div>

                {error && <div className="alert alert-error">⚠️ {error}</div>}

                {movies.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎬</div>
                        <div className="empty-state-title">No movies yet</div>
                        <div className="empty-state-desc">Ask the admin to add some movies</div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(160px, 80vw, 280px), 1fr))', gap: 'clamp(12px, 3vw, 24px)' }}>
                        {movies.map((movie, idx) => (
                            <div
                                key={movie._id}
                                className="card movie-card"
                                onClick={() => navigate(`/movies/${movie._id}`)}
                            >
                                <div className="movie-card-poster">
                                    {GENRE_EMOJIS[idx % GENRE_EMOJIS.length]}
                                </div>
                                <div className="movie-card-body">
                                    <h3 className="movie-card-title">{movie.title}</h3>
                                    <div className="movie-card-meta">
                                        <span className={`badge ${GENRE_COLORS[movie.genre] || 'badge-cyan'}`}>
                                            {movie.genre}
                                        </span>
                                        <span className="badge badge-muted">🕐 {durationLabel(movie.duration)}</span>
                                        <span className="badge badge-muted">🌐 {movie.language}</span>
                                    </div>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
                                        {movie.description.slice(0, 90)}{movie.description.length > 90 ? '…' : ''}
                                    </p>
                                </div>
                                <div className="movie-card-actions">
                                    <button className="btn btn-primary btn-full">Book Tickets →</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
