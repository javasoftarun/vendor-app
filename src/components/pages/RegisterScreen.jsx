import React, { useState } from 'react';
import API_ENDPOINTS from '../config/apiConfig';
import sha1 from "sha1";

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
    const [popup, setPopup] = useState({ open: false, success: false, message: '' });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            // Encrypt password using SHA-1 before sending
            const encryptedForm = { ...form, password: sha1(form.password) };
            const response = await fetch(API_ENDPOINTS.ADD_USER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(encryptedForm)
            });
            const data = await response.json();
            if (data && (data.responseCode === 0 || data.responseCode === 200) && data.responseMessage === 'success') {
                setPopup({
                    open: true,
                    success: true,
                    message: 'Registration successful!'
                });
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

    const handleLoginClick = () => {
        window.location.href = '/login';
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                minWidth: '100vw',
                height: '100vh',
                width: '100vw',
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Montserrat, Arial, sans-serif',
                overflowX: 'hidden', // Prevent horizontal scrolling
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: 480,
                    minHeight: 420,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 6px 32px rgba(44,62,80,0.10)',
                    padding: '40px 32px 32px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    overflowX: 'hidden', // Prevent horizontal scrolling in content
                }}
            >
                {/* Logo and App Name - exactly like LoginScreen */}
                <div style={{
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <div style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #FFD600 0%, #232b35 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 16px #FFD60044"
                    }}>
                        <img
                            src="https://img.icons8.com/color/96/taxi.png"
                            alt="Bhada24 Logo"
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                objectFit: "cover",
                                background: "#fff",
                                border: "3px solid #fff",
                                boxShadow: "0 1px 8px #FFD60033"
                            }}
                        />
                    </div>
                    <span style={{
                        marginTop: 10,
                        fontWeight: 800,
                        fontSize: 26,
                        color: "#232b35",
                        letterSpacing: 1.2,
                        fontFamily: "Montserrat, Arial, sans-serif"
                    }}>
                        Bhada24
                    </span>
                </div>
                <h2 style={{
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 24,
                    color: "#232b35",
                    letterSpacing: 0.5
                }}>Sign Up</h2>

                <form
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: 400,
                        padding: '0px 18px 24px 18px',
                        marginTop: 18
                    }}
                    onSubmit={handleSubmit}
                >
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
                            width: "100%",
                            padding: "13px 0",
                            borderRadius: 9,
                            border: "none",
                            background: "#232b35",
                            color: "#FFD600",
                            fontWeight: 700,
                            fontSize: 17,
                            cursor: "pointer",
                            marginBottom: 8,
                            letterSpacing: 1
                        }}
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                {/* Login link */}
                <div style={{
                    width: "100%",
                    marginTop: 18,
                    textAlign: "center"
                }}>
                    <span style={{ color: "#232b35", fontSize: 15 }}>
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={handleLoginClick}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#FFD600",
                                fontWeight: 700,
                                textDecoration: "none",
                                letterSpacing: 0.5,
                                borderBottom: "2px solid #FFD600",
                                paddingBottom: 2,
                                cursor: "pointer",
                                transition: "border 0.2s"
                            }}
                        >
                            Login
                        </button>
                    </span>
                </div>
            </div>
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