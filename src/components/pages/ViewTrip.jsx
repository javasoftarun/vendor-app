import React from 'react';
import { FaClock, FaPhoneAlt } from 'react-icons/fa';
import BottomNav from '../common/BottomNav';

export default function ViewTrip() {
  // Example trip data (replace with real data as needed)
  const trip = {
    date: '10-04-2021',
    day: 'Thu',
    time: '05:00',
    code: 'FGETRVDFGT',
    pickup: '109, Mount Vernon, Us',
    drop: '107, New Rochelle, Us',
    pickupTime: '5:00 AM',
    rideId: '3456',
    passengers: 10,
    routePoints: 5,
    fare: '$120.00',
    driver: {
      name: 'Noring James',
      station: 'Ledbetter Station',
      code: 'GGG 0536',
      mobile: '+1 415-569-2700',
      img: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  };

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh', fontFamily: 'inherit' }}>
      <div style={{
        maxWidth: 430,
        margin: '0 auto',
        paddingBottom: 40
      }}>
        {/* User Info Header */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          padding: '24px 18px 18px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginBottom: 18,
          marginTop: 18
        }}>
          <img
            src={trip.driver.img}
            alt={trip.driver.name}
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #FFD600'
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#232b35', marginBottom: 2 }}>
              {trip.driver.name}
            </div>
            <div style={{ color: '#888', fontSize: 15, marginBottom: 2 }}>
              {trip.driver.station}
            </div>
            <div style={{ color: '#FFD600', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
              {trip.driver.code}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaPhoneAlt style={{ color: '#00d084', fontSize: 16 }} />
              <span style={{ color: '#232b35', fontWeight: 600, fontSize: 15 }}>
                {trip.driver.mobile}
              </span>
            </div>
          </div>
        </div>

        {/* Trip Date Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 18
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            padding: '10px 22px',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            fontSize: 16,
            color: '#232b35'
          }}>
            <FaClock style={{ color: '#FFD600', marginRight: 10 }} />
            {trip.date}, {trip.day} {trip.time}
          </div>
        </div>

        {/* Trip Details */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '16px 18px 12px 18px',
          marginBottom: 16
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6
          }}>
            <div style={{ fontWeight: 700, color: '#232b35', fontSize: 15 }}>
              Trip Code: {trip.code}
            </div>
          </div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
            <span style={{ fontWeight: 600, color: '#232b35' }}>Pickup:</span> {trip.pickup}
          </div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
            <span style={{ fontWeight: 600, color: '#232b35' }}>Drop Off:</span> {trip.drop}
          </div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
            <span style={{ fontWeight: 600, color: '#232b35' }}>Pickup Time:</span> {trip.pickupTime}
          </div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
            <span style={{ fontWeight: 600, color: '#232b35' }}>Ride Id:</span> {trip.rideId}
          </div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
            <span style={{ fontWeight: 600, color: '#232b35' }}>Fare:</span>
            <span
              style={{
                background: '#FFD600',
                color: '#232b35',
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 12,
                padding: '4px 16px',
                marginLeft: 10,
                display: 'inline-block'
              }}
            >
              {trip.fare}
            </span>
          </div>
          <div style={{
            display: 'flex',
            gap: 10
          }}>
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}