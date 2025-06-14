import React, { useState } from 'react';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import BottomNav from '../common/BottomNav';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Mock data for upcoming bookings
const bookings = [
    {
        id: 'BK-20250615-001',
        passengerName: 'Alice Smith',
        pickup: '789 Elm St, Springfield',
        drop: '321 Pine Ave, Shelbyville',
        date: '2025-06-13',
        time: '09:00 AM',
        passengers: 2,
        status: 'upcoming'
    },
    {
        id: 'BK-20250614-002',
        passengerName: 'Bob Johnson',
        pickup: '555 Maple Rd, Springfield',
        drop: '888 Cedar Blvd, Shelbyville',
        date: '2025-06-15',
        time: '11:30 AM',
        passengers: 1,
        status: 'upcoming'
    },
    {
        id: 'BK-20250613-003',
        passengerName: 'Carol Lee',
        pickup: '123 Main St, Springfield',
        drop: '456 Oak Ave, Shelbyville',
        date: '2025-06-14',
        time: '10:30 AM',
        passengers: 3,
        status: 'upcoming'
    }
];

// Sort bookings by date ascending
const sortedBookings = bookings
    .filter(b => b.status === 'upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function MyBookings() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [activeTripId, setActiveTripId] = useState(null);
    const [tripStarted, setTripStarted] = useState(false);
    const [paymentCollected, setPaymentCollected] = useState(false);
    const [tripEnded, setTripEnded] = useState(false);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [showStartTripPopup, setShowStartTripPopup] = useState(false);
    const [pendingTripId, setPendingTripId] = useState(null); // New state for pending trip ID

    // Get unique dates from bookings for calendar
    const uniqueDates = Array.from(new Set(sortedBookings.map(b => b.date)));

    // Filter bookings by selected date if any
    const filteredBookings = selectedDate
        ? sortedBookings.filter(b => b.date === selectedDate)
        : sortedBookings;

    // Dates with bookings for calendar highlight
    const occupiedDates = uniqueDates.map(d => new Date(d).toDateString());

    // Calendar tile content/highlight
    function tileClassName({ date, view }) {
        if (view === 'month' && occupiedDates.includes(date.toDateString())) {
            return 'occupied-date'; // This will be a background highlight, not a circle
        }
        return null;
    }

    // Calendar tile click handler
    function handleCalendarChange(date) {
        // Fix: Use date.toISOString().slice(0, 10) in UTC, but bookings are in local time.
        // To ensure correct date, use date.getFullYear(), getMonth(), getDate()
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        setSelectedDate(`${yyyy}-${mm}-${dd}`);
        setShowCalendar(false);
        setTimeout(() => {
            const el = document.getElementById('bookings-list');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    function handleStartTrip(id) {
        setPendingTripId(id);
        setShowStartTripPopup(true);
    }

    function handleCollectPayment() {
        setShowPaymentPopup(true);
    }

    function confirmCollectPayment(withReceipt) {
        setPaymentCollected(true);
        setShowPaymentPopup(false);
        // You can handle the receipt logic here if needed
        // Example: if (withReceipt) { ... }
    }

    function handleEndTrip() {
        setTripEnded(true);
        setTripStarted(false);
        setActiveTripId(null);
        setTimeout(() => {
            setPaymentCollected(false);
            setTripEnded(false);
        }, 2000);
    }

    return (
        <div style={{ background: '#f7f7f7', minHeight: '100vh', fontFamily: 'inherit' }}>
            {/* Top bar */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 18px 0 18px',
                    gap: 12
                }}
            >
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#eee',
                        cursor: 'pointer',
                        marginRight: 0
                    }}
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft size={22} color="#232b35" />
                </span>
                <div style={{ flex: 1, fontWeight: 700, fontSize: 20, color: '#232b35' }}>
                    My Bookings
                </div>
                {/* Calendar Button moved to right */}
                <div
                    onClick={() => setShowCalendar(v => !v)}
                    style={{
                        minWidth: 40,
                        height: 40,
                        background: '#fff',
                        borderRadius: '50%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: 'none',
                        marginLeft: 8
                    }}
                >
                    <FaCalendarAlt size={20} color="#FFD600" />
                </div>
            </div>

            {/* Show selected date if any */}
            {selectedDate && (
                <div style={{
                    maxWidth: 430,
                    margin: '18px auto 0 auto',
                    padding: '0 18px',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <div style={{
                        background: '#FFD600',
                        borderRadius: 12,
                        padding: '8px 16px',
                        fontWeight: 700,
                        color: '#232b35',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {formatDate(selectedDate)}
                        <span
                            style={{ marginLeft: 8, cursor: 'pointer', color: '#d32f2f', fontWeight: 400 }}
                            onClick={() => setSelectedDate('')}
                        >
                            ×
                        </span>
                    </div>
                </div>
            )}

            {/* Calendar Popup */}
            {showCalendar && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.18)',
                    zIndex: 1001,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                    onClick={() => setShowCalendar(false)}
                >
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 16,
                            padding: 10,
                            boxShadow: '0 2px 16px rgba(0,0,0,0.13)',
                            minWidth: 320
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <Calendar
                            onChange={handleCalendarChange}
                            tileClassName={tileClassName}
                            value={selectedDate ? new Date(selectedDate) : null}
                            minDetail="month"
                            prev2Label={null}
                            next2Label={null}
                            showNeighboringMonth={false}
                        />
                        <div style={{ textAlign: 'center', marginTop: 6, fontSize: 13 }}>
                            <span style={{ color: '#FFD600', fontWeight: 700 }}>Yellow</span> = Booked
                        </div>
                    </div>
                </div>
            )}

            {/* Bookings List */}
            <div
                id="bookings-list"
                style={{
                    maxWidth: 430,
                    margin: '24px auto 0 auto',
                    padding: '0 0 40px 0'
                }}
            >
                {filteredBookings.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
                        No upcoming bookings.
                    </div>
                )}
                {filteredBookings.map((booking) => {
                    const isActive = activeTripId === booking.id && tripStarted && !tripEnded;

                    // Check if today is the pickup date
                    const today = new Date();
                    const yyyy = today.getFullYear();
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const dd = String(today.getDate()).padStart(2, '0');
                    const todayStr = `${yyyy}-${mm}-${dd}`;
                    const isTodayPickup = booking.date === todayStr;

                    return (
                        <div
                            key={booking.id}
                            style={{
                                background: isActive ? '#fffbe6' : '#fff',
                                borderRadius: 18,
                                boxShadow: isActive
                                    ? '0 4px 16px rgba(255, 214, 0, 0.25)'
                                    : '0 2px 8px rgba(0,0,0,0.07)',
                                padding: '18px 18px 14px 18px',
                                marginBottom: 18,
                                border: isActive ? '2px solid #FFD600' : 'none',
                                position: 'relative',
                                transition: 'all 0.3s'
                            }}
                        >
                            {isActive && (
                                <div style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 18,
                                    background: '#FFD600',
                                    color: '#232b35',
                                    fontWeight: 700,
                                    borderRadius: 8,
                                    padding: '4px 12px',
                                    fontSize: 14,
                                    boxShadow: '0 2px 8px rgba(255,214,0,0.10)'
                                }}>
                                    Trip In Progress <FaCheckCircle style={{ marginLeft: 6, color: '#00b894' }} />
                                </div>
                            )}
                            <div style={{ fontWeight: 700, fontSize: 16, color: '#232b35', marginBottom: 4 }}>
                                {booking.passengerName}
                            </div>
                            <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
                                Booking ID: {booking.id}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                <FaMapMarkerAlt color="#FFD600" />
                                <span style={{ fontWeight: 600, color: '#232b35', fontSize: 15 }}>
                                    {booking.pickup}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                <FaMapMarkerAlt color="#d32f2f" />
                                <span style={{ fontWeight: 600, color: '#232b35', fontSize: 15 }}>
                                    {booking.drop}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 14 }}>
                                    <FaClock style={{ color: '#3bb4f2' }} /> {booking.date} {booking.time}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 14 }}>
                                    <FaUsers style={{ color: '#FFD600' }} /> {booking.passengers} Passengers
                                </div>
                            </div>
                            {/* Trip Actions */}
                            {!isActive && !tripEnded && (
                                <button
                                    style={{
                                        marginTop: 18,
                                        width: '100%',
                                        background: isTodayPickup
                                            ? 'linear-gradient(90deg, #FFD600 0%, #FFF176 100%)'
                                            : '#eee',
                                        border: isTodayPickup ? '2px solid #FFD600' : 'none',
                                        borderRadius: 18,
                                        padding: '12px 0',
                                        fontWeight: 800,
                                        fontSize: 17,
                                        color: isTodayPickup ? '#232b35' : '#aaa',
                                        cursor: isTodayPickup ? 'pointer' : 'not-allowed',
                                        boxShadow: isTodayPickup
                                            ? '0 4px 16px rgba(255, 214, 0, 0.18)'
                                            : '0 2px 8px rgba(0,0,0,0.07)',
                                        letterSpacing: 1,
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => isTodayPickup && handleStartTrip(booking.id)}
                                    disabled={!isTodayPickup}
                                >
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8
                                    }}>
                                        <FaCheckCircle style={{
                                            color: isTodayPickup ? '#00b894' : '#ccc',
                                            fontSize: 20
                                        }} />
                                        Start Trip
                                    </span>
                                </button>
                            )}
                            {isActive && !paymentCollected && (
                                <button
                                    style={{
                                        marginTop: 18,
                                        width: '100%',
                                        background: '#00b894',
                                        border: 'none',
                                        borderRadius: 14,
                                        padding: '10px 0',
                                        fontWeight: 700,
                                        fontSize: 15,
                                        color: '#fff',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                                    }}
                                    onClick={handleCollectPayment}
                                >
                                    <FaMoneyBillWave style={{ marginRight: 8 }} />
                                    Collect Payment
                                </button>
                            )}
                            {isActive && paymentCollected && !tripEnded && (
                                <button
                                    style={{
                                        marginTop: 18,
                                        width: '100%',
                                        background: '#232b35',
                                        border: 'none',
                                        borderRadius: 14,
                                        padding: '10px 0',
                                        fontWeight: 700,
                                        fontSize: 15,
                                        color: '#FFD600',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                                    }}
                                    onClick={handleEndTrip}
                                >
                                    End Trip
                                </button>
                            )}
                            {tripEnded && activeTripId === booking.id && (
                                <div style={{
                                    marginTop: 18,
                                    textAlign: 'center',
                                    color: '#00b894',
                                    fontWeight: 700,
                                    fontSize: 16
                                }}>
                                    Trip Ended Successfully!
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <BottomNav />
            {/* Calendar highlight style */}
            <style>
                {`
    .occupied-date {
      background: #FFD600 !important;
      color: #232b35 !important;
      border-radius: 8px !important;
    }
    .blink {
      animation: blink-animation 1s steps(2, start) infinite;
    }
    @keyframes blink-animation {
      to {
        visibility: hidden;
      }
    }
  `}
            </style>

            {/* Payment Receipt Popup */}
            {showPaymentPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.25)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 18,
                            padding: '32px 28px 24px 28px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            minWidth: 340,
                            maxWidth: '90vw',
                            textAlign: 'center',
                            position: 'relative',
                            border: '2px dashed #FFD600'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Receipt Icon */}
                        <div style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: '#FFF9C4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 18px auto',
                            border: '2px solid #FFD600'
                        }}>
                            <FaMoneyBillWave size={32} color="#FFD600" />
                        </div>
                        <div style={{ fontWeight: 800, fontSize: 22, color: '#232b35', marginBottom: 8 }}>
                            Payment Receipt
                        </div>
                        <div style={{ color: '#888', fontSize: 15, marginBottom: 18 }}>
                            Please confirm you have received the payment from the customer.<br />
                            <span style={{ color: '#d32f2f', fontWeight: 600 }}>
                                This action cannot be changed.
                            </span>
                        </div>
                        <div style={{
                            background: '#f7f7f7',
                            borderRadius: 12,
                            padding: '16px 0',
                            marginBottom: 18,
                            border: '1px dashed #FFD600'
                        }}>
                            <div style={{ fontWeight: 700, fontSize: 18, color: '#232b35', marginBottom: 4 }}>
                                Amount Received
                            </div>
                            <div style={{ fontWeight: 800, fontSize: 24, color: '#00b894' }}>
                                ₹ Amount
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 10 }}>
                            <button
                                style={{
                                    flex: 1,
                                    background: '#FFD600',
                                    color: '#232b35',
                                    border: 'none',
                                    borderRadius: 14,
                                    padding: '12px 0',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                                }}
                                onClick={() => confirmCollectPayment(true)}
                            >
                                Confirm
                            </button>
                            <button
                                style={{
                                    flex: 1,
                                    background: '#fff',
                                    color: '#FFD600',
                                    border: '2px solid #FFD600',
                                    borderRadius: 14,
                                    padding: '12px 0',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                                }}
                                onClick={() => setShowPaymentPopup(false)}
                            >
                                Cancel
                            </button>
                        </div>
                        <button
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 16,
                                background: 'transparent',
                                border: 'none',
                                fontSize: 22,
                                color: '#bbb',
                                cursor: 'pointer'
                            }}
                            onClick={() => setShowPaymentPopup(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Start Trip Confirmation Popup */}
            {showStartTripPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.25)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 18,
                            padding: '32px 28px 24px 28px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            minWidth: 340,
                            maxWidth: '90vw',
                            textAlign: 'center',
                            position: 'relative',
                            border: '2px dashed #FFD600'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: '#FFF9C4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 18px auto',
                            border: '2px solid #FFD600'
                        }}>
                            <FaCheckCircle size={32} color="#FFD600" />
                        </div>
                        <div style={{ fontWeight: 800, fontSize: 24, color: '#232b35', marginBottom: 8, letterSpacing: 0.5 }}>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 10
                            }}>
                                <FaCheckCircle style={{ color: '#00b894', fontSize: 28, marginRight: 4 }} />
                                Start Trip Confirmation
                            </span>
                        </div>
                        <div style={{
                            color: '#232b35',
                            fontSize: 16,
                            marginBottom: 18,
                            background: 'linear-gradient(90deg, #FFFDE7 0%, #FFF9C4 100%)',
                            borderRadius: 10,
                            padding: '14px 12px',
                            boxShadow: '0 2px 8px rgba(255,214,0,0.08)',
                            border: '1px solid #FFF176',
                            fontWeight: 500,
                            lineHeight: 1.6
                        }}>
                            <span style={{ fontWeight: 700, color: '#232b35' }}>
                                Are you sure you want to start this trip?
                            </span>
                            <br />
                            <span style={{
                                color: '#d32f2f',
                                fontWeight: 700,
                                fontSize: 15,
                                display: 'inline-block',
                                marginTop: 6
                            }}>
                                <FaClock style={{ marginRight: 6, color: '#FFD600', verticalAlign: 'middle' }} />
                                Once started, you cannot undo this action.
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 10 }}>
                            <button
                                style={{
                                    flex: 1,
                                    background: '#FFD600',
                                    color: '#232b35',
                                    border: 'none',
                                    borderRadius: 14,
                                    padding: '12px 0',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                                }}
                                onClick={() => {
                                    setActiveTripId(pendingTripId);
                                    setTripStarted(true);
                                    setPaymentCollected(false);
                                    setTripEnded(false);
                                    setShowStartTripPopup(false);
                                    setPendingTripId(null);
                                }}
                            >
                                Yes, Start Trip
                            </button>
                            <button
                                style={{
                                    flex: 1,
                                    background: '#fff',
                                    color: '#FFD600',
                                    border: '2px solid #FFD600',
                                    borderRadius: 14,
                                    padding: '12px 0',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                                }}
                                onClick={() => setShowStartTripPopup(false)}
                            >
                                Cancel
                            </button>
                        </div>
                        <button
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 16,
                                background: 'transparent',
                                border: 'none',
                                fontSize: 22,
                                color: '#bbb',
                                cursor: 'pointer'
                            }}
                            onClick={() => setShowStartTripPopup(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}