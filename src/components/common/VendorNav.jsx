import React from 'react';
import { FaIdBadge, FaCar, FaUser, FaWallet, FaCreditCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function VendorNav({ active = "Dashboard" }) {
  const navigate = useNavigate();
  const navItems = [
    { label: "Dashboard", icon: <FaIdBadge size={22} />, path: "/dashboard" },
    { label: "My Ride", icon: <FaCar size={22} />, path: "/my-ride" },
    { label: "Profile", icon: <FaUser size={22} />, path: "/profile" },
    { label: "Wallet", icon: <FaWallet size={22} />, path: "/wallet" },
    { label: "Membership", icon: <FaCreditCard size={22} />, path: "/membership" }
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 24,
      background: '#f7f7f7',
      padding: '18px 0 10px 0',
      borderBottom: '1px solid #eee'
    }}>
      {navItems.map(item => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: active === item.label ? '#FFD600' : '#232b35',
            fontWeight: active === item.label ? 700 : 500,
            fontSize: 13,
            cursor: 'pointer',
            borderBottom: active === item.label ? '3px solid #FFD600' : '3px solid transparent',
            paddingBottom: 4,
            minWidth: 70
          }}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span style={{ marginTop: 4 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}