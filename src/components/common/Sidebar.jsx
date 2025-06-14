import React from 'react';
import { FaUserCircle, FaUser, FaHistory, FaWallet, FaCarSide, FaBell, FaCog, FaSignOutAlt, FaMoneyBillAlt, FaTachometerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();

  // Helper to close sidebar after navigation (for mobile)
  const goTo = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  return (
    <div style={{
      width: 260,
      minHeight: '100vh',
      background: '#f7f7f7',
      borderRadius: 24,
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Section */}
      <div style={{
        background: '#d3d3d3',
        padding: '32px 0 24px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <FaUserCircle size={70} color="#bbb" />
        <div style={{ fontWeight: 700, fontSize: 18, color: '#232b35', margin: '16px 0 8px 0' }}>
          Passengers Name
        </div>
        <div style={{
          background: '#fff',
          borderRadius: 6,
          padding: '6px 18px',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 700,
          fontSize: 16,
          color: '#232b35',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <FaMoneyBillAlt style={{ marginRight: 8, color: '#bbb' }} />
          $2000
        </div>
      </div>
      {/* Menu Section */}
      <div style={{
        background: '#fff',
        flex: 1,
        padding: '32px 0'
      }}>
        <SidebarItem icon={<FaTachometerAlt color="#bbb" />} label="Dashboard" onClick={() => goTo('/dashboard')} />
        <SidebarItem icon={<FaUser color="#bbb" />} label="My Profile" onClick={() => goTo('/profile')} />
        <SidebarItem icon={<FaHistory color="#bbb" />} label="Transaction History" onClick={() => goTo('/transactions')} />
        <SidebarItem icon={<FaWallet color="#bbb" />} label="My Wallet" onClick={() => goTo('/wallet')} />
        <SidebarItem icon={<FaCarSide color="#bbb" />} label="Ride Ride" onClick={() => goTo('/my-ride')} />
        <SidebarItem icon={<FaBell color="#bbb" />} label="Notification" onClick={() => goTo('/notifications')} />
        <SidebarItem icon={<FaCarSide color="#bbb" />} label="Membership" onClick={() => goTo('/membership')} />
        <SidebarItem icon={<FaCog color="#bbb" />} label="Setting" onClick={() => goTo('/settings')} />
        <SidebarItem icon={<FaSignOutAlt color="#bbb" />} label="Sign Out" onClick={() => goTo('/login')} />
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, onClick }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 32px',
        cursor: 'pointer',
        fontSize: 16,
        color: '#232b35',
        fontWeight: 500
      }}
      onClick={onClick}
    >
      <span style={{ marginRight: 18 }}>{icon}</span>
      {label}
    </div>
  );
}