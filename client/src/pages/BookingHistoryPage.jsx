import { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BookingHistoryPage() {
    const { user, isAdmin } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchId, setSearchId] = useState('');
    const [activeUserId, setActiveUserId] = useState(user?.id || '');

    useEffect(() => {
        if (user?.id) {
            setActiveUserId(user.id);
        }
    }, [user]);

    useEffect(() => {
        if (activeUserId) fetchBookings(activeUserId);
    }, [activeUserId]);

    const fetchBookings = async (uid) => {
        try {
            setLoading(true);
            setError('');
            const res = await bookingAPI.getByUserId(uid);
            setBookings(res.data.bookings || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load bookings');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminSearch = () => {
        const trimmed = searchId.trim();
        if (trimmed) setActiveUserId(trimmed);
    };

    const handleResetToSelf = () => {
        setSearchId('');
        setActiveUserId(user?.id || '');
    };

    const getMovieTitle = (booking) => {
        if (booking.movieId?.title) return booking.movieId.title;
        if (booking.showId?.movieId?.title) return booking.showId.movieId.title;
        return 'N/A';
    };

    const getShowTime = (booking) => booking.showId?.time || 'N/A';

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title gradient-text">My Bookings</h1>
                    <p className="page-subtitle">Your complete ticket booking history</p>
                </div>

                {/* Context bar: who are we viewing? */}
                <div className="glass-card" style={{ padding: 'clamp(12px, 2.5vw, 16px) clamp(12px, 3vw, 20px)', marginBottom: '24px', display: 'flex', gap: 'clamp(8px, 2vw, 12px)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 8px)', flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                            Viewing:
                        </span>
                        <span style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)', color: 'var(--text-primary)', fontWeight: 500, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {activeUserId === user?.id ? (
                                <><span style={{ color: 'var(--cyan)' }}>👤 {user?.name}</span>{' '}<span style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.7rem, 1.2vw, 0.78rem)' }}>(you)</span></>
                            ) : (
                                <span style={{ color: 'var(--gold)' }}>🔍 User ID: {activeUserId}</span>
                            )}
                        </span>
                        {activeUserId !== user?.id && (
                            <button className="btn btn-ghost btn-sm" onClick={handleResetToSelf} style={{ whiteSpace: 'nowrap' }}>
                                ← Back to mine
                            </button>
                        )}
                    </div>

                    {/* Admin-only user search */}
                    {isAdmin && (
                        <div style={{ display: 'flex', gap: 'clamp(6px, 1.5vw, 8px)', alignItems: 'center', width: '100%', minWidth: 0 }}>
                            <span style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.78rem)', color: 'var(--gold)', fontWeight: 600, whiteSpace: 'nowrap' }}>👑 Search:</span>
                            <input
                                id="admin-user-search"
                                className="form-input"
                                style={{ maxWidth: 'clamp(120px, 80vw, 200px)', padding: '8px 12px', fontSize: '0.8rem', flex: 1, minWidth: '100px' }}
                                value={searchId}
                                onChange={e => setSearchId(e.target.value)}
                                placeholder="Paste user ID..."
                                onKeyDown={e => e.key === 'Enter' && handleAdminSearch()}
                            />
                            <button className="btn btn-primary btn-sm" onClick={handleAdminSearch} disabled={!searchId.trim()} style={{ whiteSpace: 'nowrap' }}>
                                Search
                            </button>
                        </div>
                    )}
                </div>

                {error && <div className="alert alert-error">⚠️ {error}</div>}

                {loading ? (
                    <div className="loading-center"><div className="spinner"></div><span>Loading bookings...</span></div>
                ) : bookings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎟️</div>
                        <div className="empty-state-title">No bookings yet</div>
                        <div className="empty-state-desc">
                            {activeUserId === user?.id
                                ? "You haven't booked any tickets yet. Browse movies to get started!"
                                : 'No bookings found for this user.'}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
                        {bookings.map(booking => (
                            <div key={booking._id} className="glass-card" style={{ padding: 'clamp(14px, 3vw, 22px)' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 'clamp(10px, 2vw, 12px)', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1, minWidth: 'clamp(180px, 100%, 100%)' }}>
                                        <div style={{ fontSize: 'clamp(0.95rem, 2vw, 1rem)', fontWeight: 800, marginBottom: '8px', wordBreak: 'break-word' }}>{getMovieTitle(booking)}</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(4px, 1vw, 6px)', marginBottom: '10px' }}>
                                            <span className="badge badge-cyan">🕐 {getShowTime(booking)}</span>
                                            <span className="badge badge-muted">🎫 {booking.seats.length} seat{booking.seats.length > 1 ? 's' : ''}</span>
                                            <span className="badge badge-muted">📅 {new Date(booking.bookedAt).toLocaleDateString('en-IN')}</span>
                                        </div>
                                        <div style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.82rem)', color: 'var(--text-muted)', wordBreak: 'break-word' }}>
                                            <strong>Seats:</strong> {booking.seats.sort((a, b) => a - b).join(', ')}
                                        </div>
                                        <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', color: 'var(--text-muted)', marginTop: '4px', wordBreak: 'break-all' }}>
                                            Booking ID: {booking._id}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.7rem)', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Total Paid</div>
                                        <div className="price-total" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}>₹{booking.totalPrice}</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(6px, 1.5vw, 8px)' }}>
                                        {booking.seats.sort((a, b) => a - b).map(seatNum => {
                                            const price = seatNum <= 10 ? 150 : seatNum <= 20 ? 180 : 200;
                                            const row = seatNum <= 10 ? 'A' : seatNum <= 20 ? 'B' : 'C';
                                            return (
                                                <span key={seatNum} className="badge badge-muted" style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.78rem)' }}>
                                                    #{seatNum} Row {row} · ₹{price}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
