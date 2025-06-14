import React, { useState } from 'react';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../common/BottomNav';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    duration: 'Free',
    features: [
      'Standard rides',
      'App support',
    ],
    highlight: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 499,
    duration: '/year',
    features: [
      'Unlimited rides',
      'Exclusive discounts',
      'Priority support',
      'Early access to features',
    ],
    highlight: true,
  },
];

export default function Membership() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('premium');

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
          padding: '28px 0 110px 0',
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
            maxWidth: 360,
            marginTop: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 18
          }}
        >
          {plans.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{
                background: '#fff',
                border: selected === plan.id ? '2px solid #FFD600' : '1.5px solid #eee',
                borderRadius: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '20px 18px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'border 0.2s, box-shadow 0.2s, background 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#232b35',
                  flex: 1
                }}>
                  {plan.name}
                </div>
                {selected === plan.id && (
                  <FaCheckCircle color="#FFD600" size={22} />
                )}
              </div>
              <div style={{ fontWeight: 700, fontSize: 20, color: '#232b35', marginBottom: 4 }}>
                {plan.price === 0 ? 'Free' : `₹${plan.price}`} <span style={{ fontWeight: 400, fontSize: 14, color: '#888' }}>{plan.duration}</span>
              </div>
              <ul style={{ color: '#555', fontSize: 15, paddingLeft: 18, margin: '8px 0 0 0' }}>
                {plan.features.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Pay Now Button - fixed above footer nav */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          bottom: 64,
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 100,
          background: 'transparent'
        }}
      >
        <button
          disabled={selected === 'basic'}
          style={{
            width: '92%',
            maxWidth: 360,
            background: selected === 'basic' ? '#ccc' : '#FFD600',
            color: selected === 'basic' ? '#fff' : '#232b35',
            border: 'none',
            borderRadius: 12,
            padding: '16px 0',
            fontWeight: 800,
            fontSize: 18,
            cursor: selected === 'basic' ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(255,214,0,0.10)',
            marginBottom: 14,
            letterSpacing: 0.2,
            transition: 'background 0.2s'
          }}
        >
          {selected === 'basic' ? 'Already Active' : `Pay Now ₹499 / year`}
        </button>
      </div>
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}