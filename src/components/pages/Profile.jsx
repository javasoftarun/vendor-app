import React, { useState } from 'react';
import { FaArrowLeft, FaPen, FaStar, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaVenusMars, FaCalendar } from 'react-icons/fa';
import BottomNav from '../common/BottomNav';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState({
    name: user.name || '',
    phone: user.phone || 'Please add your phone number',
    address: user.address || 'Please add your address',
    email: user.email || 'Please add your email',
    rating: user.rating || 4.7,
    image: user.imageUrl && user.imageUrl !== "null" ? user.imageUrl : 'https://randomuser.me/api/portraits/men/32.jpg'
  });

  const [editField, setEditField] = useState(null);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = (field) => setEditField(field);

  const handleSave = () => setEditField(null);

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Top bar with back arrow, profile image, and name */}
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
            cursor: 'pointer',
            marginRight: 0
          }}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft size={22} color="#232b35" />
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#fff',
            border: '3px solid #FFD600',
            overflow: 'hidden',
            marginRight: 0
          }}
        >
          <img
            src={profile.image}
            alt="User"
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </span>
        <div style={{ flex: 1, fontWeight: 700, fontSize: 20, color: '#232b35', display: 'flex', alignItems: 'center', gap: 8 }}>
          {editField === 'name' ? (
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: '#232b35',
                border: 'none',
                borderBottom: '1.5px solid #FFD600',
                background: 'transparent',
                outline: 'none',
                width: 140
              }}
              onBlur={handleSave}
              autoFocus
            />
          ) : (
            <>
              {profile.name}
              <FaPen
                color="#FFD600"
                size={13}
                style={{ cursor: 'pointer' }}
                onClick={() => handleEdit('name')}
              />
            </>
          )}
        </div>
      </div>

      {/* Rating and Membership */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        margin: '12px 0 18px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaStar color="#FFD600" size={18} />
          <span style={{ fontWeight: 700, color: '#232b35', fontSize: 16 }}>
            {profile.rating}
          </span>
        </div>
        <div style={{ color: '#888', fontSize: 15, fontWeight: 600, borderLeft: '1.5px solid #eee', paddingLeft: 16 }}>
          Member
        </div>
      </div>

      {/* Profile Fields */}
      <div style={{
        maxWidth: 430,
        margin: '0 auto',
        padding: '0 0 40px 0'
      }}>
        <ProfileField
          label="Phone No"
          icon={<FaPhoneAlt style={{ color: '#FFD600', marginRight: 10 }} />}
          name="phone"
          value={profile.phone}
          editField={editField}
          onEdit={handleEdit}
          onChange={handleChange}
          onBlur={handleSave}
        />
        <ProfileField
          label="Address"
          icon={<FaMapMarkerAlt style={{ color: '#FFD600', marginRight: 10 }} />}
          name="address"
          value={profile.address}
          editField={editField}
          onEdit={handleEdit}
          onChange={handleChange}
          onBlur={handleSave}
        />
        <ProfileField
          label="Email"
          icon={<FaEnvelope style={{ color: '#FFD600', marginRight: 10 }} />}
          name="email"
          value={profile.email}
          editField={editField}
          onEdit={handleEdit}
          onChange={handleChange}
          onBlur={handleSave}
        />
        <ProfileField
          label="Gender"
          icon={<FaVenusMars style={{ color: '#FFD600', marginRight: 10 }} />}
          name="gender"
          value={profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "N/A"}
          editField={editField}
          onEdit={handleEdit}
          onChange={handleChange}
          onBlur={handleSave}
        />
        <ProfileField
          label="Date of Birth"
          icon={<FaCalendar style={{ color: '#FFD600', marginRight: 10 }} />}
          name="dateOfBirth"
          value={profile.dateOfBirth || "N/A"}
          editField={editField}
          onEdit={handleEdit}
          onChange={handleChange}
          onBlur={handleSave}
        />

        <button
          style={{
            width: '100%',
            background: '#FFD600',
            border: 'none',
            borderRadius: 18, // smaller radius
            padding: '10px 0', // less padding
            fontWeight: 700,
            fontSize: 15, // smaller font
            color: '#232b35',
            marginTop: 18, // less margin
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}
        >
          SAVE CHANGES
        </button>
      </div>
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

function ProfileField({ label, icon, name, value, editField, onEdit, onChange, onBlur, editable = true }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14, // slightly smaller
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      padding: '10px 14px', // less padding
      marginBottom: 12, // less margin
      display: 'flex',
      alignItems: 'center',
      fontSize: 15, // slightly smaller font
      position: 'relative'
    }}>
      {icon}
      <div style={{ flex: 1 }}>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 2 }}>{label}</div>
        {editField === name && editable ? (
          <input
            name={name}
            value={value}
            onChange={onChange}
            style={{
              fontWeight: 600,
              fontSize: 15,
              color: '#232b35',
              border: 'none',
              borderBottom: '1.5px solid #FFD600',
              background: 'transparent',
              outline: 'none',
              width: '100%'
            }}
            onBlur={onBlur}
            autoFocus
          />
        ) : (
          <span style={{ fontWeight: 600, color: '#232b35' }}>{value}</span>
        )}
      </div>
      {editable && (
        <FaPen
          color="#FFD600"
          size={12}
          style={{ cursor: 'pointer', marginLeft: 8 }}
          onClick={() => onEdit(name)}
        />
      )}
    </div>
  );
}