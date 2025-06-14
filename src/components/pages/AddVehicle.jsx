import React, { useState, useRef } from 'react';
import { FaArrowLeft, FaCarSide } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../common/BottomNav';

const initialState = {
  registrationId: '',
  ownerName: '',
  driverName: '',
  driverContact: '',
  driverLicense: '',
  address: '',
  latitude: '',
  longitude: '',
  perKmRate: '',
  baseFare: '',
  status: '',
  cab: {
    cabId: '',
    cabName: '',
    cabType: '',
    cabNumber: '',
    cabModel: '',
    cabColor: '',
    cabInsurance: '',
    cabCapacity: '',
    fluelType: '',
    cabImageUrl: '',
    cabCity: '',
    cabState: '',
    ac: false,
  }
};

export default function AddVehicle() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [cabImage, setCabImage] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e, parent = null) => {
    const { name, value, type, checked } = e.target;
    if (parent) {
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [name]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCabImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCabImage(reader.result);
        setForm(prev => ({
          ...prev,
          cab: {
            ...prev.cab,
            cabImageUrl: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert('Vehicle Added!\n' + JSON.stringify(form, null, 2));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f7f8fa',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'inherit',
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          background: '#fff',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          padding: '24px 0 16px 0',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          boxSizing: 'border-box'
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#232b35',
            fontSize: 22,
            position: 'absolute',
            left: 18,
            top: 22,
            cursor: 'pointer'
          }}
          aria-label="Back"
        >
          <FaArrowLeft />
        </button>
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 22,
            color: '#232b35',
            letterSpacing: 0.5
          }}
        >
          Add Vehicle
        </div>
      </div>

      {/* Main Layout */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          margin: '24px auto 0 auto',
          padding: '0 0 80px 0',
          boxSizing: 'border-box',
          overflowX: 'hidden'
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
            padding: 0,
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Card Header */}
          <div style={{
            background: '#f7f8fa',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: '24px 0 18px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
              boxShadow: '0 2px 8px rgba(255,214,0,0.10)'
            }}>
              <FaCarSide size={32} color="#FFD600" />
            </div>
            <div style={{
              fontWeight: 700,
              fontSize: 20,
              color: '#232b35',
              marginBottom: 2,
              letterSpacing: 0.2
            }}>
              Vehicle Registration
            </div>
            <div style={{
              color: '#888',
              fontSize: 15,
              textAlign: 'center'
            }}>
              Please fill all the details below to add your vehicle.
            </div>
          </div>

          {/* Form */}
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              padding: '18px 12px 0 12px',
              boxSizing: 'border-box'
            }}
            onSubmit={handleSubmit}
          >
            {/* Owner & Driver */}
            <SectionTitle>Owner & Driver</SectionTitle>
            <Input label="Owner Name" name="ownerName" value={form.ownerName} onChange={handleChange} required />
            <Input label="Driver Name" name="driverName" value={form.driverName} onChange={handleChange} required />
            <Input label="Driver Contact" name="driverContact" value={form.driverContact} onChange={handleChange} required />
            <Input label="Driver License" name="driverLicense" value={form.driverLicense} onChange={handleChange} required />
            <Input label="Address" name="address" value={form.address} onChange={handleChange} required />
            <input type="hidden" name="latitude" value={form.latitude} />
            <input type="hidden" name="longitude" value={form.longitude} />

            {/* Cab Image Upload */}
            <SectionTitle>Cab Image</SectionTitle>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 18
            }}>
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 16,
                  background: '#fffbe6',
                  border: '2px dashed #FFD600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginBottom: 10,
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'border 0.2s'
                }}
                onClick={() => fileInputRef.current.click()}
              >
                {cabImage ? (
                  <img
                    src={cabImage}
                    alt="Cab"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 16
                    }}
                  />
                ) : (
                  <span style={{ color: '#FFD600', fontWeight: 600, fontSize: 32 }}>+</span>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleCabImageChange}
                />
              </div>
              <span style={{ fontSize: 13, color: '#888' }}>
                Tap to upload cab image
              </span>
            </div>

            {/* Cab Details */}
            <SectionTitle>Cab Details</SectionTitle>
            <Input label="Cab Name" name="cabName" value={form.cab.cabName} onChange={e => handleChange(e, 'cab')} required />
            <Input label="Cab Type" name="cabType" value={form.cab.cabType} onChange={e => handleChange(e, 'cab')} required />
            <Input label="Cab Number" name="cabNumber" value={form.cab.cabNumber} onChange={e => handleChange(e, 'cab')} required />
            <Input label="Cab Model" name="cabModel" value={form.cab.cabModel} onChange={e => handleChange(e, 'cab')} required />
            <Input label="Cab Color" name="cabColor" value={form.cab.cabColor} onChange={e => handleChange(e, 'cab')} />
            <Input label="Cab Insurance" name="cabInsurance" value={form.cab.cabInsurance} onChange={e => handleChange(e, 'cab')} />
            <Input label="Cab Capacity" name="cabCapacity" value={form.cab.cabCapacity} onChange={e => handleChange(e, 'cab')} />
            <Input label="Fuel Type" name="fluelType" value={form.cab.fluelType} onChange={e => handleChange(e, 'cab')} />
            <Input label="Cab City" name="cabCity" value={form.cab.cabCity} onChange={e => handleChange(e, 'cab')} />
            <Input label="Cab State" name="cabState" value={form.cab.cabState} onChange={e => handleChange(e, 'cab')} />
            <label style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 15,
              color: '#232b35',
              margin: '10px 0 0 2px',
              background: '#f7f8fa',
              borderRadius: 8,
              padding: '8px 12px',
              fontWeight: 500,
              border: '1px solid #e9ecef'
            }}>
              <input
                type="checkbox"
                name="ac"
                checked={form.cab.ac}
                onChange={e => handleChange(e, 'cab')}
                style={{ marginRight: 8 }}
              />
              AC Available
            </label>

            {/* Fare Details */}
            <SectionTitle>Fare Details</SectionTitle>
            <Input label="Per Km Rate" name="perKmRate" value={form.perKmRate} onChange={handleChange} type="number" min={0} required />
            <Input label="Base Fare" name="baseFare" value={form.baseFare} onChange={handleChange} type="number" min={0} required />

            <div style={{ display: 'flex', justifyContent: 'center', margin: '28px 0 18px 0' }}>
              <button
                type="submit"
                style={navBtnStyle}
              >
                <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: 0.2 }}>Add Vehicle</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div style={{
        width: '100%',
        position: 'fixed',
        left: 0,
        bottom: 0,
        zIndex: 100,
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}>
        <BottomNav />
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontWeight: 700,
      fontSize: 15,
      color: '#232b35',
      margin: '20px 0 8px 0',
      background: '#fffbe6',
      borderRadius: 7,
      padding: '9px 12px',
      letterSpacing: 0.2,
      border: '1.2px solid #ffe066'
    }}>
      {children}
    </div>
  );
}

function Input({ label, style, ...props }) {
  return (
    <div style={{
      ...style,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginBottom: 12,
      boxSizing: 'border-box'
    }}>
      <label style={{ fontSize: 13.5, color: '#232b35', marginBottom: 4, fontWeight: 500 }}>
        {label}
      </label>
      <input
        {...props}
        style={{
          width: '100%',
          padding: '10px 11px',
          borderRadius: 7,
          border: '1.2px solid #e0e3e7',
          fontSize: 15,
          color: '#232b35',
          background: '#fff',
          outline: 'none',
          fontWeight: 500,
          transition: 'border 0.2s',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}

const navBtnStyle = {
  background: 'linear-gradient(90deg, #232b35 0%, #495057 100%)', // Professional dark gradient
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  padding: '18px 0',
  fontWeight: 700,
  fontSize: 18,
  cursor: 'pointer',
  width: '90%',
  boxShadow: '0 2px 12px rgba(44,62,80,0.10)',
  transition: 'background 0.2s'
};