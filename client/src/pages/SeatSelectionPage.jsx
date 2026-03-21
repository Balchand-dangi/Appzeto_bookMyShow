import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { showsAPI, seatsAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const getSeatPrice = (seatNum) => {
    if (seatNum >= 1 && seatNum <= 10) return 150;
    if (seatNum >= 11 && seatNum <= 20) return 180;
    return 200;
};

const getSeatRow = (seatNum) => {
    if (seatNum <= 10) return 'A';
    if (seatNum <= 20) return 'B';
    return 'C';
};

export default function SeatSelectionPage() {
    const { user } = useAuth();
    const { showId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { movie, show: showState } = location.state || {};

    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [lockedSeats, setLockedSeats] = useState([]);
    const [locking, setLocking] = useState(false);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState('');
    const [lockExpiry, setLockExpiry] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [phase, setPhase] = useState('selecting'); // selecting | locked | confirming
    const countdownRef = useRef(null);

    useEffect(() => {
        // Initialize show from passed state or local storage
        if (showState && movie) {
            setShow(showState);
            setLoading(false);
        } else {
            setLoading(false);
        }
        return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
    }, [showId, showState, movie]);

    // Only fetch data if showState is not provided
    const fetchShow = async () => {
        try {
            setLoading(true);
            if (showState && movie) {
                setShow(showState);
                return;
            }
            // Fallback: if navigated directly without state, fetch from API
            if (showId) {
                const res = await showsAPI.getByMovieId(id);
                const foundShow = res.data.shows?.find(s => s._id === showId);
                if (foundShow) setShow(foundShow);
            }
        } catch (err) {
            setError('Failed to load show details');
        } finally {
            setLoading(false);
        }
    };

    // Refresh show seats data only when necessary
    const refreshSeats = useCallback(async () => {
        if (!show?.movieId && !showState?.movieId) return;
        try {
            const movieId = typeof show?.movieId === 'object' ? show.movieId._id : (show?.movieId || showState?.movieId);
            if (!movieId) return;
            const res = await showsAPI.getByMovieId(movieId);
            const updatedShow = (res.data.shows || []).find(s => s._id === showId);
            if (updatedShow) setShow(updatedShow);
        } catch (_) {
            // Silently fail on refresh - not critical
        }
    }, [showId, show, showState]);

    // Countdown timer
    const startCountdown = (expiryDate) => {
        if (countdownRef.current) clearInterval(countdownRef.current);
        const update = () => {
            const remaining = Math.max(0, Math.floor((new Date(expiryDate) - Date.now()) / 1000));
            setCountdown(remaining);
            if (remaining <= 0) {
                clearInterval(countdownRef.current);
                setLockedSeats([]);
                setSelectedSeats([]);
                setLockExpiry(null);
                setPhase('selecting');
                setError('⏰ Lock expired! Please re-select your seats.');
                refreshSeats();
            }
        };
        update();
        countdownRef.current = setInterval(update, 1000);
    };

    const formatCountdown = (secs) => {
        if (secs === null) return '';
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const getSeatState = (seat) => {
        if (seat.isBooked) return 'booked';
        const now = new Date();
        const isExpiredLock = seat.lockedBy && seat.lockExpiry && new Date(seat.lockExpiry) <= now;
        if (seat.lockedBy && seat.lockedBy.toString() !== user?.id?.toString() && !isExpiredLock) return 'locked';
        if (lockedSeats.includes(seat.seatNumber)) return 'locked-by-me';
        if (selectedSeats.includes(seat.seatNumber)) return 'selected';
        return 'available';
    };

    const handleSeatClick = (seat) => {
        if (phase !== 'selecting') return;
        const state = getSeatState(seat);
        if (state === 'booked' || state === 'locked') return;
        setError('');
        if (state === 'selected') {
            setSelectedSeats(prev => prev.filter(s => s !== seat.seatNumber));
        } else if (state === 'available') {
            setSelectedSeats(prev => [...prev, seat.seatNumber]);
        }
    };

    const handleLockSeats = async () => {
        if (selectedSeats.length === 0) return;
        try {
            setLocking(true);
            setError('');
            const res = await seatsAPI.lock({ showId, seats: selectedSeats });
            const expiry = res.data.lockExpiry;
            setLockedSeats(selectedSeats);
            setLockExpiry(expiry);
            setPhase('locked');
            startCountdown(expiry);
        } catch (err) {
            if (err.response?.status === 409) {
                const conflicts = err.response.data.conflictSeats || [];
                const conflictNums = conflicts.map(c => `Seat ${c.seatNumber} (${c.reason})`).join(', ');
                setError(`❌ Unavailable: ${conflictNums}`);
                // Remove conflicting seats from selection
                const conflictSet = new Set(conflicts.map(c => c.seatNumber));
                setSelectedSeats(prev => prev.filter(s => !conflictSet.has(s)));
            } else {
                setError(err.response?.data?.message || 'Failed to lock seats');
            }
        } finally {
            setLocking(false);
        }
    };

    const handleBook = async () => {
        if (lockedSeats.length === 0) return;
        try {
            setBooking(true);
            setError('');
            const res = await bookingAPI.create({ showId, seats: lockedSeats });
            if (countdownRef.current) clearInterval(countdownRef.current);
            navigate('/booking/confirmation', {
                state: { booking: res.data.booking, movie, show: showState },
            });
        } catch (err) {
            if (err.response?.status === 409) {
                setError('❌ ' + (err.response?.data?.message || 'Conflict: some seats are no longer available'));
                setPhase('selecting');
                setLockedSeats([]);
                setSelectedSeats([]);
                setLockExpiry(null);
                if (countdownRef.current) clearInterval(countdownRef.current);
                refreshSeats();
            } else {
                setError(err.response?.data?.message || 'Booking failed. Please try again.');
            }
        } finally {
            setBooking(false);
        }
    };

    const totalPrice = selectedSeats.reduce((sum, s) => sum + getSeatPrice(s), 0);
    const lockedPrice = lockedSeats.reduce((sum, s) => sum + getSeatPrice(s), 0);

    // Arrange seats in 3 rows of 10
    const rows = [
        { label: 'A', seats: Array.from({ length: 10 }, (_, i) => i + 1), category: 'Standard', price: 150 },
        { label: 'B', seats: Array.from({ length: 10 }, (_, i) => i + 11), category: 'Premium', price: 180 },
        { label: 'C', seats: Array.from({ length: 10 }, (_, i) => i + 21), category: 'VIP', price: 200 },
    ];

    const currentSeats = show?.seats || showState?.seats || [];

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading-center"><div className="spinner"></div><span>Loading seats...</span></div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <button className="btn btn-ghost btn-sm" onClick={() => { if (countdownRef.current) clearInterval(countdownRef.current); navigate(-1); }} style={{ marginBottom: '20px' }}>
                    ← Back
                </button>

                {/* Header */}
                <div className="page-header">
                    <h1 className="page-title" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>{movie?.title || 'Select Seats'}</h1>
                    <p className="page-subtitle" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>🕐 {showState?.time} &nbsp;|&nbsp; Total Seats: {showState?.totalSeats || 30}</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {/* Countdown Banner */}
                {phase === 'locked' && countdown !== null && (
                    <div className="countdown-banner">
                        <span>⏳ Seats locked! Complete your booking before time runs out.</span>
                        <span className={`countdown-timer${countdown <= 30 ? ' danger' : ''}`}>
                            {formatCountdown(countdown)}
                        </span>
                    </div>
                )}

                <div className="booking-layout">
                    {/* Seat Grid */}
                    <div>
                        {/* Legend */}
                        <div className="seat-legend">
                            <div className="legend-item">
                                <div className="legend-dot" style={{ background: 'var(--bg-elevated)', borderColor: 'rgba(34,197,94,0.5)' }}></div>
                                Available
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot" style={{ background: 'rgba(0,100,255,0.25)', borderColor: '#4d94ff' }}></div>
                                Selected
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot" style={{ background: 'rgba(229,9,20,0.15)', borderColor: 'rgba(229,9,20,0.3)' }}></div>
                                Booked
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot" style={{ background: 'var(--gold-dim)', borderColor: 'rgba(245,197,24,0.4)' }}></div>
                                Locked
                            </div>
                        </div>

                        {/* Seat Grid */}
                        <div className="glass-card" style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
                            <div className="seat-grid-wrapper">
                                <div className="seat-grid-container">
                                    <div className="seat-screen"></div>
                                    <div style={{ height: '24px' }}></div>

                                    {rows.map(row => (
                                        <div key={row.label} style={{ width: '100%' }}>
                                            <div style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.72rem)', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
                                                <span style={{ fontWeight: 700 }}>Row {row.label}</span>
                                                <span className="badge badge-muted">{row.category} · ₹{row.price}</span>
                                            </div>
                                            <div className="seat-row">
                                                <div className="seat-row-seats">
                                                    {row.seats.map(seatNum => {
                                                        const seatObj = currentSeats.find(s => s.seatNumber === seatNum) || { seatNumber: seatNum };
                                                        const state = getSeatState(seatObj);
                                                        const cls = {
                                                            'available': 'seat-available',
                                                            'selected': 'seat-selected',
                                                            'booked': 'seat-booked',
                                                            'locked': 'seat-locked',
                                                            'locked-by-me': 'seat-locked',
                                                        }[state] || 'seat-available';

                                                        return (
                                                            <div
                                                                key={seatNum}
                                                                className={`seat ${cls}`}
                                                                onClick={() => (state === 'available' || state === 'selected') && phase === 'selecting' ? handleSeatClick(seatObj) : null}
                                                                title={`Seat ${seatNum} · Row ${row.label} · ₹${row.price} · ${state}`}
                                                            >
                                                                {seatNum}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div style={{ height: '12px' }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price Panel */}
                    <div className="price-panel">
                        <div style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', fontWeight: 700, marginBottom: '16px', color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                            Booking Summary
                        </div>

                        {phase === 'selecting' ? (
                            <>
                                {selectedSeats.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)', marginBottom: '16px' }}>Select seats on the grid to begin</p>
                                ) : (
                                    <>
                                        <div style={{ marginBottom: '16px', maxHeight: '200px', overflowY: 'auto' }}>
                                            {selectedSeats.sort((a, b) => a - b).map(s => (
                                                <div key={s} className="price-row">
                                                    <span>Seat {s} · Row {getSeatRow(s)}</span>
                                                    <span style={{ color: 'var(--gold)' }}>₹{getSeatPrice(s)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="price-row" style={{ borderTop: '2px solid var(--border)', paddingTop: '12px' }}>
                                            <span style={{ fontWeight: 700 }}>Total</span>
                                            <span className="price-total">₹{totalPrice}</span>
                                        </div>
                                    </>
                                )}

                                <button
                                    className="btn btn-primary btn-full"
                                    style={{ marginTop: '20px' }}
                                    disabled={selectedSeats.length === 0 || locking}
                                    onClick={handleLockSeats}
                                    id="lock-seats-btn"
                                >
                                    {locking ? 'Locking...' : `🔒 Lock ${selectedSeats.length > 0 ? selectedSeats.length + ' Seat' + (selectedSeats.length > 1 ? 's' : '') : 'Seats'}`}
                                </button>
                                <p style={{ fontSize: 'clamp(0.68rem, 1.2vw, 0.75rem)', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
                                    Seats will be locked for 2 minutes
                                </p>
                            </>
                        ) : (
                            <>
                                <div style={{ marginBottom: '16px', maxHeight: '200px', overflowY: 'auto' }}>
                                    {lockedSeats.sort((a, b) => a - b).map(s => (
                                        <div key={s} className="price-row">
                                            <span>Seat {s} · Row {getSeatRow(s)}</span>
                                            <span style={{ color: 'var(--gold)' }}>₹{getSeatPrice(s)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="price-row" style={{ borderTop: '2px solid var(--border)', paddingTop: '12px' }}>
                                    <span style={{ fontWeight: 700 }}>Total</span>
                                    <span className="price-total">₹{lockedPrice}</span>
                                </div>

                                <button
                                    className="btn btn-primary btn-full btn-lg"
                                    style={{ marginTop: '20px' }}
                                    disabled={booking || countdown === 0}
                                    onClick={handleBook}
                                    id="book-now-btn"
                                >
                                    {booking ? 'Confirming...' : '🎟️ Confirm Booking'}
                                </button>
                                <button
                                    className="btn btn-ghost btn-full btn-sm"
                                    style={{ marginTop: '10px' }}
                                    onClick={() => { setPhase('selecting'); setLockedSeats([]); setSelectedSeats([]); setLockExpiry(null); if (countdownRef.current) clearInterval(countdownRef.current); }}
                                >
                                    Cancel & Re-select
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
