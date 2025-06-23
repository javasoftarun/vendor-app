import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaUsers, FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaCalendarAlt, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import BottomNav from '../common/BottomNav';
import API_ENDPOINTS from '../config/apiConfig';

export default function BookingHistory() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('completed');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // User info cache: userId -> user object
  const [userInfoMap, setUserInfoMap] = useState({});

  // Fetch all bookings by vendor id
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
          // Flatten and map API fields to UI fields
          const bookingsArr = data.responseData.flat().map(b => ({
            id: b.bookingId,
            passengerName: b.driverName || '', // fallback, will fetch real user below
            pickup: b.pickupLocation,
            drop: b.dropLocation,
            date: b.pickupDateTime ? b.pickupDateTime.split('T')[0] : '',
            time: b.pickupDateTime ? b.pickupDateTime.split('T')[1]?.slice(0,5) : '',
            passengers: b.cabCapacity,
            status: b.bookingStatus === 'Completed' ? 'completed'
                  : b.bookingStatus === 'Rejected' ? 'cancelled'
                  : '', // Only completed/cancelled
            amount: b.fare,
            paymentMode: b.paymentStatus === 'paid' ? 'Paid' : b.paymentStatus,
            userId: b.userId, // Save userId for fetching user info
            ...b
          })).filter(b => b.status);
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
    const uniqueUserIds = Array.from(new Set(bookings.map(b => b.userId).filter(Boolean)));
    uniqueUserIds.forEach(userId => {
      if (userId && !userInfoMap[userId]) {
        fetchUserInfo(userId).then(userData => {
          setUserInfoMap(prev => ({
            ...prev,
            [userId]: userData
          }));
        });
      }
    });
    // eslint-disable-next-line
  }, [bookings]);

  // Helper to fetch user info by userId
  async function fetchUserInfo(userId) {
    try {
      const response = await fetch(API_ENDPOINTS.GET_USER_BY_ID(userId));
      const data = await response.json();
      if (
        response.ok &&
        data.responseCode === 200 &&
        Array.isArray(data.responseData) &&
        data.responseData.length > 0
      ) {
        const user = data.responseData[0];
        return {
          name: user.name || user.fullName || user.phone || "User",
          phone: user.phone || "",
        };
      }
    } catch (err) {}
    return { name: "User", phone: "" };
  }

  // Unique booking dates for highlight
  const uniqueDates = Array.from(new Set(bookings.map(b => b.date)));
  const occupiedDates = uniqueDates.map(d => new Date(d).toDateString());

  // Calendar tile highlight
  function tileClassName({ date, view }) {
    if (view === 'month' && occupiedDates.includes(date.toDateString())) {
      return 'occupied-date';
    }
    return null;
  }

  // Filter bookings by selected date if any
  const filteredBookings = selectedDate
    ? bookings.filter(b => b.date === selectedDate && b.status === tab)
    : bookings.filter(b => b.status === tab);

  // Format date for display
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 18px 0 18px',
        gap: 12
      }}>
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
          Booking History
        </div>
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

      {/* Selected Date Chip */}
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
              onChange={date => {
                // Fix: get local date in YYYY-MM-DD
                const localDate = date.toLocaleDateString('en-CA');
                setSelectedDate(localDate);
                setShowCalendar(false);
              }}
              tileClassName={tileClassName}
              value={selectedDate ? new Date(selectedDate) : null}
              minDetail="month"
              prev2Label={null}
              next2Label={null}
              showNeighboringMonth={false}
            />
            <div style={{ textAlign: 'center', marginTop: 6, fontSize: 13 }}>
              <span style={{ color: '#FFD600', fontWeight: 700 }}>Yellow</span> = Booking Exists
            </div>
          </div>
        </div>
      )}

      {/* Modern Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '28px auto 18px auto',
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        maxWidth: 430,
        width: '100%',
        overflow: 'hidden'
      }}>
        <button
          style={{
            flex: 1,
            background: tab === 'completed' ? '#f7f7f7' : '#fff',
            color: tab === 'completed' ? '#232b35' : '#888',
            border: 'none',
            padding: '14px 0',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            borderBottom: tab === 'completed' ? '3px solid #232b35' : '3px solid transparent',
            letterSpacing: 0.5,
            transition: 'all 0.2s'
          }}
          onClick={() => setTab('completed')}
        >
          <FaCheckCircle style={{ marginRight: 8, color: tab === 'completed' ? '#00b894' : '#bbb', verticalAlign: 'middle' }} />
          Completed
        </button>
        <button
          style={{
            flex: 1,
            background: tab === 'cancelled' ? '#f7f7f7' : '#fff',
            color: tab === 'cancelled' ? '#232b35' : '#888',
            border: 'none',
            padding: '14px 0',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            borderBottom: tab === 'cancelled' ? '3px solid #232b35' : '3px solid transparent',
            letterSpacing: 0.5,
            transition: 'all 0.2s'
          }}
          onClick={() => setTab('cancelled')}
        >
          <FaTimesCircle style={{ marginRight: 8, color: tab === 'cancelled' ? '#d32f2f' : '#bbb', verticalAlign: 'middle' }} />
          Cancelled
        </button>
      </div>

      {/* Booking List */}
      <div style={{
        maxWidth: 430,
        margin: '0 auto',
        padding: '0 0 40px 0'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
            Loading booking history...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
            No {tab} bookings.
          </div>
        ) : filteredBookings.map((booking) => {
          const userInfo = userInfoMap[booking.userId] || {};
          const userInitials = userInfo.name
            ? userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : 'U';

          return (
            <div
              key={booking.id}
              style={{
                background: '#fff',
                borderRadius: 18,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                padding: '18px 18px 14px 18px',
                marginBottom: 18,
                border: booking.status === 'completed'
                  ? '2px solid #FFD600'
                  : '2px solid #d32f2f',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 10,
                right: 18,
                background: booking.status === 'completed' ? '#00b894' : '#d32f2f',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 8,
                padding: '4px 12px',
                fontSize: 14,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                {booking.status === 'completed' ? (
                  <>
                    Completed <FaCheckCircle style={{ marginLeft: 6, color: '#fff' }} />
                  </>
                ) : (
                  <>
                    Cancelled <FaTimesCircle style={{ marginLeft: 6, color: '#fff' }} />
                  </>
                )}
              </div>
              {/* User Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 10,
                marginTop: 2
              }}>
                {userInfo.imageUrl ? (
                  <img
                    src={userInfo.imageUrl}
                    alt={userInfo.name}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: '2px solid #FFD600',
                      objectFit: 'cover',
                      background: '#FFFBE6',
                      flexShrink: 0
                    }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#FFFBE6',
                    border: '2px solid #FFD600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 20,
                    color: '#232b35',
                    flexShrink: 0
                  }}>
                    {userInitials}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: '#232b35',
                    marginBottom: 2,
                    letterSpacing: 0.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {userInfo.name || "Loading user..."}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    <span style={{ color: '#e91e63', fontSize: 16, display: 'flex', alignItems: 'center' }}>
                      <FaPhone style={{ marginRight: 4 }} />
                      {userInfo.phone
                        ? (
                          <a
                            href={`tel:${userInfo.phone}`}
                            style={{
                              color: '#2196f3',
                              textDecoration: 'none',
                              fontWeight: 600
                            }}
                            title="Call User"
                          >
                            {userInfo.phone}
                          </a>
                        )
                        : <span style={{ color: '#bbb', fontSize: 15 }}>No contact</span>
                      }
                    </span>
                  </div>
                </div>
              </div>
              {/* Booking Details */}
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
              {/* Show only Balance Amount for completed bookings */}
              {booking.status === 'completed' && (
                <div style={{
                  background: '#f7f7f7',
                  borderRadius: 12,
                  padding: '14px 0',
                  marginTop: 12,
                  border: '1px dashed #00b894',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12
                }}>
                  <FaMoneyBillWave size={22} color="#00b894" />
                  <span style={{ fontWeight: 700, color: '#232b35', fontSize: 16 }}>
                    ₹ {booking.balanceAmount || booking.amount || 0}
                  </span>
                  <span style={{
                    background: '#00b894',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '4px 10px',
                    fontWeight: 600,
                    fontSize: 14,
                    marginLeft: 8
                  }}>
                    {booking.paymentMode}
                  </span>
                </div>
              )}
              {/* Payment Details for cancelled bookings */}
              {booking.status === 'cancelled' && (
                <div style={{
                  background: '#fff0f0',
                  borderRadius: 12,
                  padding: '14px 0',
                  marginTop: 16,
                  border: '1px dashed #d32f2f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 18,
                  color: '#d32f2f',
                  fontWeight: 600,
                  fontSize: 15
                }}>
                  <FaTimesCircle size={20} color="#d32f2f" />
                  No payment collected
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Calendar highlight style */}
      <style>
        {`
          .occupied-date {
            background: #FFD600 !important;
            color: #232b35 !important;
            border-radius: 8px !important;
          }
        `}
      </style>

      <BottomNav />
    </div>
  );
}