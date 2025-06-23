import React, { } from 'react';
import BottomNav from '../common/BottomNav';
import {
  FaMoneyCheckAlt,
  FaHistory,
  FaBuilding,
  FaCreditCard,
  FaPlusCircle,
  FaTools,
  FaIdCard,
  FaCog,
  FaBell
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  {
    label: 'Booking Request',
    icon: <FaMoneyCheckAlt size={28} color="#d32f2f" />,
    path: '/booking-request'
  },
  {
    label: 'My Bookings',
    icon: <FaBuilding size={28} color="#FFD600" />,
    path: '/my-bookings'
  },
  {
    label: 'Booking History',
    icon: <FaHistory size={28} color="#00d084" />,
    path: '/booking-history'
  },
  {
    label: 'Add Vehicle',
    icon: <FaPlusCircle size={28} color="#3bb4f2" />,
    path: '/add-vehicle'
  },
  {
    label: 'Manage Vehicle',
    icon: <FaTools size={28} color="#3bb4f2" />,
    path: '/manage-vehicle'
  },
  {
    label: 'Membership',
    icon: <FaIdCard size={28} color="#3bb4f2" />,
    path: '/membership'
  },
  {
    label: 'Payment History',
    icon: <FaCreditCard size={28} color="#d32f2f" />,
    path: '/payment-history'
  },
  {
    label: 'Settings',
    icon: <FaCog size={28} color="#FFD600" />,
    path: '/settings'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  // get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const imageUrl =
    user.imageUrl && user.imageUrl !== "null"
      ? user.imageUrl
      : "https://randomuser.me/api/portraits/men/32.jpg"; // Default user image

  return (
    <div
      style={{
        background: '#fff',
        minHeight: '100vh',
        fontFamily: 'inherit',
        position: 'relative',
      }}
    >
      {/* Top bar with profile image, search, and notifications icon */}
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
            overflow: 'hidden',
            marginRight: 0
          }}
        >
          <img
            src={imageUrl}
            alt="User"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </span>
        <input
          type="text"
          placeholder="Type or speak to search"
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 18,
            border: '1.5px solid #eee',
            fontSize: 16,
            background: '#f7f7f7',
            outline: 'none'
          }}
        />
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
            marginLeft: 0
          }}
          onClick={() => navigate('/notifications')}
        >
          <FaBell size={22} color="#888" />
        </span>
      </div>

      {/* Menu Grid */}
      <div style={{
        maxWidth: 430,
        margin: '32px auto 0 auto',
        padding: '0 0 40px 0'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 18,
          margin: '0 18px 24px 18px'
        }}>
          {menuItems.map((item, idx) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                background: '#fff',
                borderRadius: 18,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '18px 6px 12px 6px',
                cursor: 'pointer',
                minHeight: 100
              }}
            >
              {item.icon}
              <span style={{
                marginTop: 10,
                fontSize: 13,
                color: '#232b35',
                textAlign: 'center',
                fontWeight: 600
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}