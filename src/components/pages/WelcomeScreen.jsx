import React from "react";

export default function WelcomeScreen({ onContinue }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #FF8686 0%, #FFD6A6 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        fontFamily: "inherit",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Modern glassmorphism card */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: "50%",
          transform: "translateX(-50%)",
          width: 320,
          height: 320,
          background: "rgba(255,255,255,0.18)",
          borderRadius: "50%",
          filter: "blur(0.5px)",
          zIndex: 1,
        }}
      />
      {/* Decorative gradient circle */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          background: "radial-gradient(circle at 40% 40%, #fff 0%, #FFD6A6 100%)",
          borderRadius: "50%",
          zIndex: 1,
          opacity: 0.25,
        }}
      />
      {/* Content card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          background: "rgba(255,255,255,0.85)",
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          marginTop: "auto",
          padding: "56px 24px 36px 24px",
          boxSizing: "border-box",
          boxShadow: "0 -8px 32px 0 rgba(255,134,134,0.10)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF8686 60%, #FFD6A6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(255,134,134,0.13)",
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#fff" />
              <path
                d="M8 12l2.5 2.5L16 9"
                stroke="#FF8686"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: "#232b35",
            marginBottom: 10,
            letterSpacing: 0.5,
            fontFamily: "inherit",
            textAlign: "center",
            textShadow: "0 2px 8px #fff8",
          }}
        >
          Welcome to YatraNow
        </div>
        <div
          style={{
            color: "#666",
            fontSize: 16,
            marginBottom: 48,
            fontWeight: 500,
            lineHeight: 1.6,
            textAlign: "center",
            letterSpacing: 0.1,
            textShadow: "0 1px 0 #fff",
          }}
        >
          Discover, book, and travel in style.<br />
          Your journey starts here.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={onContinue}
            style={{
              background: "linear-gradient(90deg, #FF8686 60%, #FFD6A6 100%)",
              border: "none",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              outline: "none",
              gap: 10,
              borderRadius: 28,
              padding: "13px 36px 13px 28px",
              boxShadow: "0 2px 12px rgba(255,134,134,0.13)",
              transition: "background 0.2s",
              letterSpacing: 0.2,
            }}
          >
            Get Started
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                borderRadius: "50%",
                width: 32,
                height: 32,
                marginLeft: 8,
                boxShadow: "0 2px 8px rgba(255,134,134,0.10)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 8l4 4-4 4"
                  stroke="#FF8686"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}