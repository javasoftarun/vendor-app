import React from 'react';

const menuStyle = {
  color: '#232b35',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer'
};

function LogoMenu() {
  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid #eee',
      padding: 0
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 0'
      }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#d32f2f', letterSpacing: 1 }}>
          Yatra<span style={{ color: '#FFD600' }}>Now</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <span style={menuStyle}>Home</span>
          <span style={menuStyle}>About Us</span>
          <span style={menuStyle}>Schedule A Ride</span>
          <span style={menuStyle}>Our Services</span>
          <span style={menuStyle}>Our Board</span>
          <span style={menuStyle}>More</span>
          <button style={{
            background: '#FFD600',
            color: '#232b35',
            border: 'none',
            borderRadius: 8,
            padding: '7px 24px',
            fontWeight: 700,
            marginLeft: 12,
            cursor: 'pointer'
          }}>Login</button>
          <button style={{
            background: '#fff',
            color: '#FFD600',
            border: '2px solid #FFD600',
            borderRadius: 8,
            padding: '7px 24px',
            fontWeight: 700,
            marginLeft: 4,
            cursor: 'pointer'
          }}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default LogoMenu;