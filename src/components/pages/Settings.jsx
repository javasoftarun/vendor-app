import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import BottomNav from "../common/BottomNav";

export default function Settings() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notificationEnabled, setNotificationEnabled] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Dummy handlers for demonstration
    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (!password || !newPassword || !confirmPassword) {
            alert("Please fill all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }
        // TODO: Call API to update password
        alert("Password updated successfully!");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleDeleteAccount = () => {
        // TODO: Call API to delete account
        alert("Account deleted.");
        setShowDeleteConfirm(false);
    };

    const handleLogout = () => {
        // Clear all local storage and token
        localStorage.clear();
        sessionStorage.clear();
        // Optionally, remove cookies if you use them for auth
        // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Redirect to login page
        navigate("/login");
    };

    return (
        <div style={{ background: "#f7f7f7", minHeight: "100vh", fontFamily: "inherit" }}>
            {/* Header with Back Arrow */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px 18px 0 18px",
                    gap: 12,
                    background: "#f7f7f7"
                }}
            >
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#eee",
                        cursor: "pointer",
                        marginRight: 0
                    }}
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft size={22} color="#232b35" />
                </span>
                <div style={{ flex: 1, fontWeight: 700, fontSize: 20, color: "#232b35" }}>
                    Settings
                </div>
            </div>

            <div style={{ maxWidth: 420, margin: "0 auto", padding: 24, background: "#fff", minHeight: "calc(100vh - 72px)" }}>
                {/* Enable Notification */}
                <div style={{ marginBottom: 28 }}>
                    <label style={{ fontWeight: 600, fontSize: 16, color: "#232b35" }}>
                        <input
                            type="checkbox"
                            checked={notificationEnabled}
                            onChange={() => setNotificationEnabled((v) => !v)}
                            style={{ marginRight: 10 }}
                        />
                        Enable Notifications
                    </label>
                </div>

                {/* Update Password */}
                <form onSubmit={handlePasswordUpdate} style={{ marginBottom: 32 }}>
                    <div style={{ fontWeight: 600, fontSize: 16, color: "#232b35", marginBottom: 10 }}>
                        Update Password
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Current Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: 10,
                            borderRadius: 6,
                            border: "1px solid #ccc",
                            fontSize: 15
                        }}
                    />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: 10,
                            borderRadius: 6,
                            border: "1px solid #ccc",
                            fontSize: 15
                        }}
                    />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: 10,
                            borderRadius: 6,
                            border: "1px solid #ccc",
                            fontSize: 15
                        }}
                    />
                    <label style={{ fontSize: 14, color: "#555", marginBottom: 12, display: "block" }}>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(v => !v)}
                            style={{ marginRight: 6 }}
                        />
                        Show Passwords
                    </label>
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            background: "#FFD600",
                            color: "#232b35",
                            border: "none",
                            borderRadius: 8,
                            padding: "10px 0",
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: "pointer",
                            marginTop: 6
                        }}
                    >
                        Update Password
                    </button>
                </form>

                {/* Delete Account */}
                <div style={{ marginBottom: 32 }}>
                    <button
                        style={{
                            width: "100%",
                            background: "#fff",
                            color: "#d32f2f",
                            border: "1.5px solid #d32f2f",
                            borderRadius: 8,
                            padding: "10px 0",
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: "pointer"
                        }}
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        Delete Account
                    </button>
                </div>

                {/* Logout */}
                <div>
                    <button
                        style={{
                            width: "100%",
                            background: "#232b35",
                            color: "#FFD600",
                            border: "none",
                            borderRadius: 8,
                            padding: "10px 0",
                            fontWeight: 700,
                            fontSize: 16,
                            cursor: "pointer"
                        }}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Popup */}
            {showDeleteConfirm && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.18)",
                    zIndex: 2000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 10,
                            padding: 24,
                            minWidth: 240,
                            maxWidth: 340,
                            width: "90%",
                            textAlign: "center",
                            boxShadow: "0 4px 24px rgba(44,62,80,0.10)"
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: "#232b35" }}>
                            Delete Account
                        </div>
                        <div style={{ color: "#b71c1c", fontSize: 15, marginBottom: 18 }}>
                            Are you sure you want to delete your account? This action cannot be undone.
                        </div>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <button
                                style={{
                                    flex: 1,
                                    background: "#d32f2f",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "9px 0",
                                    fontWeight: 600,
                                    fontSize: 15,
                                    cursor: "pointer"
                                }}
                                onClick={handleDeleteAccount}
                            >
                                Yes, Delete
                            </button>
                            <button
                                style={{
                                    flex: 1,
                                    background: "#fff",
                                    color: "#232b35",
                                    border: "1px solid #bbb",
                                    borderRadius: 6,
                                    padding: "9px 0",
                                    fontWeight: 600,
                                    fontSize: 15,
                                    cursor: "pointer"
                                }}
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}