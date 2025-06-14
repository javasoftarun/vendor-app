import React from 'react';
import { FaArrowLeft, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../common/BottomNav';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f7f8fa',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'inherit',
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          background: '#fff',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          padding: '24px 0 16px 0',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          boxSizing: 'border-box'
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#232b35',
            fontSize: 22,
            position: 'absolute',
            left: 18,
            top: 22,
            cursor: 'pointer'
          }}
          aria-label="Back"
        >
          <FaArrowLeft />
        </button>
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 22,
            color: '#232b35',
            letterSpacing: 0.5
          }}
        >
          Contact Us
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          margin: '32px auto 0 auto',
          padding: '0 16px 80px 16px',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
            padding: '28px 18px 28px 18px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <FaPhoneAlt size={36} color="#FFD600" />
            <h2 style={{ margin: '16px 0 8px 0', fontWeight: 700, color: '#232b35', fontSize: 22 }}>Get in Touch</h2>
            <div style={{ color: '#888', fontSize: 15 }}>
              We are here to help you. Reach out to us via any of the methods below.
            </div>
          </div>
          <div style={{ margin: '18px 0', display: 'flex', alignItems: 'center' }}>
            <FaPhoneAlt color="#FFD600" style={{ marginRight: 12 }} />
            <span style={{ fontSize: 16, color: '#232b35', fontWeight: 500 }}>+91 9140251119</span>
          </div>
          <div style={{ margin: '18px 0', display: 'flex', alignItems: 'center' }}>
            <FaEnvelope color="#FFD600" style={{ marginRight: 12 }} />
            <span style={{ fontSize: 16, color: '#232b35', fontWeight: 500 }}>support@yatranow.com</span>
          </div>
          <div style={{ margin: '18px 0', display: 'flex', alignItems: 'center' }}>
            <FaMapMarkerAlt color="#FFD600" style={{ marginRight: 12 }} />
            <span style={{ fontSize: 16, color: '#232b35', fontWeight: 500 }}>
              Varanasi, Uttar Pradesh, India
            </span>
          </div>
        </div>
      </div>

      {/* Use your existing BottomNav component here */}
      <div style={{
        width: '100%',
        position: 'fixed',
        left: 0,
        bottom: 0,
        zIndex: 100,
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}>
        <BottomNav />
      </div>
    </div>
  );
}