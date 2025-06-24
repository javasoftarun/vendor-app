import React, { useState } from 'react';
import { FaArrowLeft, FaPen, FaStar, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaVenusMars, FaCalendar } from 'react-icons/fa';
import BottomNav from '../common/BottomNav';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const [profile, setProfile] = useState({
    name: user.name || '',
    phone: user.phone || '',
    address: user.address || '',
    email: user.email || '',
    gender: user.gender || '',
    dateOfBirth: user.dateOfBirth || '',
    rating: user.rating || 4.7,
    image: user.imageUrl && user.imageUrl !== "null" ? user.imageUrl : ""
  });

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);

  const handleSave = async (e) => {
    e && e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      // Replace with your actual API endpoint for updating profile
      localStorage.setItem("user", JSON.stringify({ ...user, ...profile }));
      setSuccessMsg("Profile updated successfully!");
      setEditMode(false);
    } catch {
      setErrorMsg("Failed to update profile. Please try again.");
    }
    setSaving(false);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleCancel = () => {
    setProfile({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      email: user.email || '',
      gender: user.gender || '',
      dateOfBirth: user.dateOfBirth || '',
      rating: user.rating || 4.7,
      image: user.imageUrl && user.imageUrl !== "null" ? user.imageUrl : ""
    });
    setEditMode(false);
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <div style={{ background: '#f5f6fa', minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '18px 0 0 0',
        background: '#fff',
        borderBottom: '1px solid #ececec',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            marginLeft: 18,
            cursor: 'pointer',
            padding: 0
          }}
        >
          <FaArrowLeft size={22} color="#232b35" />
        </button>
        <div style={{
          flex: 1,
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 20,
          color: '#232b35',
          letterSpacing: 0.2
        }}>
          My Profile
        </div>
        <button
          onClick={handleEdit}
          style={{
            background: 'none',
            border: 'none',
            marginRight: 18,
            cursor: editMode ? 'not-allowed' : 'pointer',
            opacity: editMode ? 0.5 : 1
          }}
          disabled={editMode}
          title="Edit Profile"
        >
          <FaPen size={17} color="#FFD600" />
        </button>
      </div>

      {/* Profile Card */}
      <div style={{
        maxWidth: 420,
        margin: '0 auto',
        marginTop: 24,
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        padding: '32px 24px 18px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: 92,
          height: 92,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid #FFD600',
          marginBottom: 12,
          background: '#f7f7f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 34,
          color: '#232b35'
        }}>
          {profile.image ? (
            <img
              src={profile.image}
              alt="User"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={e => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&background=FFD600&color=232b35&rounded=true`;
              }}
            />
          ) : (
            <span>
              {getInitials(profile.name)}
            </span>
          )}
        </div>
        <div style={{
          fontWeight: 700,
          fontSize: 22,
          color: '#232b35',
          marginBottom: 2,
          textAlign: 'center'
        }}>
          {editMode ? (
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              style={{
                fontWeight: 700,
                fontSize: 22,
                color: '#232b35',
                border: 'none',
                borderBottom: '1.5px solid #FFD600',
                background: 'transparent',
                outline: 'none',
                width: 180,
                textAlign: 'center'
              }}
              autoFocus
            />
          ) : (
            profile.name || <span style={{ color: "#bbb" }}>Your Name</span>
          )}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8
        }}>
          <FaStar color="#FFD600" size={16} />
          <span style={{ fontWeight: 600, color: '#232b35', fontSize: 15 }}>
            {profile.rating}
          </span>
        </div>
        <div style={{
          color: '#888',
          fontSize: 14,
          marginBottom: 10
        }}>
          Member
        </div>
      </div>

      {/* Profile Details */}
      <form
        onSubmit={handleSave}
        style={{
          maxWidth: 420,
          margin: '18px auto 0 auto',
          padding: '0 0 40px 0'
        }}
      >
        <ProfileRow
          label="Phone"
          icon={<FaPhoneAlt style={{ color: '#FFD600', marginRight: 10 }} />}
          name="phone"
          value={profile.phone}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileRow
          label="Address"
          icon={<FaMapMarkerAlt style={{ color: '#FFD600', marginRight: 10 }} />}
          name="address"
          value={profile.address}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileRow
          label="Email"
          icon={<FaEnvelope style={{ color: '#FFD600', marginRight: 10 }} />}
          name="email"
          value={profile.email}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileRow
          label="Gender"
          icon={<FaVenusMars style={{ color: '#FFD600', marginRight: 10 }} />}
          name="gender"
          value={profile.gender}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileRow
          label="Date of Birth"
          icon={<FaCalendar style={{ color: '#FFD600', marginRight: 10 }} />}
          name="dateOfBirth"
          value={profile.dateOfBirth}
          editMode={editMode}
          onChange={handleChange}
        />

        {successMsg && (
          <div style={{ color: "#27ae60", fontWeight: 600, margin: "10px 0 0 0", textAlign: "center" }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ color: "#d32f2f", fontWeight: 600, margin: "10px 0 0 0", textAlign: "center" }}>
            {errorMsg}
          </div>
        )}

        {editMode && (
          <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                background: '#FFD600',
                border: 'none',
                borderRadius: 18,
                padding: '10px 0',
                fontWeight: 700,
                fontSize: 15,
                color: '#232b35',
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
              }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              style={{
                flex: 1,
                background: '#f7f7f7',
                border: '1.5px solid #FFD600',
                borderRadius: 18,
                padding: '10px 0',
                fontWeight: 700,
                fontSize: 15,
                color: '#232b35',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
      <BottomNav />
    </div>
  );
}

function ProfileRow({ label, icon, name, value, editMode, onChange }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      padding: '13px 16px',
      marginBottom: 13,
      display: 'flex',
      alignItems: 'center',
      fontSize: 15,
      border: '1px solid #f0f0f0'
    }}>
      {icon}
      <div style={{ flex: 1 }}>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 2 }}>{label}</div>
        {editMode ? (
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
            autoComplete="off"
          />
        ) : (
          <span style={{ fontWeight: 600, color: '#232b35' }}>{value || <span style={{ color: "#bbb" }}>Not set</span>}</span>
        )}
      </div>
    </div>
  );
}