import React, { useState } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import BottomNav from '../common/BottomNav';

const tripsData = [
  {
    date: '08-08-2020',
    day: 'Sunday',
    code: 'FGETRVDFGT',
    pickup: '109, Mount Vernon, Us',
    drop: '107, New Rochelle, Us',
    pickupTime: '5:00 AM',
    rideId: '3456',
    status: 'upcoming'
  },
  {
    date: '08-08-2020',
    day: 'Sunday',
    code: 'FGETRVDFGT',
    pickup: '107, New Rochelle, Us',
    drop: '109, Mount Vernon, Us',
    pickupTime: '6:00 PM',
    rideId: '4564',
    status: 'upcoming'
  },
  {
    date: '08-08-2020',
    day: 'Sunday',
    code: 'DGTRFREWTQ',
    pickup: '126, Ledbetter Station',
    drop: '234, Camp Hornr Rd, Ennis',
    pickupTime: '5:00 AM',
    rideId: '4567',
    status: 'upcoming'
  }
];

const TABS = [
  { label: 'Upcomming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
];

export default function MyTrips() {
  const [trips, setTrips] = useState(tripsData);
  const [tab, setTab] = useState('upcoming');

  const handleAction = (index, action) => {
    setTrips(trips =>
      trips.map((trip, i) =>
        i === index ? { ...trip, status: action } : trip
      )
    );
  };

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh', fontFamily: 'inherit' }}>
      <div style={{
        maxWidth: 430,
        margin: '0 auto',
        paddingBottom: 40
      }}>
        {/* Header */}
        <div style={{
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          padding: '28px 20px 18px 20px',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 700,
          fontSize: 22,
          color: '#232b35',
          letterSpacing: 1,
          marginBottom: 0,
          justifyContent: 'center'
        }}>
          MY RIDES
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          margin: '22px 0 18px 0'
        }}>
          {TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              style={{
                background: tab === t.value ? '#FFD600' : '#f3f3f3',
                color: tab === t.value ? '#232b35' : '#888',
                border: 'none',
                borderRadius: 18,
                padding: '8px 26px',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: tab === t.value ? '0 2px 8px rgba(0,0,0,0.07)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Rides List */}
        <div>
          {trips.filter(trip => trip.status === tab).map((trip, idx) => (
            <div key={idx} style={{
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              padding: '18px 18px 12px 18px',
              marginBottom: 18
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8
              }}>
                <div style={{ fontWeight: 700, color: '#232b35', fontSize: 15 }}>
                  {trip.date} <span style={{ color: '#888', fontWeight: 500 }}>{trip.day}</span>
                </div>
                <div style={{ fontWeight: 700, color: '#232b35', fontSize: 15, letterSpacing: 1 }}>
                  {trip.code}
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 14,
                color: '#232b35',
                marginBottom: 6
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                    <FaMapMarkerAlt style={{ marginRight: 5, color: '#d32f2f' }} /> Pickup Location
                  </div>
                  <div style={{ marginLeft: 18 }}>{trip.pickup}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                    <FaClock style={{ marginRight: 5, color: '#FFD600' }} /> Pickup Time
                  </div>
                  <div style={{ marginLeft: 18 }}>{trip.pickupTime}</div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 14,
                color: '#232b35',
                marginBottom: 6
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                    <FaMapMarkerAlt style={{ marginRight: 5, color: '#d32f2f' }} /> Drop Off
                  </div>
                  <div style={{ marginLeft: 18 }}>{trip.drop}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                    Ride Id
                  </div>
                  <div style={{ marginLeft: 18 }}>{trip.rideId}</div>
                </div>
              </div>
              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 12,
                gap: 8
              }}>
                <button
                  style={{
                    flex: 1,
                    background: trip.status === 'rejected' ? '#eee' : '#fff',
                    color: trip.status === 'rejected' ? '#bbb' : '#d32f2f',
                    border: '1.5px solid #d32f2f',
                    borderRadius: 18,
                    padding: '8px 0',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: trip.status === 'rejected' ? 'not-allowed' : 'pointer',
                    marginRight: 4
                  }}
                  disabled={trip.status === 'rejected'}
                  onClick={() => handleAction(idx, 'rejected')}
                >
                  Cancel Trip
                </button>
                <button
                  style={{
                    flex: 1,
                    background: trip.status === 'accepted' ? '#FFD600' : '#fff',
                    color: trip.status === 'accepted' ? '#232b35' : '#FFD600',
                    border: '1.5px solid #FFD600',
                    borderRadius: 18,
                    padding: '8px 0',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: trip.status === 'accepted' ? 'not-allowed' : 'pointer'
                  }}
                  disabled={trip.status === 'accepted'}
                  onClick={() => handleAction(idx, 'accepted')}
                >
                  I Am Ready
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom Navigation */}
            <BottomNav />
    </div>
  );
}