import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBell, FaLock, FaSignOutAlt, FaTrashAlt } from "react-icons/fa";
import BottomNav from "../common/BottomNav";
import API_ENDPOINTS from "../config/apiConfig";
import axios from "axios";
import sha1 from "sha1";

export default function Settings() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notificationEnabled, setNotificationEnabled] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [passwordUpdateError, setPasswordUpdateError] = useState("");
    const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState("");
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordUpdateError("");
        setPasswordUpdateSuccess("");
        setUpdatingPassword(true);
        if (!password || !newPassword || !confirmPassword) {
            setPasswordUpdateError("All fields are required.");
            setShowPasswordPopup(true);
            setUpdatingPassword(false);
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordUpdateError("New passwords do not match.");
            setShowPasswordPopup(true);
            setUpdatingPassword(false);
            return;
        }
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const userId = user.userId || user.id || "";
            await axios.patch(API_ENDPOINTS.UPDATE_PASSWORD, {
                userId,
                oldPassword: sha1(password),
                newPassword: sha1(newPassword)
            });
            setPasswordUpdateSuccess("Password updated successfully.");
            setPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordPopup(true);
        } catch (err) {
            setPasswordUpdateError(
                err?.response?.data?.message ||
                "Failed to update password. Please try again."
            );
            setShowPasswordPopup(true);
        }
        setUpdatingPassword(false);
    };

    const handleDeleteAccount = async () => {
        setLoadingDelete(true);
        setDeleteError("");
        try {
            // 1. Get all bookings for this user
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const userId = user.userId || user.id || "";
            const bookingsRes = await axios.get(API_ENDPOINTS.GET_ALL_BOOKINGS_BY_VENDOR_ID(userId));
            const bookings = bookingsRes.data || [];

            // 2. If user has any bookings, block deletion
            if (bookings.length > 0) {
                setDeleteError("You cannot delete your account while you have any bookings associated with your account.");
                setLoadingDelete(false);
                return;
            }

            // 3. Delete user account
            await axios.delete(API_ENDPOINTS.DELETE_USER(userId));
            setDeleteSuccess(true);
            setTimeout(() => {
                localStorage.clear();
                sessionStorage.clear();
                navigate("/login");
            }, 1800);
        } catch (err) {
            setDeleteError(
                err?.response?.data?.message ||
                "Failed to delete account. Please try again."
            );
        }
        setLoadingDelete(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div style={{
            background: "#f7f7f7",
            minHeight: "100vh",
            fontFamily: "inherit",
            width: "100vw",
            minWidth: 0,
            boxSizing: "border-box"
        }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px 12px 0 12px",
                    gap: 12,
                    background: "#f7f7f7",
                    maxWidth: 480,
                    margin: "0 auto"
                }}
            >
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: "#eee",
                        cursor: "pointer",
                        marginRight: 0
                    }}
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft size={20} color="#232b35" />
                </span>
                <div style={{ flex: 1, fontWeight: 700, fontSize: 19, color: "#232b35" }}>
                    Settings
                </div>
            </div>

            <div style={{
                maxWidth: 480,
                margin: "18px auto 0 auto",
                padding: "0 0 80px 0",
                width: "100vw"
            }}>
                {/* Notification */}
                <div style={{
                    background: "#fff",
                    borderRadius: 8,
                    padding: "13px 14px",
                    margin: "0 10px 14px 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #eee"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <FaBell color="#FFD600" />
                        <span style={{ fontWeight: 500, fontSize: 15, color: "#232b35" }}>
                            Enable Notifications
                        </span>
                    </div>
                    <input
                        type="checkbox"
                        checked={notificationEnabled}
                        onChange={() => setNotificationEnabled(v => !v)}
                        style={{ width: 18, height: 18, accentColor: "#FFD600", cursor: "pointer" }}
                    />
                </div>

                {/* Update Password */}
                <form
                    onSubmit={handlePasswordUpdate}
                    style={{
                        background: "#fff",
                        borderRadius: 8,
                        padding: "13px 14px 8px 14px",
                        margin: "0 10px 14px 10px",
                        border: "1px solid #eee"
                    }}
                >
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontWeight: 600,
                        fontSize: 15,
                        color: "#232b35",
                        marginBottom: 8
                    }}>
                        <FaLock color="#FFD600" />
                        Update Password
                    </div>
                    {/* Current Password */}
                    <div style={{ position: "relative", marginBottom: 12 }}>
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Current Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 38px 10px 12px",
                                borderRadius: 6,
                                border: "1px solid #e5e5e5",
                                fontSize: 15,
                                background: "#fafbfc",
                                boxSizing: "border-box"
                            }}
                            autoComplete="current-password"
                        />
                        <span
                            onClick={() => setShowCurrentPassword(v => !v)}
                            style={{
                                position: "absolute",
                                right: 12,
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#bbb",
                                fontSize: 17,
                                userSelect: "none"
                            }}
                            title={showCurrentPassword ? "Hide Password" : "Show Password"}
                        >
                            {showCurrentPassword ? "🙈" : "👁️"}
                        </span>
                    </div>
                    {/* New Password */}
                    <div style={{ position: "relative", marginBottom: 12 }}>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 38px 10px 12px",
                                borderRadius: 6,
                                border: "1px solid #e5e5e5",
                                fontSize: 15,
                                background: "#fafbfc",
                                boxSizing: "border-box"
                            }}
                            autoComplete="new-password"
                        />
                        <span
                            onClick={() => setShowNewPassword(v => !v)}
                            style={{
                                position: "absolute",
                                right: 12,
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#bbb",
                                fontSize: 17,
                                userSelect: "none"
                            }}
                            title={showNewPassword ? "Hide Password" : "Show Password"}
                        >
                            {showNewPassword ? "🙈" : "👁️"}
                        </span>
                    </div>
                    {/* Confirm New Password */}
                    <div style={{ position: "relative", marginBottom: 12 }}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 38px 10px 12px",
                                borderRadius: 6,
                                border: "1px solid #e5e5e5",
                                fontSize: 15,
                                background: "#fafbfc",
                                boxSizing: "border-box"
                            }}
                            autoComplete="new-password"
                        />
                        <span
                            onClick={() => setShowConfirmPassword(v => !v)}
                            style={{
                                position: "absolute",
                                right: 12,
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#bbb",
                                fontSize: 17,
                                userSelect: "none"
                            }}
                            title={showConfirmPassword ? "Hide Password" : "Show Password"}
                        >
                            {showConfirmPassword ? "🙈" : "👁️"}
                        </span>
                    </div>
                    {passwordUpdateError && (
                        <div style={{
                            color: "#d32f2f",
                            background: "#fff0f0",
                            border: "1px solid #ffd6d6",
                            borderRadius: 5,
                            padding: "8px 10px",
                            marginBottom: 10,
                            fontSize: 14
                        }}>
                            {passwordUpdateError}
                        </div>
                    )}
                    {passwordUpdateSuccess && (
                        <div style={{
                            color: "#388e3c",
                            background: "#e8f5e9",
                            border: "1px solid #b2dfdb",
                            borderRadius: 5,
                            padding: "8px 10px",
                            marginBottom: 10,
                            fontSize: 14
                        }}>
                            {passwordUpdateSuccess}
                        </div>
                    )}
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            background: "#FFD600",
                            color: "#232b35",
                            border: "none",
                            borderRadius: 7,
                            padding: "10px 0",
                            fontWeight: 700,
                            fontSize: 15,
                            cursor: updatingPassword ? "not-allowed" : "pointer",
                            marginTop: 2,
                            opacity: updatingPassword ? 0.7 : 1
                        }}
                        disabled={updatingPassword}
                    >
                        {updatingPassword ? "Updating..." : "Update Password"}
                    </button>
                </form>

                {/* Delete Account */}
                <div style={{
                    background: "#fff",
                    borderRadius: 8,
                    padding: "13px 14px",
                    margin: "0 10px 14px 10px",
                    border: "1px solid #eee"
                }}>
                    <button
                        style={{
                            width: "100%",
                            background: "#fff",
                            color: "#d32f2f",
                            border: "1.2px solid #d32f2f",
                            borderRadius: 7,
                            padding: "10px 0",
                            fontWeight: 600,
                            fontSize: 15,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8
                        }}
                        onClick={() => {
                            setShowDeleteConfirm(true);
                            setDeleteError("");
                            setDeleteSuccess(false);
                        }}
                    >
                        <FaTrashAlt style={{ marginRight: 5 }} />
                        Delete Account
                    </button>
                </div>

                {/* Logout */}
                <div style={{
                    background: "#fff",
                    borderRadius: 8,
                    padding: "13px 14px",
                    margin: "0 10px 14px 10px",
                    border: "1px solid #eee"
                }}>
                    <button
                        style={{
                            width: "100%",
                            background: "#232b35",
                            color: "#FFD600",
                            border: "none",
                            borderRadius: 7,
                            padding: "10px 0",
                            fontWeight: 700,
                            fontSize: 15,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8
                        }}
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt style={{ marginRight: 5 }} />
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
                            borderRadius: 8,
                            padding: 24,
                            minWidth: 240,
                            maxWidth: 340,
                            width: "90vw",
                            textAlign: "center",
                            boxShadow: "0 4px 24px rgba(44,62,80,0.10)"
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: "#232b35" }}>
                            Confirm Account Deletion
                        </div>
                        <div style={{ color: "#b71c1c", fontSize: 15, marginBottom: 18 }}>
                            Are you sure you want to delete your account? This action cannot be undone.
                        </div>
                        {deleteError && (
                            <div style={{
                                color: "#d32f2f",
                                background: "#fff0f0",
                                border: "1px solid #ffd6d6",
                                borderRadius: 5,
                                padding: "8px 10px",
                                marginBottom: 12,
                                fontSize: 14
                            }}>
                                {deleteError}
                            </div>
                        )}
                        {deleteSuccess && (
                            <div style={{
                                color: "#388e3c",
                                background: "#e8f5e9",
                                border: "1px solid #b2dfdb",
                                borderRadius: 5,
                                padding: "8px 10px",
                                marginBottom: 12,
                                fontSize: 14
                            }}>
                                Account deleted successfully. Redirecting...
                            </div>
                        )}
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
                                    cursor: loadingDelete ? "not-allowed" : "pointer",
                                    opacity: loadingDelete ? 0.7 : 1
                                }}
                                onClick={handleDeleteAccount}
                                disabled={loadingDelete || deleteSuccess}
                            >
                                {loadingDelete ? "Deleting..." : "Yes, Delete"}
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
                                    cursor: loadingDelete ? "not-allowed" : "pointer",
                                    opacity: loadingDelete ? 0.7 : 1
                                }}
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteError("");
                                    setDeleteSuccess(false);
                                }}
                                disabled={loadingDelete}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Update Status Popup */}
            {showPasswordPopup && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.18)",
                    zIndex: 3000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 8,
                            padding: 24,
                            minWidth: 240,
                            maxWidth: 340,
                            width: "90vw",
                            textAlign: "center",
                            boxShadow: "0 4px 24px rgba(44,62,80,0.10)"
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{
                            fontWeight: 700,
                            fontSize: 17,
                            marginBottom: 10,
                            color: passwordUpdateSuccess ? "#388e3c" : "#d32f2f"
                        }}>
                            {passwordUpdateSuccess ? "Success" : "Error"}
                        </div>
                        <div style={{
                            color: passwordUpdateSuccess ? "#388e3c" : "#d32f2f",
                            fontSize: 15,
                            marginBottom: 18
                        }}>
                            {passwordUpdateSuccess || passwordUpdateError}
                        </div>
                        <button
                            style={{
                                background: "#FFD600",
                                color: "#232b35",
                                border: "none",
                                borderRadius: 6,
                                padding: "9px 24px",
                                fontWeight: 700,
                                fontSize: 15,
                                cursor: "pointer"
                            }}
                            onClick={() => {
                                setShowPasswordPopup(false);
                                setPasswordUpdateError("");
                                setPasswordUpdateSuccess("");
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}