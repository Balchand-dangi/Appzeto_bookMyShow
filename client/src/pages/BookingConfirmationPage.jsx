import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function BookingConfirmationPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { booking, movie, show } = state || {};

    if (!booking) {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">⚠️ No booking information found.</div>
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>← Go to Movies</button>
                </div>
            </div>
        );
    }

    const breakdown = booking.priceBreakdown || [];

    return (
        <div className="page">
            <div className="container">
                <div className="confirmation-card">
                    {/* Success Banner */}
                    <div className="confirmation-success" style={{ animation: 'slideInUp 0.5s ease-out' }}>
                        <div className="confirmation-icon" style={{ animation: 'checkmark 0.6s ease-out' }}>✅</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'var(--green)', animation: 'slideInLeft 0.5s ease-out 0.2s backwards' }}>Booking Confirmed!</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)', marginTop: '4px', animation: 'slideInLeft 0.5s ease-out 0.3s backwards' }}>
                                Your tickets are confirmed. Enjoy the movie!
                            </div>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="glass-card" style={{ padding: 'clamp(16px, 3vw, 24px)', marginBottom: '20px', animation: 'slideInUp 0.5s ease-out 0.2s backwards' }}>
                        <div className="section-title">Booking Details</div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(140px, 100%, 250px), 1fr))', gap: 'clamp(12px, 2.5vw, 16px)', marginBottom: '20px' }}>
                            <div>
                                <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Movie</div>
                                <div style={{ fontWeight: 700, fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)', wordBreak: 'break-word' }}>{booking.movieTitle || movie?.title || 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Show Time</div>
                                <div style={{ fontWeight: 700, fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>{booking.showTime || show?.time || 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Booked By</div>
                                <div style={{ fontWeight: 700, fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)', wordBreak: 'break-word' }}>{booking.userId}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Booking ID</div>
                                <div style={{ fontWeight: 700, fontSize: 'clamp(0.75rem, 1.2vw, 0.8rem)', wordBreak: 'break-all' }}>{booking._id}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Seats</div>
                                <div style={{ fontWeight: 700, fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>{booking.seats?.join(', ')}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Booked At</div>
                                <div style={{ fontWeight: 700, fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)' }}>{new Date(booking.bookedAt).toLocaleString('en-IN')}</div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        {breakdown.length > 0 && (
                            <>
                                <div style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.8rem)', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '10px' }}>Price Breakdown</div>
                                <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px', maxHeight: '300px', overflowY: 'auto' }}>
                                    {breakdown.map((item, i) => (
                                        <div key={i} className="price-breakdown-row">
                                            <span>Seat {item.seatNumber} — Row {item.row}</span>
                                            <span style={{ fontWeight: 600, color: 'var(--gold)' }}>₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'clamp(10px, 2.5vw, 14px)', background: 'var(--accent-dim)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(229,9,20,0.25)', flexWrap: 'wrap', gap: '10px' }}>
                            <span style={{ fontWeight: 700, fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>Total Amount Paid</span>
                            <span className="price-total" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}>₹{booking.totalPrice}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
                        <Link to="/" className="btn btn-primary" style={{ flex: 1, minWidth: 'clamp(120px, 100%, 100%)' }}>Browse More Movies</Link>
                        <Link to="/bookings" className="btn btn-secondary" style={{ flex: 1, minWidth: 'clamp(120px, 100%, 100%)' }}>View All Bookings</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
