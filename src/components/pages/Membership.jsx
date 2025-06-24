import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../common/BottomNav';

export default function Membership() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f6fa',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'inherit',
        position: 'relative',
        width: '100vw',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
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
          Membership
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: '48px 0 110px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}
      >
        <div
          style={{
            width: '92%',
            maxWidth: 400,
            marginTop: 32,
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            padding: '36px 24px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 22, color: '#232b35', marginBottom: 10 }}>
            Free Membership
          </div>
          <div style={{ color: '#555', fontSize: 16, marginBottom: 18 }}>
            We are currently providing <span style={{ color: "#FFD600", fontWeight: 700 }}>free service</span> to all vendors. No membership plan is required at this time.
          </div>
          <div style={{ color: '#888', fontSize: 15 }}>
            Enjoy unlimited access to all features at no cost!
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}