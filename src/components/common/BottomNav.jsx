import React from 'react';
import { FaHome, FaUserCircle, FaPlusCircle, FaPhoneAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const bottomNav = [
  { label: 'Home', icon: <FaHome size={22} />, path: '/dashboard' },
  { label: 'Me', icon: <FaUserCircle size={22} />, path: '/profile' },
  { label: 'Add Vehicle', icon: <FaPlusCircle size={22} />, path: '/add-vehicle' },
  { label: 'Contact', icon: <FaPhoneAlt size={22} />, path: '/contact' },
  { label: 'Logout', icon: <FaSignOutAlt size={22} />, path: '/login' },
];

export default function BottomNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    // Optionally clear cookies if used for auth
    // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/login');
  };

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100vw',
      background: '#fff',
      borderTop: '1.5px solid #eee',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '6px 0',
      zIndex: 100
    }}>
      {bottomNav.map((item) => (
        <div
          key={item.label}
          onClick={
            item.label === 'Logout'
              ? handleLogout
              : () => navigate(item.path)
          }
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: 12,
            color: '#232b35',
            cursor: 'pointer',
            flex: 1
          }}
        >
          {item.icon}
          <span style={{ marginTop: 2 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}