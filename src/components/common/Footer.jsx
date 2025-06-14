import React from 'react';

function Footer() {
  return (
    <div style={{
      background: '#232b35',
      color: '#fff',
      marginTop: 40,
      padding: '24px 0 12px 0'
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 24
      }}>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>About</div>
          <div style={{ color: '#FFD600', fontWeight: 600, fontSize: 13 }}>Vendor Portal</div>
          <div style={{ fontSize: 13, marginTop: 6, color: '#bbb' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Useful Links</div>
          <div style={{ fontSize: 13, color: '#FFD600', marginBottom: 4 }}>Home</div>
          <div style={{ fontSize: 13, color: '#FFD600', marginBottom: 4 }}>Rides</div>
          <div style={{ fontSize: 13, color: '#FFD600', marginBottom: 4 }}>Profile</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Services</div>
          <div style={{ fontSize: 13, color: '#FFD600', marginBottom: 4 }}>Ride to Work</div>
          <div style={{ fontSize: 13, color: '#FFD600', marginBottom: 4 }}>Wallet</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Contact Us</div>
          <div style={{ fontSize: 13, color: '#FFD600', marginBottom: 4 }}>3662 W Camp Wisdom Road</div>
          <div style={{ fontSize: 13, color: '#FFD600', marginBottom: 4 }}>888-910-9891</div>
        </div>
      </div>
      <div style={{
        borderTop: '1px solid #444',
        marginTop: 18,
        paddingTop: 10,
        textAlign: 'center',
        color: '#bbb',
        fontSize: 13
      }}>
        &copy; {new Date().getFullYear()} Vendor Portal. All rights reserved.
      </div>
    </div>
  );
}

export default Footer;