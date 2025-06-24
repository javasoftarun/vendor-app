import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import BottomNav from '../common/BottomNav';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import API_ENDPOINTS from '../config/apiConfig';

export default function MyBookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [activeTripId, setActiveTripId] = useState(null);
    const [tripStarted, setTripStarted] = useState(false);
    const [setPaymentCollected] = useState(false);
    const [tripEnded, setTripEnded] = useState(false);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [showStartTripPopup, setShowStartTripPopup] = useState(false);
    const [pendingTripId, setPendingTripId] = useState(null);
    const [currentPaymentAmount, setCurrentPaymentAmount] = useState(0);
    const [endingTrip, setEndingTrip] = useState(false);
    const [showCancelPopup, setShowCancelPopup] = useState(false);
    const [showDeductMsg, setShowDeductMsg] = useState(false);

    // User info cache: userId -> user object
    const [userInfoMap, setUserInfoMap] = useState({});

    // Fetch bookings by vendor id
    useEffect(() => {
        async function fetchBookings() {
            setLoading(true);
            try {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const vendorId = user.userId || user.id || "";
                const response = await fetch(API_ENDPOINTS.GET_ALL_BOOKINGS_BY_VENDOR_ID(vendorId));
                const data = await response.json();
                if (
                    response.ok &&
                    data.responseCode === 200 &&
                    Array.isArray(data.responseData)
                ) {
                    const bookingsArr = data.responseData.flat().map(b => ({
                        id: b.bookingId,
                        pickup: b.pickupLocation,
                        drop: b.dropLocation,
                        date: b.pickupDateTime ? b.pickupDateTime.split('T')[0] : '',
                        time: b.pickupDateTime ? b.pickupDateTime.split('T')[1]?.slice(0,5) : '',
                        passengers: b.cabCapacity,
                        userId: b.userId,
                        ...b // keep all original fields if you need them
                    }));
                    setBookings(bookingsArr);
                } else {
                    setBookings([]);
                }
            } catch (err) {
                setBookings([]);
            }
            setLoading(false);
        }
        fetchBookings();
    }, []);

    // Fetch user info for all unique userIds in bookings
    useEffect(() => {
        async function fetchUserInfo(userId) {
            // Replace with your actual user API endpoint
            const response = await fetch(API_ENDPOINTS.GET_USER_BY_ID(userId));
            const data = await response.json();
            if (
                response.ok &&
                data.responseCode === 200 &&
                Array.isArray(data.responseData) &&
                data.responseData.length > 0
            ) {
                return data.responseData[0];
            }
            return null;
        }

        const uniqueUserIds = Array.from(new Set(bookings.map(b => b.userId)));
        uniqueUserIds.forEach(userId => {
            if (userId && !userInfoMap[userId]) {
                fetchUserInfo(userId).then(userData => {
                    if (userData) {
                        setUserInfoMap(prev => ({ ...prev, [userId]: userData }));
                    }
                });
            }
        });
        // eslint-disable-next-line
    }, [bookings]);

    // Sort bookings by date ascending
    const sortedBookings = bookings
        .filter(b => b.bookingStatus === 'Accepted' || b.bookingStatus === 'Running')
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
    }

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
            return 'occupied-date';
        }
        return null;
    }

    function handleCalendarChange(date) {
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

    // Function to call API and update booking status to "Running"
    async function startTripAndUpdateStatus(booking) {
        try {
            const reqBody = {
                bookingId: booking.id,
                cabRegistrationId: booking.cabRegistrationId,
                bookingStatus: "Running",
                paymentStatus: booking.paymentStatus || "partial",
                role: "VENDOR"
            };
            const response = await fetch(API_ENDPOINTS.UPDATE_BOOKING_STATUS, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody)
            });
            const data = await response.json();
            if (response.ok && data.responseCode === 200) {
                setBookings(prev =>
                    prev.map(b =>
                        b.id === booking.id ? { ...b, bookingStatus: 'Running' } : b
                    )
                );
                setActiveTripId(booking.id);
                setTripStarted(true);
                setPaymentCollected(false);
                setTripEnded(false);
            } else {
                alert(data.responseMessage || 'Failed to start trip. Please try again.');
            }
        } catch (err) {
            alert('Failed to start trip. Please try again.');
        }
        setShowStartTripPopup(false);
        setPendingTripId(null);
    }

    function handleCollectPayment(amount) {
        setCurrentPaymentAmount(amount || 0);
        setShowPaymentPopup(true);
    }

    // Add this function inside your component (replace the old confirmCollectPayment if present)
    function confirmCollectPayment() {
        // Find the running/active booking
        const booking = bookings.find(
            b => (activeTripId ? b.id === activeTripId : b.bookingStatus === "Running")
        );
        if (!booking) {
            setShowPaymentPopup(false);
            return;
        }

        // Prepare request body for API
        const reqBody = {
            bookingId: booking.id,
            cabRegistrationId: booking.cabRegistrationId,
            bookingStatus: "Running",
            paymentStatus: "full",
            role: "VENDOR"
        };

        fetch(API_ENDPOINTS.UPDATE_BOOKING_STATUS, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        })
            .then(res => res.json())
            .then(data => {
                if (data.responseCode === 200) {
                    setBookings(prev =>
                        prev.map(b =>
                            b.id === booking.id
                                ? { ...b, paymentStatus: "full" }
                                : b
                        )
                    );
                    setPaymentCollected(true);
                } else {
                    alert(data.responseMessage || "Failed to update payment status.");
                }
            })
            .catch(() => {
                alert("Failed to update payment status.");
            })
            .finally(() => {
                setShowPaymentPopup(false);
            });
    }

    async function handleEndTrip() {
        setEndingTrip(true); // Show loading state on button

        const booking = bookings.find(
            b => (activeTripId ? b.id === activeTripId : b.bookingStatus === "Running")
        );
        if (!booking) {
            setTripEnded(true);
            setTripStarted(false);
            setActiveTripId(null);
            setEndingTrip(false);
            setTimeout(() => {
                setPaymentCollected(false);
                setTripEnded(false);
            }, 2000);
            return;
        }

        const reqBody = {
            bookingId: booking.id,
            cabRegistrationId: booking.cabRegistrationId,
            bookingStatus: "Completed",
            paymentStatus: "full",
            role: "VENDOR"
        };

        try {
            const response = await fetch(API_ENDPOINTS.UPDATE_BOOKING_STATUS, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody)
            });
            const data = await response.json();
            if (response.ok && data.responseCode === 200) {
                setBookings(prev =>
                    prev.map(b =>
                        b.id === booking.id
                            ? { ...b, bookingStatus: "Completed" }
                            : b
                    )
                );
                setTripEnded(true);
                setTripStarted(false);
                setActiveTripId(null);
                setTimeout(() => {
                    setPaymentCollected(false);
                    setTripEnded(false);
                }, 2000);
            } else {
                alert(data.responseMessage || "Failed to end trip.");
            }
        } catch (err) {
            alert("Failed to end trip.");
        }
        setEndingTrip(false); // Reset loading state
    }

    // Add this function to handle booking cancellation
    async function handleCancelBooking(booking) {
        try {
            const reqBody = {
                bookingId: booking.id,
                cabRegistrationId: booking.cabRegistrationId,
                bookingStatus: "Cancelled",
                paymentStatus: booking.paymentStatus || "partial",
                role: "VENDOR"
            };
            const response = await fetch(API_ENDPOINTS.UPDATE_BOOKING_STATUS, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody)
            });
            const data = await response.json();
            if (response.ok && data.responseCode === 200) {
                setBookings(prev =>
                    prev.map(b =>
                        b.id === booking.id ? { ...b, bookingStatus: 'Cancelled' } : b
                    )
                );
                setShowDeductMsg(true);
                setTimeout(() => setShowDeductMsg(false), 3500);
            } else {
                alert(data.responseMessage || 'Failed to cancel booking. Please try again.');
            }
        } catch (err) {
            alert('Failed to cancel booking. Please try again.');
        }
    }

    if (loading) {
        return (
            <div style={{
                background: '#f7f7f7',
                minHeight: '100vh',
                fontFamily: 'inherit',
                display: 'flex',
                flexDirection: 'column'
            }}>
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
                </div>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "3px solid #FFD600",
                        borderTop: "3px solid #eee",
                        animation: "spin 1s linear infinite"
                    }} />
                    <div style={{ color: "#232b35", fontWeight: 600, fontSize: 16, marginTop: 18 }}>
                        Loading...
                    </div>
                    <style>
                        {`
        @keyframes spin {
          100% { transform: rotate(360deg);}
        }
      `}
                    </style>
                </div>
                <BottomNav />
            </div>
        );
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
                    // Determine if this booking is active and running
                    const isActive = activeTripId === booking.id && tripStarted && !tripEnded;
                    const isRunning = booking.bookingStatus === "Running";
                    const isPaymentFull = booking.paymentStatus === "full";

                    // Check if today is the pickup date
                    const today = new Date();
                    const yyyy = today.getFullYear();
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const dd = String(today.getDate()).padStart(2, '0');
                    const todayStr = `${yyyy}-${mm}-${dd}`;
                    const isTodayPickup = booking.date === todayStr;

                    // Get user info for this booking
                    const userInfo = userInfoMap[booking.userId];

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

                            {/* User Info Card with Modern Call Button */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    marginBottom: 12,
                                    background: '#fff',
                                    borderRadius: 14,
                                    padding: '12px 16px',
                                    boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
                                    border: '1.5px solid #FFD600',
                                    minHeight: 64
                                }}
                            >
                                {/* User Avatar */}
                                <div style={{
                                    width: 54,
                                    height: 54,
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    border: '2px solid #FFD600',
                                    background: '#FFFBE6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: 22,
                                    color: '#232b35',
                                    flexShrink: 0
                                }}>
                                    {userInfo?.imageUrl ? (
                                        <img
                                            src={userInfo.imageUrl}
                                            alt="User"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                                display: 'block'
                                            }}
                                            onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.name || 'User')}&background=FFD600&color=232b35&rounded=true`; }}
                                        />
                                    ) : (
                                        <span>
                                            {userInfo?.name
                                                ? userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                                                : 'U'}
                                        </span>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontWeight: 700,
                                        fontSize: 18,
                                        color: '#232b35',
                                        marginBottom: 2,
                                        letterSpacing: 0.2,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {userInfo
                                            ? userInfo.name || userInfo.fullName || userInfo.phone || "User"
                                            : "Loading user..."}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        marginBottom: 2
                                    }}>
                                        <span style={{ color: '#e91e63', fontSize: 18, display: 'flex', alignItems: 'center' }}>
                                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginRight: 2 }}>
                                                <path d="M6.6 2.6A1.5 1.5 0 0 0 4.5 2.5C3.7 2.5 3 3.2 3 4c0 7.2 5.8 13 13 13 .8 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1l-2.2-2.2c-.3-.3-.7-.4-1.1-.4-.4 0-.8.2-1.1.4l-.7.7a10.9 10.9 0 0 1-4.6-4.6l.7-.7c.3-.3.4-.7.4-1.1 0-.4-.2-.8-.4-1.1L6.6 2.6z" fill="#e91e63"/>
                                            </svg>
                                            {userInfo?.phone || <span style={{ color: '#bbb', fontSize: 15 }}>No contact</span>}
                                        </span>
                                        {userInfo?.phone && (
                                            <a
                                                href={`tel:${userInfo.phone}`}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    background: 'linear-gradient(90deg, #2196f3 0%, #00b894 100%)',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: 22,
                                                    padding: '6px 18px',
                                                    fontWeight: 700,
                                                    fontSize: 15,
                                                    boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
                                                    textDecoration: 'none',
                                                    transition: 'background 0.2s, box-shadow 0.2s',
                                                    cursor: 'pointer'
                                                }}
                                                title="Call User"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
                                                    <path d="M6.6 2.6A1.5 1.5 0 0 0 4.5 2.5C3.7 2.5 3 3.2 3 4c0 7.2 5.8 13 13 13 .8 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1l-2.2-2.2c-.3-.3-.7-.4-1.1-.4-.4 0-.8.2-1.1.4l-.7.7a10.9 10.9 0 0 1-4.6-4.6l.7-.7c.3-.3.4-.7.4-1.1 0-.4-.2-.8-.4-1.1L6.6 2.6z" fill="#fff"/>
                                                    <path d="M6.6 2.6A1.5 1.5 0 0 0 4.5 2.5C3.7 2.5 3 3.2 3 4c0 7.2 5.8 13 13 13 .8 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1l-2.2-2.2c-.3-.3-.7-.4-1.1-.4-.4 0-.8.2-1.1.4l-.7.7a10.9 10.9 0 0 1-4.6-4.6l.7-.7c.3-.3.4-.7.4-1.1 0-.4-.2-.8-.4-1.1L6.6 2.6z" fill="#fff" opacity="0.5"/>
                                                </svg>
                                                <span style={{ marginLeft: 4 }}>Call</span>
                                            </a>
                                        )}
                                    </div>
                                    {userInfo?.email && (
                                        <div style={{
                                            color: '#888',
                                            fontSize: 14,
                                            fontWeight: 400,
                                            wordBreak: 'break-all',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8
                                        }}>
                                            <span style={{ color: '#e91e63', fontSize: 16 }}>
                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginRight: 2 }}>
                                                    <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h11A2.5 2.5 0 0 1 18 5.5v9A2.5 2.5 0 0 1 15.5 17h-11A2.5 2.5 0 0 1 2 14.5v-9Zm1.6-.1L10 10.1l6.4-4.7A1.5 1.5 0 0 0 15.5 4h-11c-.2 0-.4 0-.6.1ZM17 6.7l-6.6 4.9a1 1 0 0 1-1.2 0L3 6.7V14.5c0 .8.7 1.5 1.5 1.5h11c.8 0 1.5-.7 1.5-1.5V6.7Z" fill="#e91e63"/>
                                                </svg>
                                            </span>
                                            {userInfo.email}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Booking ID */}
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
                            {!isActive && !tripEnded && booking.bookingStatus !== "Running" && (
                                <div
                                    style={{
                                        display: 'flex',
                                        marginTop: 18,
                                        justifyContent: 'space-between',
                                        gap: 0,
                                    }}
                                >
                                    {/* Show Cancel button only if NOT pickup date */}
                                    {!isTodayPickup && (
                                        <button
                                            style={{
                                                minWidth: 110,
                                                background: '#fff',
                                                border: '1.5px solid #d32f2f',
                                                borderRadius: 8,
                                                padding: '8px 0',
                                                fontWeight: 600,
                                                fontSize: 15,
                                                color: '#d32f2f',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 6,
                                                boxShadow: '0 1px 4px rgba(44,62,80,0.06)',
                                                transition: 'all 0.2s'
                                            }}
                                            onClick={() => {
                                                setPendingTripId(booking.id);
                                                setShowCancelPopup(true);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        style={{
                                            minWidth: 110,
                                            background: isTodayPickup ? '#FFD600' : '#f7f7f7',
                                            border: `1.5px solid ${isTodayPickup ? '#FFD600' : '#eee'}`,
                                            borderRadius: 8,
                                            padding: '8px 0',
                                            fontWeight: 600,
                                            fontSize: 15,
                                            color: isTodayPickup ? '#232b35' : '#bbb',
                                            cursor: isTodayPickup ? 'pointer' : 'not-allowed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 6,
                                            boxShadow: '0 1px 4px rgba(44,62,80,0.06)',
                                            transition: 'all 0.2s'
                                        }}
                                        onClick={() => isTodayPickup && handleStartTrip(booking.id)}
                                        disabled={!isTodayPickup}
                                    >
                                        <FaCheckCircle style={{
                                            color: isTodayPickup ? '#00b894' : '#ccc',
                                            fontSize: 16
                                        }} />
                                        Start Trip
                                    </button>
                                </div>
                            )}

                            {/* Show Collect Payment only if payment is NOT full */}
                            {(isActive || isRunning) && !isPaymentFull && !tripEnded && (
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
                                    onClick={() => handleCollectPayment(booking.balanceAmount || booking.amount || 0)}
                                >
                                    <FaMoneyBillWave style={{ marginRight: 8 }} />
                                    Collect Payment
                                </button>
                            )}
                            {/* Show End Trip only if payment is full */}
                            {(isActive || isRunning) && isPaymentFull && !tripEnded && (
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
                                        cursor: endingTrip ? 'wait' : 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                        opacity: endingTrip ? 0.7 : 1
                                    }}
                                    onClick={handleEndTrip}
                                >
                                    {endingTrip ? 'Ending Trip...' : 'End Trip'}
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
                            borderRadius: 16,
                            padding: '22px 18px 18px 18px', // smaller popup
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            minWidth: 260,
                            maxWidth: '90vw',
                            textAlign: 'center',
                            position: 'relative',
                            border: '2px dashed #FFD600'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Receipt Icon */}
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            background: '#FFF9C4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px auto',
                            border: '2px solid #FFD600'
                        }}>
                            <FaMoneyBillWave size={24} color="#FFD600" />
                        </div>
                        <div style={{ fontWeight: 800, fontSize: 18, color: '#232b35', marginBottom: 6 }}>
                            Payment Receipt
                        </div>
                        <div style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
                            Please confirm you have received the payment from the customer.<br />
                            <span style={{ color: '#d32f2f', fontWeight: 600 }}>
                                This action cannot be changed.
                            </span>
                        </div>
                        <div style={{
                            background: '#f7f7f7',
                            borderRadius: 10,
                            padding: '10px 0',
                            marginBottom: 12,
                            border: '1px dashed #FFD600'
                        }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: '#232b35', marginBottom: 2 }}>
                                Balance Amount
                            </div>
                            <div style={{ fontWeight: 800, fontSize: 20, color: '#00b894' }}>
                                ₹ {currentPaymentAmount}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 6 }}>
                            <button
                                style={{
                                    flex: 1,
                                    background: '#FFD600',
                                    color: '#232b35',
                                    border: 'none',
                                    borderRadius: 12,
                                    padding: '10px 0',
                                    fontWeight: 700,
                                    fontSize: 15,
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
                                    borderRadius: 12,
                                    padding: '10px 0',
                                    fontWeight: 700,
                                    fontSize: 15,
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
                                top: 8,
                                right: 12,
                                background: 'transparent',
                                border: 'none',
                                fontSize: 18,
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
                        
                        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 18 }}>
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
                                onClick={() => startTripAndUpdateStatus(filteredBookings.find(b => b.id === pendingTripId))}
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

            {/* Cancel Booking Confirmation Popup */}
            {showCancelPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.18)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 10,
                            padding: '20px 18px 16px 18px',
                            minWidth: 240,
                            maxWidth: 340,
                            width: '90%',
                            textAlign: 'center',
                            boxShadow: '0 4px 24px rgba(44,62,80,0.10)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: '#232b35' }}>
                            Cancel Booking
                        </div>
                        <div style={{ color: '#555', fontSize: 15, marginBottom: 10 }}>
                            Are you sure you want to cancel this booking?
                        </div>
                        <div style={{
                            color: '#b71c1c',
                            fontWeight: 600,
                            fontSize: 14,
                            marginBottom: 18,
                            background: '#fafafa',
                            borderRadius: 6,
                            padding: '8px 6px',
                            border: '1px solid #f0f0f0'
                        }}>
                            ₹200 will be deducted from your next booking as a cancellation charge.
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button
                                style={{
                                    flex: 1,
                                    background: '#d32f2f',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 6,
                                    padding: '9px 0',
                                    fontWeight: 600,
                                    fontSize: 15,
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    const bookingToCancel = filteredBookings.find(b => b.id === pendingTripId);
                                    if (bookingToCancel) handleCancelBooking(bookingToCancel);
                                    setShowCancelPopup(false);
                                    setPendingTripId(null);
                                }}
                            >
                                Yes, Cancel
                            </button>
                            <button
                                style={{
                                    flex: 1,
                                    background: '#fff',
                                    color: '#232b35',
                                    border: '1.5px solid #bbb',
                                    borderRadius: 6,
                                    padding: '9px 0',
                                    fontWeight: 600,
                                    fontSize: 15,
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setShowCancelPopup(false);
                                    setPendingTripId(null);
                                }}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deduction Message Popup */}
            {showDeductMsg && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.18)',
                    zIndex: 3000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: 12,
                        padding: '22px 28px',
                        minWidth: 260,
                        maxWidth: '90vw',
                        textAlign: 'center',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                        border: '2px solid #FFD600',
                        fontWeight: 700,
                        fontSize: 16,
                        color: '#d32f2f'
                    }}>
                        ₹200 will be deducted from your next booking as a cancellation charge.
                    </div>
                </div>
            )}
        </div>
    );
}