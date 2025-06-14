import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaUserCircle, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import BottomNav from '../common/BottomNav';
import { useNavigate } from 'react-router-dom';

const mockBooking = {
  id: 'BR-20250613-001',
  passengerName: 'John Doe',
  passengerImage: 'https://randomuser.me/api/portraits/men/45.jpg',
  pickup: '123 Main St, Springfield',
  drop: '456 Oak Ave, Shelbyville',
  date: '2025-06-14',
  time: '10:30 AM',
  passengers: 3,
  fare: '$120',
  status: 'pending',
  tripDetails: {
    distance: '18 km',
    duration: '35 min',
    vehicle: 'Toyota Innova',
    notes: 'Handle with care, elderly passenger'
  }
};

export default function BookingRequest() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(mockBooking);
  const [showDetails, setShowDetails] = useState(false);
  const [action, setAction] = useState(null);
  const beepRef = useRef(null);

  // Play a "cool music" melody when booking is pending
  useEffect(() => {
    if (booking.status === 'pending') {
      // Cool melody: simple arpeggio (C-E-G-E)
      const coolMelody = () => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 659.25]; // C5, E5, G5, E5
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.13, ctx.currentTime + i * 0.12);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.12 + 0.11);
          osc.connect(gain).connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.12);
          osc.stop(ctx.currentTime + i * 0.12 + 0.11);
          osc.onended = () => ctx.close();
        });
      };
      beepRef.current = setInterval(coolMelody, 600);
      coolMelody(); // Play immediately
    } else {
      if (beepRef.current) clearInterval(beepRef.current);
    }
    return () => {
      if (beepRef.current) clearInterval(beepRef.current);
    };
  }, [booking.status]);

  const handleAccept = () => {
    setAction('accepted');
    setBooking({ ...booking, status: 'accepted' });
  };

  const handleReject = () => {
    setAction('rejected');
    setBooking({ ...booking, status: 'rejected' });
  };

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
          Booking Request
        </div>
      </div>

      {/* Booking Card */}
      <div
        style={{
          maxWidth: 430,
          margin: '32px auto 0 auto',
          padding: '0 0 40px 0'
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            padding: '20px 18px',
            marginBottom: 18
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#eee',
                overflow: 'hidden'
              }}
            >
              {booking.passengerImage ? (
                <img
                  src={booking.passengerImage}
                  alt={booking.passengerName}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <FaUserCircle size={36} color="#bbb" />
              )}
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#232b35' }}>
                {booking.passengerName}
              </div>
              <div style={{ color: '#888', fontSize: 14, marginTop: 2 }}>
                Booking ID: {booking.id}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', fontWeight: 700, color: '#00b894', fontSize: 16 }}>
              {booking.fare}
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaMapMarkerAlt color="#FFD600" />
            <span style={{ fontWeight: 600, color: '#232b35', fontSize: 15 }}>
              {booking.pickup}
            </span>
          </div>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaMapMarkerAlt color="#d32f2f" />
            <span style={{ fontWeight: 600, color: '#232b35', fontSize: 15 }}>
              {booking.drop}
            </span>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 14 }}>
              <FaClock style={{ color: '#3bb4f2' }} /> {booking.date} {booking.time}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 14 }}>
              <FaUsers style={{ color: '#FFD600' }} /> {booking.passengers} Passengers
            </div>
          </div>

          {/* Action Buttons */}
          {booking.status === 'pending' && (
            <div style={{ display: 'flex', gap: 14, marginTop: 24 }}>
              <button
                onClick={handleAccept}
                style={{
                  flex: 1,
                  background: '#00d084',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 16,
                  padding: '12px 0',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                style={{
                  flex: 1,
                  background: '#d32f2f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 16,
                  padding: '12px 0',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                Reject
              </button>
            </div>
          )}

          {/* Status Message */}
          {action === 'accepted' && (
            <div style={{ color: '#00b894', fontWeight: 700, marginTop: 20, textAlign: 'center' }}>
              Booking Accepted
            </div>
          )}
          {action === 'rejected' && (
            <div style={{ color: '#d32f2f', fontWeight: 700, marginTop: 20, textAlign: 'center' }}>
              Booking Rejected
            </div>
          )}

          {/* View Trip Details */}
          <div
            style={{
              marginTop: 22,
              textAlign: 'center',
              color: '#3bb4f2',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer'
            }}
            onClick={() => setShowDetails((v) => !v)}
          >
            {showDetails ? 'Hide Trip Details' : 'View Trip Details'}
          </div>
          {showDetails && (
            <div
              style={{
                marginTop: 16,
                background: '#f7f7f7',
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: 15,
                color: '#232b35'
              }}
            >
              <div>
                <b>Distance:</b> {booking.tripDetails.distance}
              </div>
              <div>
                <b>Duration:</b> {booking.tripDetails.duration}
              </div>
              <div>
                <b>Vehicle:</b> {booking.tripDetails.vehicle}
              </div>
              <div>
                <b>Notes:</b> {booking.tripDetails.notes}
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}