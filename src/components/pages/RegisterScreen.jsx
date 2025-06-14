import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhoneAlt, FaMapMarkerAlt, FaBuilding, FaEnvelope, FaLock } from 'react-icons/fa';

export default function RegisterScreen() {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        company: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = () => {
        if (!form.name || !form.phone || !form.address || !form.email || !form.password || !form.confirmPassword) {
            alert('Please fill all required fields');
            return;
        }
        if (form.password !== form.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        alert('Registration successful!');
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                flex: 1,
                padding: 24,
                maxWidth: 400,
                margin: '0 auto',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: '#d32f2f',
                    margin: '10px 0',
                    textAlign: 'center'
                }}>REGISTER</div>
                <div style={inputGroupStyle}>
                    <FaUser style={iconStyle} />
                    <input
                        style={inputStyle}
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>
                <div style={inputGroupStyle}>
                    <FaPhoneAlt style={iconStyle} />
                    <input
                        style={inputStyle}
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        type="tel"
                        maxLength={10}
                    />
                </div>
                <div style={inputGroupStyle}>
                    <FaMapMarkerAlt style={iconStyle} />
                    <input
                        style={inputStyle}
                        name="address"
                        placeholder="Address"
                        value={form.address}
                        onChange={handleChange}
                    />
                </div>
                <div style={inputGroupStyle}>
                    <FaBuilding style={iconStyle} />
                    <input
                        style={inputStyle}
                        name="company"
                        placeholder="Company Name Optional"
                        value={form.company}
                        onChange={handleChange}
                    />
                </div>
                <div style={inputGroupStyle}>
                    <FaEnvelope style={iconStyle} />
                    <input
                        style={inputStyle}
                        name="email"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                    />
                </div>
                <div style={inputGroupStyle}>
                    <FaLock style={iconStyle} />
                    <input
                        style={inputStyle}
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        type="password"
                    />
                </div>
                <div style={inputGroupStyle}>
                    <FaLock style={iconStyle} />
                    <input
                        style={inputStyle}
                        name="confirmPassword"
                        placeholder="Password Again"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        type="password"
                    />
                </div>
                <button
                    style={{
                        width: '100%',
                        background: '#FFD600',
                        border: 'none',
                        borderRadius: 24,
                        padding: 16,
                        fontWeight: 'bold',
                        fontSize: 16,
                        color: '#d32f2f',
                        margin: '20px 0 8px 0',
                        cursor: 'pointer'
                    }}
                    onClick={handleRegister}
                >
                    REGISTER NOW
                </button>
                <div style={{ textAlign: 'center', color: '#888', marginTop: 8 }}>
                    Have An Account?{' '}
                    <span style={{ color: '#d32f2f', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/login')}>
                        Login
                    </span>
                </div>
            </div>
        </div>
    );
}

const inputGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #FFD600',
    borderRadius: 24,
    padding: '0 16px',
    marginBottom: 12,
    background: '#fff'
};
const iconStyle = {
    marginRight: 8,
    color: '#FFD600',
    fontSize: 18
};
const inputStyle = {
    flex: 1,
    padding: 16,
    border: 'none',
    outline: 'none',
    fontSize: 16,
    color: '#d32f2f',
    background: 'transparent'
};