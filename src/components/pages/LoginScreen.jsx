import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaPhoneAlt } from 'react-icons/fa';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (phone.length === 10) {
      localStorage.setItem('userToken', 'dummy-token');
      navigate('/dashboard');
    } else {
      alert('Please enter a valid 10-digit phone number');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: '#d32f2f',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        padding: '40px 0',
        textAlign: 'center'
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 30, background: '#FFD600',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #fff', marginBottom: 10, overflow: 'hidden'
        }}>
          <FaUserCircle size={38} color="#d32f2f" />
        </div>
        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: 24, marginTop: 5, letterSpacing: 1 }}>
          Yatra<span style={{ color: '#FFD600' }}>Now</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: 24, maxWidth: 400, margin: '0 auto', width: '100%' }}>
        <div style={{ fontSize: 28, fontWeight: 'bold', color: '#d32f2f', margin: '24px 0', textAlign: 'center' }}>LOGIN</div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #FFD600',
          borderRadius: 24,
          padding: '0 16px',
          marginBottom: 8,
          background: '#fff'
        }}>
          <FaPhoneAlt style={{ marginRight: 8, color: '#FFD600' }} />
          <input
            style={{
              flex: 1,
              padding: 16,
              border: 'none',
              outline: 'none',
              fontSize: 16,
              color: '#d32f2f',
              background: 'transparent'
            }}
            placeholder="Enter Your Phone Number"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/, '').slice(0, 10))}
          />
        </div>
        <div style={{ color: '#d32f2f', fontSize: 12, marginBottom: 24, textAlign: 'center' }}>
          We Need To Text You The OTP To Authentication Your Account
        </div>
        <button
          style={{
            width: '100%', background: '#FFD600', border: 'none', borderRadius: 24,
            padding: 16, fontWeight: 'bold', fontSize: 16, color: '#d32f2f', marginBottom: 16
          }}
          onClick={handleSendOtp}
        >
          SEND OTP
        </button>
        <div style={{ textAlign: 'center', color: '#d32f2f', marginBottom: 16 }}>
          Don't Have An Account?{' '}
          <span style={{ color: '#FFD600', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/register')}>
            Register
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: 16 }}>
        <span style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }} onClick={() => navigate('/driver-login')}>
          Login As Driver
        </span>
      </div>
    </div>
  );
}