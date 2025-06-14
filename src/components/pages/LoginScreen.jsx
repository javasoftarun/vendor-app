import React, { useState, useRef } from 'react';
import { FaPhoneAlt, FaUserCircle, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('login'); // 'login' or 'verify'
  const [error, setError] = useState('');
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();

  const handleSendOtp = e => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    setError('');
    // TODO: Trigger OTP send API here
    setStep('verify');
  };

  const handleOtpChange = (value, idx) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) {
      otpRefs[idx + 1].current.focus();
    }
    if (!value && idx > 0) {
      otpRefs[idx - 1].current.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current.focus();
    }
  };

  const handleVerifyOtp = e => {
    e.preventDefault();
    if (otp.some(digit => digit === '')) {
      setError('Enter the 6-digit OTP sent to your mobile');
      return;
    }
    setError('');
    // TODO: Verify OTP logic here
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontFamily: 'inherit',
        position: 'relative'
      }}
    >
      {/* Header with logo and yellow background */}
      <div
        style={{
          width: '100%',
          borderBottomLeftRadius: 36,
          borderBottomRightRadius: 36,
          padding: '36px 0 24px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
          }}
        >
          <FaUserCircle size={48} color="#bbb" />
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 22,
            color: '#232b35',
            marginTop: 6,
            letterSpacing: 0.5,
            textAlign: 'center'
          }}
        >
          {step === 'login' ? 'LOGIN' : 'VERIFY OTP'}
        </div>
      </div>

      {/* Login or OTP Form */}
      <form
        onSubmit={step === 'login' ? handleSendOtp : handleVerifyOtp}
        style={{
          width: '100%',
          maxWidth: 340,
          margin: '0 auto',
          marginTop: 36,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {step === 'login' ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f5f6fa',
                borderRadius: 12,
                border: 'none',
                marginBottom: 14,
                padding: '13px 16px',
                width: '100%'
              }}
            >
              <FaPhoneAlt style={{ color: '#bbb', marginRight: 10, fontSize: 16 }} />
              <input
                type="tel"
                placeholder="Enter Your Phone Number"
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/,''))}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 16,
                  flex: 1
                }}
                maxLength={10}
                inputMode="numeric"
              />
            </div>
            {error && (
              <div style={{ color: '#232b35', fontWeight: 600, marginBottom: 12, textAlign: 'center', width: '100%' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#FFD600',
                color: '#232b35',
                border: 'none',
                borderRadius: 24,
                padding: '15px 0',
                fontWeight: 700,
                fontSize: 17,
                cursor: 'pointer',
                marginTop: 10,
                marginBottom: 18,
                boxShadow: '0 2px 8px rgba(255,214,0,0.10)'
              }}
            >
              SEND OTP
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => { setStep('login'); setError(''); setOtp(['','','','','','']); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#232b35',
                fontSize: 18,
                position: 'absolute',
                left: 18,
                top: 18,
                cursor: 'pointer'
              }}
              aria-label="Back"
            >
              <FaArrowLeft />
            </button>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 18,
              marginTop: 10,
              width: '100%'
            }}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(e.target.value, idx)}
                  onKeyDown={e => handleOtpKeyDown(e, idx)}
                  style={{
                    width: 38,
                    height: 48,
                    borderRadius: 10,
                    border: '1.5px solid #FFD600',
                    background: '#f5f6fa',
                    textAlign: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#232b35',
                    outline: 'none',
                    boxShadow: '0 1px 4px rgba(255,214,0,0.05)'
                  }}
                  autoFocus={idx === 0}
                />
              ))}
            </div>
            <div
              style={{
                color: '#232b35',
                fontSize: 14,
                opacity: 0.7,
                marginBottom: 10,
                textAlign: 'center',
                width: '100%'
              }}
            >
              Enter the 6-digit OTP sent to <b>{mobile}</b>
            </div>
            {error && (
              <div style={{ color: '#232b35', fontWeight: 600, marginBottom: 12, textAlign: 'center', width: '100%' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#FFD600',
                color: '#232b35',
                border: 'none',
                borderRadius: 24,
                padding: '15px 0',
                fontWeight: 700,
                fontSize: 17,
                cursor: 'pointer',
                marginTop: 10,
                marginBottom: 18,
                boxShadow: '0 2px 8px rgba(255,214,0,0.10)'
              }}
            >
              VERIFY OTP
            </button>
          </>
        )}
      </form>
      <div
        style={{
          textAlign: 'center',
          color: '#232b35',
          fontSize: 15,
          marginBottom: 8
        }}
      >
        Don't Have An Account?{" "}
        <span
          style={{
            color: '#232b35',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          onClick={() => window.location.href = '/register'}
        >
          Register
        </span>
      </div>
      <div style={{
        position: 'absolute',
        bottom: 18,
        left: 0,
        width: '100%',
        textAlign: 'center',
        color: '#232b35',
        fontSize: 15,
        fontWeight: 500
      }}>
        Login As Driver
      </div>
    </div>
  );
}