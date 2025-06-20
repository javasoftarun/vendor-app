import React from "react";

export default function StatusModal({ open, message, success, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}>
      <div style={{
        background: "#fff", borderRadius: 18, padding: "36px 32px 28px 32px", minWidth: 320, boxShadow: "0 8px 32px #0002",
        textAlign: "center", animation: "pop-in 0.25s cubic-bezier(.68,-0.55,.27,1.55)"
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18
        }}>
          <div style={{
            width: 70, height: 70, borderRadius: "50%",
            background: success ? "linear-gradient(135deg,#43d477 60%,#2fae61 100%)" : "linear-gradient(135deg,#ff5252 60%,#d32f2f 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 0, boxShadow: success ? "0 2px 8px #43d47744" : "0 2px 8px #ff525244"
          }}>
            <span style={{
              fontSize: 38,
              color: "#fff",
              fontWeight: 700,
              lineHeight: 1
            }}>
              {success ? "✔" : "✖"}
            </span>
          </div>
        </div>
        <div style={{ fontSize: 20, marginBottom: 28, color: "#232b35", fontWeight: 500 }}>{message}</div>
        <button
          onClick={onClose}
          style={{
            background: success ? "#43d477" : "#ff5252",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 36px",
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
            boxShadow: success ? "0 2px 8px #43d47744" : "0 2px 8px #ff525244"
          }}
        >
          OK
        </button>
        <style>
          {`
            @keyframes pop-in {
              0% { transform: scale(0.7); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}
        </style>
      </div>
    </div>
  );
}