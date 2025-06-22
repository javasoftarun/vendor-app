import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import BottomNav from '../common/BottomNav';
import { useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../config/apiConfig';

export default function BookingRequest() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [action, setAction] = useState({});
  const [loading, setLoading] = useState(true);

  // Get userId safely
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.userId || user.id || "";
  const API_ENDPOINT = API_ENDPOINTS.GET_PENDING_REQUESTS_BY_VENDOR_ID(userId);

  // Fetch booking requests from API
  useEffect(() => {
    async function fetchBooking() {
      setLoading(true);
      try {
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();
        if (
          response.ok &&
          data.responseCode === 200 &&
          Array.isArray(data.responseData) &&
          data.responseData.length > 0
        ) {
          const bookingsArr = data.responseData.flat();
          setBookings(bookingsArr);
        } else {
          setBookings([]);
        }
      } catch (err) {
        setBookings([]);
      }
      setLoading(false);
    }
    fetchBooking();
  }, [API_ENDPOINT]);

  // Accept/Reject handlers per booking
  const handleBookingAction = async (bookingId, cabRegistrationId, bookingStatus, paymentStatus = "", role = "DRIVER") => {
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_BOOKING_STATUS, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          cabRegistrationId,
          bookingStatus,
          paymentStatus,
          role
        })
      });
      const data = await response.json();
      if (response.ok && data.responseCode === 200) {
        setAction(prev => ({ ...prev, [bookingId]: bookingStatus.toLowerCase() }));
        setBookings(prev =>
          prev.map(b =>
            b.bookingId === bookingId ? { ...b, bookingStatus } : b
          )
        );
      } else {
        alert(data.responseMessage || "Failed to update booking status.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  // Header and back button (always visible)
  const Header = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 18px 0 18px',
        gap: 12,
        background: '#f7f7f7'
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
        Booking Request
      </div>
    </div>
  );

  // Show loading GIF while fetching, but keep header
  if (loading) {
    return (
      <div style={{
        background: '#f7f7f7',
        minHeight: '100vh',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {Header}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <img
            src="https://i.gifer.com/ZZ5H.gif"
            alt="Loading..."
            style={{ width: 80, height: 80, marginBottom: 18 }}
          />
          <div style={{ color: "#232b35", fontWeight: 600, fontSize: 18 }}>Loading booking request...</div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div style={{
        background: '#f7f7f7',
        minHeight: '100vh',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {Header}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ color: "#232b35", fontWeight: 600, fontSize: 18 }}>No booking request found.</div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Top bar */}
      {Header}

      {/* Booking Card */}
      <div
        style={{
          maxWidth: 420,
          margin: '32px auto 0 auto',
          padding: '0 0 40px 0'
        }}
      >
        {bookings.map((booking, idx) => {
          // Format date and time in user-friendly format
          const pickupDate = booking?.pickupDateTime ? new Date(booking.pickupDateTime) : null;
          const dateStr = pickupDate
            ? pickupDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
            : '';
          const timeStr = pickupDate
            ? pickupDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })
            : '';
          const bookingAction = action[booking.bookingId];

          return (
            <div key={booking.bookingId || idx}
              style={{
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 2px 16px 0 rgba(44,62,80,0.07)',
                padding: 0,
                marginBottom: 18,
                border: '1px solid #e0e0e0',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Header section */}
              <div style={{
                borderBottom: '1px solid #e0e0e0',
                padding: '16px 20px 12px 20px',
                display: 'flex',
                alignItems: 'center',
                borderTopLeftRadius: 14,
                borderTopRightRadius: 14,
                background: '#fff'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#232b35', letterSpacing: 0.2 }}>
                    Booking #{booking.bookingId}
                  </div>
                  <div style={{ color: '#888', fontWeight: 500, fontSize: 12, marginTop: 2 }}>
                    {dateStr} {timeStr}
                  </div>
                </div>
                <div style={{
                  marginLeft: 'auto',
                  fontWeight: 700,
                  color: '#232b35',
                  fontSize: 16,
                  background: '#f5f5f5',
                  borderRadius: 8,
                  padding: '6px 14px',
                  border: '1px solid #e0e0e0'
                }}>
                  ₹{booking.fare}
                </div>
              </div>

              {/* Locations */}
              <div style={{
                padding: '16px 20px 0 20px',
                background: '#fff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaMapMarkerAlt color="#232b35" size={14} />
                  <span style={{ fontWeight: 600, color: '#232b35', fontSize: 13 }}>
                    {booking.pickupLocation}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <FaMapMarkerAlt color="#232b35" size={14} />
                  <span style={{ fontWeight: 600, color: '#232b35', fontSize: 13 }}>
                    {booking.dropLocation}
                  </span>
                </div>
              </div>

              {/* Cab Details */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 20px 0 20px'
              }}>
                <div style={{
                  background: '#f5f5f5',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontWeight: 600,
                  fontSize: 13,
                  color: '#232b35',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ color: '#888', fontWeight: 600, fontSize: 11 }}>Cab Name</span>
                  <span>{booking.cabName}</span>
                </div>
                <div style={{
                  background: '#f5f5f5',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontWeight: 600,
                  fontSize: 13,
                  color: '#232b35',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ color: '#888', fontWeight: 600, fontSize: 11 }}>Cab Number</span>
                  <span>{booking.cabNumber}</span>
                </div>
              </div>

              {/* Trip Details */}
              <div
                style={{
                  margin: '18px 0 0 0',
                  background: '#fafafa',
                  borderRadius: '0 0 14px 14px',
                  padding: '12px 20px 12px 20px',
                  fontSize: 13,
                  color: '#232b35',
                  borderTop: '1px solid #e0e0e0'
                }}
              >
                <div style={{ marginBottom: 4 }}>
                  <b>Passengers:</b> {booking.cabCapacity || 4}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <b>Payment Status:</b> {booking.paymentStatus}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <b>Token Amount:</b> ₹{booking.tokenAmount}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <b>Balance Amount:</b> ₹{booking.balanceAmount}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <b>Insurance:</b> {booking.cabInsurance}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <b>Distance:</b> {booking.tripDistance}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <b>Duration:</b> {booking.tripDuration}
                </div>
              </div>

              {/* Action Buttons */}
              {(booking.bookingStatus === 'Pending' || booking.status === 'pending') && (
                <div style={{
                  display: 'flex',
                  gap: 10,
                  margin: '18px 20px 0 20px',
                  paddingBottom: 14
                }}>
                  <button
                    onClick={() => handleBookingAction(booking.bookingId, booking.cabRegistrationId, "Accepted", booking.paymentStatus)}
                    disabled={bookingAction === 'accepted' || bookingAction === 'rejected'}
                    style={{
                      flex: 1,
                      background: '#232b35',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      padding: '10px 0',
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: (bookingAction === 'accepted' || bookingAction === 'rejected') ? 'not-allowed' : 'pointer',
                      opacity: (bookingAction === 'accepted' || bookingAction === 'rejected') ? 0.6 : 1,
                      letterSpacing: 0.3,
                      transition: 'background 0.2s'
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleBookingAction(booking.bookingId, booking.cabRegistrationId, "Rejected", booking.paymentStatus)}
                    disabled={bookingAction === 'accepted' || bookingAction === 'rejected'}
                    style={{
                      flex: 1,
                      background: '#fff',
                      color: '#232b35',
                      border: '2px solid #232b35',
                      borderRadius: 10,
                      padding: '10px 0',
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: (bookingAction === 'accepted' || bookingAction === 'rejected') ? 'not-allowed' : 'pointer',
                      opacity: (bookingAction === 'accepted' || bookingAction === 'rejected') ? 0.6 : 1,
                      letterSpacing: 0.3,
                      transition: 'background 0.2s'
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Status Message */}
              {bookingAction === 'accepted' && (
                <div style={{ color: '#00b894', fontWeight: 700, marginTop: 14, textAlign: 'center', fontSize: 14 }}>
                  Booking Accepted
                </div>
              )}
              {bookingAction === 'rejected' && (
                <div style={{ color: '#d32f2f', fontWeight: 700, marginTop: 14, textAlign: 'center', fontSize: 14 }}>
                  Booking Rejected
                </div>
              )}
            </div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}