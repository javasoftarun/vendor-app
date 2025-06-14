import React, { useState } from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../common/BottomNav';

const passengers = [
  {
    id: 87,
    name: 'George Agoos',
    company: 'Techmate',
    from: 'Lower Abbey St, Lifford, Ennis',
    to: '124 N 1st St, Midlothian',
    img: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 67,
    name: 'Vanessa Angel',
    company: 'Apple',
    from: '119 N Dallas St, Ennis',
    to: 'Ledbetter Station',
    img: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 74,
    name: 'Gemma Arterton',
    company: 'Dreamvision',
    from: 'Lower Abbey St, Lifford, Ennis',
    to: '912 W Park Ave, Corsicana',
    img: 'https://randomuser.me/api/portraits/women/65.jpg'
  },
  {
    id: 69,
    name: 'Ben Barnes',
    company: 'Jv Soft',
    from: 'Lower Abbey St, Lifford, Ennis',
    to: 'Ledbetter Station',
    img: 'https://randomuser.me/api/portraits/men/41.jpg'
  }
];

export default function TripPassengers() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredPassengers = passengers.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Search Bar */}
      <div style={{
        background: '#FFD600',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        padding: '24px 18px 18px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        position: 'sticky',
        top: 0,
        zIndex: 2
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#232b35',
            marginRight: 8,
            cursor: 'pointer'
          }}
        >
          &#8592;
        </button>
        <div style={{
          flex: 1,
          background: '#fff',
          borderRadius: 22,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px'
        }}>
          <FaSearch style={{ color: '#FFD600', fontSize: 18, marginRight: 8 }} />
          <input
            type="text"
            placeholder="Search Passengers"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 16,
              padding: '10px 0',
              flex: 1
            }}
          />
        </div>
      </div>
      {/* Passenger Count */}
      <div style={{
        color: '#888',
        fontWeight: 600,
        fontSize: 16,
        margin: '18px 0 8px 18px'
      }}>
        {passengers.length} Passengers
      </div>
      {/* Passenger List */}
      {filteredPassengers.map((p, idx) => (
        <div key={p.id} style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '16px 18px 12px 18px',
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 8
          }}>
            <img
              src={p.img}
              alt={p.name}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: 14
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#232b35' }}>{p.name}</div>
              <div style={{ color: '#888', fontSize: 15 }}>{p.company}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#232b35', minWidth: 60, textAlign: 'right' }}>
              Id: <span style={{ color: '#3bb4f2' }}>{p.id}</span>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: '#232b35',
            fontSize: 14,
            marginBottom: 2
          }}>
            <FaMapMarkerAlt style={{ marginRight: 6, color: '#FFD600' }} />
            {p.from}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: '#232b35',
            fontSize: 14,
            marginBottom: 10
          }}>
            <FaMapMarkerAlt style={{ marginRight: 6, color: '#3bb4f2' }} />
            {p.to}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <button style={{
              background: '#00d084',
              color: '#fff',
              border: 'none',
              borderRadius: 22,
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer'
            }}>
              <FaPhoneAlt />
            </button>
            <button style={{
              flex: 1,
              background: '#FFD600',
              color: '#232b35',
              border: 'none',
              borderRadius: 22,
              padding: '10px 0',
              fontWeight: 700,
              fontSize: 18,
              cursor: 'pointer'
            }}>
              End Trip
            </button>
          </div>
        </div>
      ))}
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}