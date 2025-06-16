import React, { useState } from 'react';
import ImageUpload from '../common/ImageUpload';
import API_ENDPOINTS from '../config/apiConfig';

export default function RegisterScreen() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user',
        gender: '',
        dateOfBirth: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [popup, setPopup] = useState({ open: false, success: false, message: '' });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageUploaded = (url) => {
        setForm(prev => ({
            ...prev,
            imageUrl: url
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.ADD_USER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            if (data && (data.responseCode === 0 || data.responseCode === 200) && data.responseMessage === 'success') {
                setPopup({
                    open: true,
                    success: true,
                    message: 'Registration successful!'
                });
                if (data.responseData && (data.responseData.id || typeof data.responseData === 'string')) {
                    setUserId(data.responseData.id || data.responseData);
                }
            } else {
                setPopup({
                    open: true,
                    success: false,
                    message: data.responseMessage || 'Registration failed'
                });
            }
        } catch (err) {
            setPopup({
                open: true,
                success: false,
                message: 'Registration failed'
            });
        }
        setLoading(false);
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100vw',
                background: '#f7f8fa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                boxSizing: 'border-box'
            }}
        >
            <form
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: 400,
                    padding: '32px 18px 24px 18px',
                    marginTop: 18
                }}
                onSubmit={handleSubmit}
            >
                <ImageUpload
                    userId={form.email || form.phone || ''}
                    onUploaded={handleImageUploaded}
                    initialUrl={form.imageUrl}
                />
                <h2 style={{
                    fontWeight: 700,
                    fontSize: 22,
                    color: '#232b35',
                    marginBottom: 18,
                    letterSpacing: 0.2
                }}>
                    Register
                </h2>

                <Input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    maxLength={15}
                    inputMode="tel"
                />
                {/* Role is hardcoded and hidden */}
                <input type="hidden" name="role" value={form.role} />
                <Select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>
                        Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </Select>
                <Input
                    type="date"
                    name="dateOfBirth"
                    placeholder="Date of Birth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    required
                />
                <button
                    type="submit"
                    style={{
                        background: 'linear-gradient(90deg, #232b35 0%, #495057 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 9,
                        padding: '13px 0',
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: 'pointer',
                        width: '100%',
                        marginTop: 10,
                        boxShadow: '0 2px 12px rgba(44,62,80,0.10)',
                        transition: 'background 0.2s'
                    }}
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <div style={{ marginTop: 18, width: '100%', textAlign: 'center' }}>
                    <span style={{ fontSize: 15, color: '#495057' }}>
                        Already have an account?{' '}
                        <a
                            href="/login"
                            style={{
                                color: '#FFD600',
                                fontWeight: 700,
                                textDecoration: 'none',
                                marginLeft: 4
                            }}
                        >
                            Login
                        </a>
                    </span>
                </div>
            </form>
            <ResultPopup
                open={popup.open}
                success={popup.success}
                message={popup.message}
                onClose={() => setPopup({ ...popup, open: false })}
                onLogin={() => window.location.href = '/login'}
            />
        </div>
    );
}

function Input(props) {
    return (
        <input
            {...props}
            style={{
                width: '100%',
                padding: '11px 13px',
                borderRadius: 7,
                border: '1.2px solid #e0e3e7',
                fontSize: 15.5,
                color: '#232b35',
                background: '#fff',
                outline: 'none',
                fontWeight: 500,
                marginBottom: 15,
                boxSizing: 'border-box',
                ...(props.style || {})
            }}
        />
    );
}

function Select(props) {
    return (
        <select
            {...props}
            style={{
                width: '100%',
                padding: '11px 13px',
                borderRadius: 7,
                border: '1.2px solid #e0e3e7',
                fontSize: 15.5,
                color: props.value ? '#232b35' : '#888',
                background: '#fff',
                outline: 'none',
                fontWeight: 500,
                marginBottom: 15,
                boxSizing: 'border-box',
                ...(props.style || {})
            }}
        >
            {props.children}
        </select>
    );
}

function ResultPopup({ open, success, message, onClose, onLogin }) {
    if (!open) return null;
    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: '#fff',
                borderRadius: 18,
                boxShadow: '0 4px 32px rgba(44,62,80,0.13)',
                padding: '32px 28px 24px 28px',
                minWidth: 320,
                maxWidth: '90vw',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{
                    fontSize: 38,
                    marginBottom: 12,
                    color: success ? '#FFD600' : '#ff4d4f'
                }}>
                    {success ? '🎉' : '⚠️'}
                </div>
                <div style={{
                    fontWeight: 700,
                    fontSize: 20,
                    color: success ? '#232b35' : '#ff4d4f',
                    marginBottom: 10
                }}>
                    {success ? 'Registration Successful' : 'Registration Failed'}
                </div>
                <div style={{
                    color: '#495057',
                    fontSize: 15,
                    marginBottom: 22
                }}>
                    {message}
                </div>
                {success ? (
                    <button
                        onClick={onLogin}
                        style={{
                            background: 'linear-gradient(90deg, #FFD600 60%, #FFEA70 100%)',
                            color: '#232b35',
                            border: 'none',
                            borderRadius: 9,
                            padding: '11px 0',
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: 'pointer',
                            width: 180,
                            marginBottom: 8,
                            boxShadow: '0 2px 12px rgba(255,214,0,0.10)',
                            transition: 'background 0.2s'
                        }}
                    >
                        Go to Login
                    </button>
                ) : null}
                <button
                    onClick={onClose}
                    style={{
                        background: '#f7f8fa',
                        color: '#232b35',
                        border: '1.2px solid #e0e3e7',
                        borderRadius: 9,
                        padding: '10px 0',
                        fontWeight: 500,
                        fontSize: 15,
                        cursor: 'pointer',
                        width: 180
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
}