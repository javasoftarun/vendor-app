import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sha1 from "sha1";
import { FaPhoneAlt, FaUserAlt, FaLock } from "react-icons/fa";
import API_ENDPOINTS from "../config/apiConfig";
import { isAuthenticated } from "../utils/auth";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("mobile");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Simulate API call for sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      setOtpSent(true);
      setMessage("OTP sent! Please check your phone.");
      setLoading(false);
    }, 1000);
  };

  // Simulate API call for verifying OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      if (otp === "123456") {
        setMessage("Login successful!");
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
      setLoading(false);
    }, 1000);
  };

  // Simulate API call for username/password login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const encryptedPassword = sha1(password);
      const response = await fetch(API_ENDPOINTS.LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: encryptedPassword,
        }),
      });
      const data = await response.json();
      if (
        response.ok &&
        data.responseCode === 200 &&
        data.responseData &&
        data.responseData.length > 0
      ) {
        localStorage.setItem("user", JSON.stringify(data.responseData[0]));
        navigate("/dashboard");
      } else {
        setMessage(data.responseMessage || "Invalid username or password.");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    }
    setLoading(false);
  };

  // Common input wrapper style
  const inputWrapperStyle = {
    display: "flex",
    alignItems: "center",
    background: "#f7f8fa",
    borderRadius: 9,
    border: "1.2px solid #e0e3e7",
    padding: "10px 14px",
    marginBottom: 18,
    fontSize: 16,
    boxSizing: "border-box",
    boxShadow: "0 2px 8px rgba(44,62,80,0.06)",
    width: "100%",
  };

  const handleSignUpClick = () => {
    window.location.href = '/register';
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        height: "100vh",
        width: "100vw",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Montserrat, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          minHeight: 420,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 6px 32px rgba(44,62,80,0.10)",
          padding: "40px 32px 32px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Logo and App Name */}
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
            {/* Replace with your logo if you have one */}
            <img
              src="https://img.icons8.com/ios-filled/100/232b35/taxi.png"
              alt="Bhada24 Logo"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                objectFit: "cover",
                background: "#fff"
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
          marginBottom: 24,
          fontWeight: 700,
          fontSize: 24,
          color: "#232b35",
          letterSpacing: 0.5
        }}>Login</h2>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginBottom: 24,
          width: "100%"
        }}>
          <button
            type="button"
            onClick={() => { setMode("mobile"); setMessage(""); setOtpSent(false); }}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 9,
              border: mode === "mobile" ? "2px solid #FFD600" : "1.2px solid #e0e3e7",
              background: mode === "mobile" ? "#FFFBE6" : "#fff",
              color: "#232b35",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              transition: "border 0.2s, background 0.2s"
            }}
          >
            Mobile OTP
          </button>
          <button
            type="button"
            onClick={() => { setMode("password"); setMessage(""); }}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 9,
              border: mode === "password" ? "2px solid #FFD600" : "1.2px solid #e0e3e7",
              background: mode === "password" ? "#FFFBE6" : "#fff",
              color: "#232b35",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              transition: "border 0.2s, background 0.2s"
            }}
          >
            Username &amp; Password
          </button>
        </div>

        {/* Mobile OTP Login */}
        {mode === "mobile" && (
          !otpSent ? (
            <form onSubmit={handleSendOtp} style={{ width: "100%" }}>
              <div style={inputWrapperStyle}>
                <FaPhoneAlt style={{ color: "#bbb", marginRight: 10, fontSize: 16 }} />
                <input
                  type="tel"
                  placeholder="Enter Your Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 16,
                    flex: 1,
                  }}
                  maxLength={10}
                  inputMode="numeric"
                />
              </div>
              <button type="submit" style={{
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
              }} disabled={loading}>
                {loading ? "Sending OTP..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ width: "100%" }}>
              <div style={inputWrapperStyle}>
                <span style={{ color: "#bbb", marginRight: 10, fontSize: 16 }}>🔑</span>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 16,
                    flex: 1,
                  }}
                  maxLength={6}
                  inputMode="numeric"
                />
              </div>
              <button type="submit" style={{
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
              }} disabled={loading}>
                {loading ? "Verifying..." : "Login"}
              </button>
            </form>
          )
        )}

        {/* Username/Password Login */}
        {mode === "password" && (
          <form onSubmit={handlePasswordLogin} style={{ width: "100%" }}>
            <div style={inputWrapperStyle}>
              <FaUserAlt style={{ color: "#bbb", marginRight: 10, fontSize: 16 }} />
              <input
                type="text"
                placeholder="Enter Your Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 16,
                  flex: 1,
                }}
              />
            </div>
            <div style={{ ...inputWrapperStyle, marginBottom: 0, position: "relative" }}>
              <FaLock style={{ color: "#bbb", marginRight: 10, fontSize: 16 }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 16,
                  flex: 1,
                }}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  marginLeft: 10,
                  cursor: "pointer",
                  color: "#bbb",
                  fontSize: 18,
                  userSelect: "none"
                }}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            {/* Forgot password link */}
            <div style={{ width: "100%", textAlign: "right", margin: "4px 0 12px 0" }}>
              <a
                href="#"
                style={{
                  color: "#232b35",
                  fontSize: 14,
                  textDecoration: "underline",
                  fontWeight: 500,
                  letterSpacing: 0.2
                }}
              >
                Forgot password?
              </a>
            </div>
            <button type="submit" style={{
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
            }} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {message && (
          <div style={{
            marginTop: 10,
            color: message.includes("success") ? "#52c41a" : "#ff4d4f",
            fontWeight: 600,
            fontSize: 15,
            textAlign: "center"
          }}>
            {message}
          </div>
        )}

        {/* Sign up link */}
        <div style={{
          width: "100%",
          marginTop: 18,
          textAlign: "center"
        }}>
          <span style={{ color: "#232b35", fontSize: 15 }}>
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={handleSignUpClick} 
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
              Sign Up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}