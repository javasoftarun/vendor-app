import React, { useState } from 'react';
import { FaArrowLeft, FaPen, FaStar, FaPhoneAlt, FaEnvelope, FaVenusMars, FaCalendar } from 'react-icons/fa';
import { MdPhotoCamera } from 'react-icons/md'; // Professional camera icon
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

  // --- MOBILE-FRIENDLY, FIXED AVATAR, CARD WIDTH, NO YELLOW BORDER, BLACK BACK ARROW ---
  return (
    <div style={{
      background: '#f6f7f9',
      minHeight: '100vh',
      fontFamily: 'inherit',
      paddingBottom: 60,
      width: '100vw',
      maxWidth: '100vw',
      margin: 0,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        height: 54,
        width: '100vw',
        maxWidth: 480,
        margin: '0 auto',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 6px rgba(44,62,80,0.04)'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            marginLeft: 10,
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <FaArrowLeft size={20} color="#232b35" />
        </button>
        <div style={{
          flex: 1,
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 18,
          color: '#232b35',
          letterSpacing: 0.2
        }}>
          Profile
        </div>
        <button
          onClick={handleEdit}
          style={{
            background: 'none',
            border: 'none',
            marginRight: 10,
            cursor: editMode ? 'not-allowed' : 'pointer',
            opacity: editMode ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center'
          }}
          disabled={editMode}
          title="Edit Profile"
        >
          <FaPen size={16} color="#FFD600" />
        </button>
      </div>

      {/* Avatar Card */}
      <div style={{
        width: '100vw',
        maxWidth: 380,
        margin: '0 auto',
        marginTop: 50,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
        padding: '38px 0 18px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Centered avatar, overlapping the card */}
        <div style={{
          position: 'absolute',
          top: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #FFD600',
            background: '#fffbe6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 28,
            color: '#232b35',
            boxShadow: '0 2px 8px #FFD60022',
            position: 'relative'
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
            {editMode && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                  title="Change profile photo"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => {
                        setProfile(prev => ({ ...prev, image: ev.target.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: 2,
                  bottom: 2,
                  background: '#fff',
                  borderRadius: '50%',
                  padding: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(44,62,80,0.10)',
                  border: '1.5px solid #FFD600'
                }}>
                  <MdPhotoCamera size={20} color="#FFD600" />
                </div>
              </>
            )}
          </div>
        </div>
        {/* Add top padding to push content below avatar */}
        <div style={{ height: 40 }} />
        <div style={{
          fontWeight: 700,
          fontSize: 18,
          color: '#232b35',
          marginBottom: 2,
          textAlign: 'center',
          width: "100%",
          wordBreak: "break-word"
        }}>
          {editMode ? (
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: '#232b35',
                border: 'none',
                borderBottom: '1.5px solid #FFD600',
                background: 'transparent',
                outline: 'none',
                width: "90%",
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
          gap: 6,
          marginBottom: 2,
          marginTop: 2,
          justifyContent: 'center'
        }}>
          <FaStar color="#FFD600" size={15} />
          <span style={{ fontWeight: 600, color: '#232b35', fontSize: 14 }}>
            {profile.rating}
          </span>
        </div>
      </div>

      {/* Profile Details */}
      <form
        onSubmit={handleSave}
        style={{
          width: '100vw',
          maxWidth: 380,
          margin: '14px auto 0 auto',
          padding: '0 0 40px 0'
        }}
      >
        <ProfileRow
          label="Phone"
          icon={<FaPhoneAlt style={{ color: '#FFD600', marginRight: 8 }} />}
          name="phone"
          value={profile.phone}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileRow
          label="Email"
          icon={<FaEnvelope style={{ color: '#FFD600', marginRight: 8 }} />}
          name="email"
          value={profile.email}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileRow
          label="Gender"
          icon={<FaVenusMars style={{ color: '#FFD600', marginRight: 8 }} />}
          name="gender"
          value={profile.gender}
          editMode={editMode}
          onChange={handleChange}
        />
        <ProfileRow
          label="Date of Birth"
          icon={<FaCalendar style={{ color: '#FFD600', marginRight: 8 }} />}
          name="dateOfBirth"
          value={profile.dateOfBirth}
          editMode={editMode}
          onChange={handleChange}
        />

        {successMsg && (
          <div style={{ color: "#27ae60", fontWeight: 500, margin: "10px 0 0 0", textAlign: "center" }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ color: "#d32f2f", fontWeight: 500, margin: "10px 0 0 0", textAlign: "center" }}>
            {errorMsg}
          </div>
        )}

        {editMode && (
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                background: '#FFD600',
                border: 'none',
                borderRadius: 7,
                padding: '10px 0',
                fontWeight: 600,
                fontSize: 15,
                color: '#232b35',
                cursor: saving ? 'not-allowed' : 'pointer'
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
                background: '#fff',
                border: '1.5px solid #FFD600',
                borderRadius: 7,
                padding: '10px 0',
                fontWeight: 600,
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
      <div style={{
        width: "100vw",
        position: "fixed",
        left: 0,
        bottom: 0,
        zIndex: 100
      }}>
        <BottomNav />
      </div>
    </div>
  );
}

function ProfileRow({ label, icon, name, value, editMode, onChange }) {
  // Gender options
  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <div style={{
      background: '#fff',
      borderRadius: 10,
      boxShadow: '0 1px 4px rgba(44,62,80,0.03)',
      padding: '8px 0 8px 0',
      marginBottom: 14,
      display: 'flex',
      alignItems: 'flex-start',
      fontSize: 15,
      border: 'none',
      width: '100%',
      maxWidth: 380,
      marginLeft: 'auto',
      marginRight: 'auto',
      minHeight: 44
    }}>
      <div style={{ width: 38, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
        {icon}
      </div>
      <div style={{ flex: 1, marginLeft: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 2 }}>{label}</div>
        {editMode ? (
          name === "gender" ? (
            <select
              name={name}
              value={value}
              onChange={onChange}
              style={{
                fontWeight: 500,
                fontSize: 15,
                color: value ? '#232b35' : '#bbb',
                border: 'none',
                borderBottom: '1.5px solid #FFD600',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                padding: '2px 0 4px 0'
              }}
            >
              {genderOptions.map(opt => (
                <option key={opt.value} value={opt.value} style={{ color: "#232b35" }}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : name === "dateOfBirth" ? (
            <input
              type="date"
              name={name}
              value={value}
              onChange={onChange}
              style={{
                fontWeight: 500,
                fontSize: 15,
                color: '#232b35',
                border: 'none',
                borderBottom: '1.5px solid #FFD600',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                padding: '2px 0 4px 0'
              }}
              max={new Date().toISOString().split('T')[0]}
            />
          ) : (
            <input
              name={name}
              value={value}
              onChange={onChange}
              style={{
                fontWeight: 500,
                fontSize: 15,
                color: '#232b35',
                border: 'none',
                borderBottom: '1.5px solid #FFD600',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                padding: '2px 0 4px 0'
              }}
              autoComplete="off"
            />
          )
        ) : (
          <span style={{ fontWeight: 500, color: '#232b35', lineHeight: 1.6 }}>
            {value || <span style={{ color: "#bbb" }}>Not set</span>}
          </span>
        )}
      </div>
    </div>
  );
}