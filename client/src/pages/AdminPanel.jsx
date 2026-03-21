import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const INITIAL_MOVIE = { title: '', description: '', duration: '', genre: '', releaseDate: '', cast: '', language: '' };
const INITIAL_SHOW = { movieId: '', time: '', totalSeats: 30 };

const GENRE_OPTIONS = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Animation', 'Documentary', 'Action / Sci-Fi'];
const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali'];

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('add-movie');
    const [movieForm, setMovieForm] = useState(INITIAL_MOVIE);
    const [showForm, setShowForm] = useState(INITIAL_SHOW);
    const [movies, setMovies] = useState([]);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (activeTab === 'movies') fetchMovies();
        if (activeTab === 'shows') fetchShows();
        if (activeTab === 'add-show') fetchMovies();
        setSuccess(''); setError('');
    }, [activeTab]);

    const fetchMovies = async () => {
        try {
            const res = await adminAPI.getMovies();
            setMovies(res.data.movies || []);
        } catch (err) { setError('Failed to load movies'); }
    };

    const fetchShows = async () => {
        try {
            const res = await adminAPI.getShows();
            setShows(res.data.shows || []);
        } catch (err) { setError('Failed to load shows'); }
    };

    const handleCreateMovie = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); setError(''); setSuccess('');
            const castArray = movieForm.cast.split(',').map(s => s.trim()).filter(Boolean);
            await adminAPI.createMovie({ ...movieForm, duration: Number(movieForm.duration), cast: castArray });
            setSuccess('✅ Movie created successfully!');
            setMovieForm(INITIAL_MOVIE);
        } catch (err) {
            const errs = err.response?.data?.errors;
            setError(errs ? errs.join('\n') : (err.response?.data?.message || 'Failed to create movie'));
        } finally { setLoading(false); }
    };

    const handleCreateShow = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); setError(''); setSuccess('');
            await adminAPI.createShow({ movieId: showForm.movieId, time: showForm.time, totalSeats: 30 });
            setSuccess('✅ Show created successfully! 30 seats auto-generated.');
            setShowForm(INITIAL_SHOW);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create show');
        } finally { setLoading(false); }
    };

    const durationLabel = (min) => {
        const h = Math.floor(min / 60), m = min % 60;
        return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
    };

    const TABS = [
        { id: 'add-movie', label: '+ Add Movie' },
        { id: 'add-show', label: '+ Add Show' },
        { id: 'movies', label: 'All Movies' },
        { id: 'shows', label: 'All Shows' },
    ];

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title gradient-text">Admin Panel</h1>
                    <p className="page-subtitle">Manage movies and show schedules on the platform</p>
                </div>

                <div className="tabs" style={{ marginBottom: '28px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    {TABS.map(t => (
                        <button key={t.id} className={`tab${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)} style={{ whiteSpace: 'nowrap', minWidth: 'fit-content' }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">⚠️ <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 'clamp(0.7rem, 2vw, 0.85rem)' }}>{error}</pre></div>}

                {/* Add Movie Form */}
                {activeTab === 'add-movie' && (
                    <div className="glass-card" style={{ padding: 'clamp(16px, 4vw, 28px)', maxWidth: '680px' }}>
                        <div className="section-title">Create New Movie</div>
                        <form onSubmit={handleCreateMovie}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(140px, 100%, 300px), 1fr))', gap: 'clamp(12px, 2vw, 16px)' }}>
                                <div className="form-group">
                                    <label className="form-label">Movie Title *</label>
                                    <input className="form-input" id="movie-title" placeholder="e.g. Avengers: Endgame" value={movieForm.title}
                                        onChange={e => setMovieForm(p => ({ ...p, title: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Duration (minutes) *</label>
                                    <input className="form-input" id="movie-duration" type="number" min="1" placeholder="e.g. 181" value={movieForm.duration}
                                        onChange={e => setMovieForm(p => ({ ...p, duration: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Genre *</label>
                                    <select className="form-select" id="movie-genre" value={movieForm.genre}
                                        onChange={e => setMovieForm(p => ({ ...p, genre: e.target.value }))} required>
                                        <option value="">Select genre</option>
                                        {GENRE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Language *</label>
                                    <select className="form-select" id="movie-language" value={movieForm.language}
                                        onChange={e => setMovieForm(p => ({ ...p, language: e.target.value }))} required>
                                        <option value="">Select language</option>
                                        {LANGUAGE_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Release Date *</label>
                                    <input className="form-input" id="movie-release-date" type="date" value={movieForm.releaseDate}
                                        onChange={e => setMovieForm(p => ({ ...p, releaseDate: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Cast (comma-separated) *</label>
                                    <input className="form-input" id="movie-cast" placeholder="Robert Downey Jr., Chris Evans" value={movieForm.cast}
                                        onChange={e => setMovieForm(p => ({ ...p, cast: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description *</label>
                                <textarea className="form-textarea" id="movie-description" rows="3" placeholder="Brief plot summary..." value={movieForm.description}
                                    onChange={e => setMovieForm(p => ({ ...p, description: e.target.value }))} required />
                            </div>
                            <button className="btn btn-primary btn-lg" type="submit" id="create-movie-btn" disabled={loading} style={{ width: '100%' }}>
                                {loading ? 'Creating...' : '🎬 Create Movie'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Add Show Form */}
                {activeTab === 'add-show' && (
                    <div className="glass-card" style={{ padding: '28px', maxWidth: '500px' }}>
                        <div className="section-title">Create New Show</div>
                        <form onSubmit={handleCreateShow}>
                            <div className="form-group">
                                <label className="form-label">Select Movie *</label>
                                <select className="form-select" id="show-movie-select" value={showForm.movieId}
                                    onChange={e => setShowForm(p => ({ ...p, movieId: e.target.value }))} required>
                                    <option value="">Choose a movie</option>
                                    {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Show Time *</label>
                                <input className="form-input" id="show-time" placeholder="e.g. 7:00 PM" value={showForm.time}
                                    onChange={e => setShowForm(p => ({ ...p, time: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Total Seats</label>
                                <input className="form-input" value={30} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Fixed at 30 seats. Auto-generated on creation.</small>
                            </div>
                            <button className="btn btn-primary btn-lg" type="submit" id="create-show-btn" disabled={loading}>
                                {loading ? 'Creating...' : '🎭 Create Show'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Movies List */}
                {activeTab === 'movies' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                            <div className="section-title" style={{ margin: 0 }}>All Movies ({movies.length})</div>
                            <button className="btn btn-secondary btn-sm" onClick={fetchMovies}>↻ Refresh</button>
                        </div>
                        {movies.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🎬</div>
                                <div className="empty-state-title">No movies yet</div>
                                <div className="empty-state-desc">Use the "Add Movie" tab to create one</div>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Genre</th>
                                            <th>Duration</th>
                                            <th>Language</th>
                                            <th>Release Date</th>
                                            <th>Cast</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movies.map(m => (
                                            <tr key={m._id}>
                                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.title}</td>
                                                <td><span className="badge badge-accent">{m.genre}</span></td>
                                                <td>{durationLabel(m.duration)}</td>
                                                <td>{m.language}</td>
                                                <td>{new Date(m.releaseDate).toLocaleDateString('en-IN')}</td>
                                                <td style={{ maxWidth: '200px' }}>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                        {m.cast.slice(0, 2).map((c, i) => <span key={i} className="badge badge-muted" style={{ fontSize: '0.72rem' }}>{c}</span>)}
                                                        {m.cast.length > 2 && <span className="badge badge-muted" style={{ fontSize: '0.72rem' }}>+{m.cast.length - 2}</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* Shows List */}
                {activeTab === 'shows' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                            <div className="section-title" style={{ margin: 0 }}>All Shows ({shows.length})</div>
                            <button className="btn btn-secondary btn-sm" onClick={fetchShows}>↻ Refresh</button>
                        </div>
                        {shows.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🎭</div>
                                <div className="empty-state-title">No shows yet</div>
                                <div className="empty-state-desc">Use the "Add Show" tab to create one</div>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Movie</th>
                                            <th>Time</th>
                                            <th>Total Seats</th>
                                            <th>Booked</th>
                                            <th>Available</th>
                                            <th>Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shows.map(s => {
                                            const bookedCount = s.seats?.filter(seat => seat.isBooked).length || 0;
                                            const available = (s.totalSeats || 30) - bookedCount;
                                            return (
                                                <tr key={s._id}>
                                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.movieId?.title || 'N/A'}</td>
                                                    <td><span className="badge badge-cyan">{s.time}</span></td>
                                                    <td>{s.totalSeats}</td>
                                                    <td><span className="badge badge-accent">{bookedCount}</span></td>
                                                    <td><span className={`badge ${available <= 5 ? 'badge-accent' : 'badge-green'}`}>{available}</span></td>
                                                    <td style={{ color: 'var(--text-muted)' }}>{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
