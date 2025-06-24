import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaTrash, FaCarSide, FaPlus, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../config/apiConfig";
import BottomNav from "../common/BottomNav";

// --- Delete Confirmation Modal ---
function DeleteCabModal({ open, onClose, onConfirm, loading, error }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.18)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 14,
        padding: "18px 14px 14px 14px",
        minWidth: 240,
        maxWidth: "90vw",
        boxShadow: "0 2px 18px rgba(0,0,0,0.13)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1.5px solid #FFD600",
        position: "relative"
      }}>
        <div style={{
          background: "#FFD60022",
          borderRadius: "50%",
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}>
          <FaTrash size={18} color="#FFD600" />
        </div>
        <div style={{
          fontWeight: 700,
          fontSize: 15.5,
          color: "#232b35",
          marginBottom: 2,
          textAlign: "center"
        }}>
          Confirm Delete
        </div>
        <div style={{
          color: "#666",
          fontSize: 13.5,
          textAlign: "center",
          marginBottom: 10,
          lineHeight: 1.5
        }}>
          Are you sure you want to delete this cab?<br />
          <span style={{ color: "#d32f2f", fontWeight: 500 }}>This cannot be undone.</span>
        </div>
        {error && (
          <div style={{
            color: "#d32f2f",
            fontSize: 13,
            marginBottom: 8,
            textAlign: "center",
            background: "#fff0f0",
            borderRadius: 6,
            padding: "6px 8px",
            width: "100%",
            border: "1px solid #ffd6d6"
          }}>
            {error}
          </div>
        )}
        {loading && (
          <div style={{ marginBottom: 10 }}>
            <img
              src="https://i.gifer.com/ZZ5H.gif"
              alt="Loading..."
              style={{ width: 36, height: 36, display: "block", margin: "0 auto" }}
            />
            <div style={{ color: "#888", fontSize: 13, marginTop: 2, textAlign: "center" }}>
              Please wait...
            </div>
          </div>
        )}
        <div style={{
          display: "flex",
          gap: 8,
          width: "100%",
          justifyContent: "center",
          marginTop: 2
        }}>
          <button
            onClick={onClose}
            style={{
              padding: "7px 0",
              borderRadius: 7,
              border: "1.2px solid #e0e3e7",
              background: "#f7f7f7",
              color: "#232b35",
              fontWeight: 600,
              fontSize: 14,
              flex: 1,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s"
            }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "7px 0",
              borderRadius: 7,
              border: "none",
              background: "#FFD600",
              color: "#232b35",
              fontWeight: 700,
              fontSize: 14,
              flex: 1,
              cursor: loading ? "wait" : "pointer",
              transition: "background 0.2s"
            }}
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, cab: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line
  }, []);

  async function fetchVehicles() {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.userId || user.id || "";
      const res = await fetch(API_ENDPOINTS.GET_CAB_BY_USER_ID(userId));
      const data = await res.json();
      if (
        res.ok &&
        data.responseCode === 200 &&
        Array.isArray(data.responseData) &&
        data.responseData.length > 0
      ) {
        // Flatten the nested array
        setVehicles(data.responseData.flat());
      } else {
        setVehicles([]);
      }
    } catch (err) {
      setVehicles([]);
    }
    setLoading(false);
  }

  // New: Check bookings before delete
  async function confirmDeleteCab() {
    setDeleteLoading(true);
    setDeleteError("");
    const cab = deleteModal.cab;
    try {
      // Check for bookings on this cab registration id
      const res = await fetch(API_ENDPOINTS.GET_BOOKINGS_BY_CAB_REG_ID(cab.registrationId));
      const data = await res.json();
      if (res.ok && data.responseCode === 200 && Array.isArray(data.responseData) && data.responseData.length > 0) {
        setDeleteError("You cannot delete this cab because bookings exist for this vehicle.");
        setDeleteLoading(false);
        return;
      }
      // No bookings, proceed to delete
      const delRes = await fetch(API_ENDPOINTS.DELETE_CAB(cab.registrationId), { method: "DELETE" });
      const delData = await delRes.json();
      if (delRes.ok && delData.responseCode === 200) {
        setVehicles(vs => vs.filter(v => v.registrationId !== cab.registrationId));
        setDeleteModal({ open: false, cab: null });
      } else {
        setDeleteError(delData.responseMessage || "Failed to delete cab.");
      }
    } catch {
      setDeleteError("Failed to delete cab.");
    }
    setDeleteLoading(false);
  }

  return (
    <div style={{ background: "#f7f7f7", minHeight: "100vh", fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", padding: "16px 18px 0 18px", gap: 12
      }}>
        <span
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 40, height: 40, borderRadius: "50%", background: "#eee",
            cursor: "pointer", marginRight: 0
          }}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft size={22} color="#232b35" />
        </span>
        <div style={{ flex: 1, fontWeight: 700, fontSize: 20, color: "#232b35" }}>
          Manage Vehicles
        </div>
        <button
          style={{
            background: "#FFD600", border: "none", borderRadius: "50%",
            width: 40, height: 40, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", marginLeft: 8
          }}
          title="Add Vehicle"
          onClick={() => navigate("/add-vehicle")}
        >
          <FaPlus size={20} color="#232b35" />
        </button>
      </div>

      {/* Vehicle List */}
      <div style={{
        maxWidth: 430, margin: "24px auto 0 auto", padding: "0 0 80px 0"
      }}>
        {loading ? (
          <div style={{
            minHeight: '40vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "3px solid #FFD600",
              borderTop: "3px solid #eee",
              animation: "spin 1s linear infinite"
            }} />
            <div style={{ color: "#232b35", fontWeight: 600, fontSize: 16, marginTop: 18 }}>
              Loading vehicles...
            </div>
            <style>
              {`
                @keyframes spin {
                  100% { transform: rotate(360deg);}
                }
              `}
            </style>
          </div>
        ) : vehicles.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
            No vehicles found.
          </div>
        ) : vehicles.map(vehicle => (
          <div
            key={vehicle.registrationId}
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              padding: "16px 16px 12px 16px",
              marginBottom: 16,
              border: "1.5px solid #FFD600",
              display: "flex",
              alignItems: "center",
              gap: 14
            }}
          >
            <div style={{
              width: 54, height: 54, borderRadius: "50%",
              background: "#FFFDE7", display: "flex", alignItems: "center",
              justifyContent: "center", border: "2px solid #FFD600", flexShrink: 0, overflow: "hidden"
            }}>
              {vehicle.cab?.cabImageUrl ? (
                <img
                  src={vehicle.cab.cabImageUrl}
                  alt={vehicle.cab.cabName}
                  style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <FaCarSide size={28} color="#FFD600" />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 700, fontSize: 16, color: "#232b35", marginBottom: 2,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
              }}>
                {vehicle.cab?.cabNumber}
              </div>
              <div style={{ color: "#888", fontSize: 14, marginBottom: 2 }}>
                {vehicle.cab?.cabName} {vehicle.cab?.cabModel} • {vehicle.cab?.cabType}
              </div>
              <div style={{ color: "#888", fontSize: 13 }}>
                Seats: {vehicle.cab?.cabCapacity} | AC: {vehicle.cab?.ac ? "Yes" : "No"}
              </div>
              <div style={{ color: "#888", fontSize: 13 }}>
                Owner: {vehicle.ownerName}
              </div>
              <div style={{ color: "#888", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                <FaPhone style={{ color: "#00b894" }} /> {vehicle.driverContact}
              </div>
              <div style={{ color: "#888", fontSize: 13 }}>
                Address: {vehicle.address}
              </div>
              <div style={{ color: "#888", fontSize: 13 }}>
                Base Fare: ₹{vehicle.baseFare} | Per Km: ₹{vehicle.perKmRate}
              </div>
            </div>
            <button
              style={{
                background: "#FFFDE7", border: "1.5px solid #FFD600",
                borderRadius: 10, padding: "7px 10px", marginRight: 6,
                cursor: "pointer", fontWeight: 700, color: "#232b35", fontSize: 15
              }}
              title="Edit"
              onClick={() => navigate(`/edit-vehicle/${vehicle.registrationId}`, { state: { vehicle } })}
            >
              <FaEdit />
            </button>
            <button
              style={{
                background: "#fff0f0", border: "1.5px solid #d32f2f",
                borderRadius: 10, padding: "7px 10px",
                cursor: deletingId === vehicle.registrationId ? "wait" : "pointer",
                fontWeight: 700, color: "#d32f2f", fontSize: 15
              }}
              title="Delete"
              disabled={deletingId === vehicle.registrationId}
              onClick={() => setDeleteModal({ open: true, cab: vehicle })}
            >
              {deletingId === vehicle.registrationId ? "..." : <FaTrash />}
            </button>
          </div>
        ))}
      </div>
      <BottomNav />

      {/* Delete Confirmation Modal */}
      <DeleteCabModal
        open={deleteModal.open}
        onClose={() => {
          setDeleteModal({ open: false, cab: null });
          setDeleteError("");
        }}
        onConfirm={confirmDeleteCab}
        loading={deleteLoading}
        error={deleteError}
      />
    </div>
  );
}