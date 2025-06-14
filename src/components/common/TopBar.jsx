import React from 'react';

function TopBar() {
  return (
    <div style={{
      background: '#232b35',
      color: '#fff',
      padding: '8px 0',
      fontSize: 13,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ marginLeft: 24 }}>
        <span style={{ marginRight: 18 }}>888-910-9891</span>
        <span>Info@SouthernDallasLink.Com</span>
      </div>
      <div style={{ marginRight: 24 }}>
        <span style={{ marginRight: 12, cursor: 'pointer' }}>
          <i className="fa fa-facebook" />
        </span>
        <span style={{ cursor: 'pointer' }}>
          <i className="fa fa-linkedin" />
        </span>
      </div>
    </div>
  );
}

export default TopBar;