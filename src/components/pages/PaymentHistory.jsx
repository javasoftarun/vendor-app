import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaRupeeSign, FaReceipt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../config/apiConfig";
import BottomNav from "../common/BottomNav";

export default function PaymentHistory() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, []);

  async function fetchPayments() {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.userId || user.id || "";
      const res = await fetch(API_ENDPOINTS.GET_ALL_BOOKINGS_BY_VENDOR_ID(userId));
      const data = await res.json();
      if (
        res.ok &&
        data.responseCode === 200 &&
        Array.isArray(data.responseData)
      ) {
        const allBookings = data.responseData.flat();
        const filtered = allBookings.filter(
          (b) =>
            String(b.bookingStatus).toLowerCase() === "completed" &&
            String(b.paymentStatus).toLowerCase() === "full"
        );
        setPayments(filtered);
        const total = filtered.reduce(
          (sum, p) => sum + (Number(p.balanceAmount) || 0),
          0
        );
        setTotalIncome(total);
      } else {
        setPayments([]);
        setTotalIncome(0);
      }
    } catch {
      setPayments([]);
      setTotalIncome(0);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        background: "#fafbfc",
        minHeight: "100vh",
        fontFamily: "inherit",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px 18px 0 18px",
          gap: 12,
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
            background: "#f2f2f2",
            cursor: "pointer",
            marginRight: 0,
            border: "1px solid #e0e3e7",
          }}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft size={20} color="#232b35" />
        </span>
        <div
          style={{
            flex: 1,
            fontWeight: 700,
            fontSize: 21,
            color: "#232b35",
            letterSpacing: 0.2,
          }}
        >
          Payment History
        </div>
      </div>

      {/* Total Income */}
      <div
        style={{
          maxWidth: 430,
          margin: "24px auto 0 auto",
          padding: "0 0 12px 0",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "18px 18px",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            border: "1px solid #e0e3e7"
          }}
        >
          <div
            style={{
              background: "#f2f2f2",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #e0e3e7"
            }}
          >
            <FaRupeeSign size={22} color="#232b35" />
          </div>
          <div>
            <div style={{ fontSize: 15, color: "#888", marginBottom: 2 }}>
              Total Income
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 22,
                color: "#232b35",
                letterSpacing: 1,
              }}
            >
              <FaRupeeSign style={{ marginRight: 2, verticalAlign: -2 }} />
              {totalIncome.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Payment List */}
      <div
        style={{
          maxWidth: 430,
          margin: "0 auto",
          padding: "0 0 80px 0",
        }}
      >
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
              Loading payment history...
            </div>
            <style>
              {`
                @keyframes spin {
                  100% { transform: rotate(360deg);}
                }
              `}
            </style>
          </div>
        ) : payments.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#888",
              marginTop: 40,
            }}
          >
            No payment history found.
          </div>
        ) : (
          payments.map((payment, idx) => (
            <div
              key={payment.bookingId || idx}
              style={{
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                padding: "14px 16px 12px 16px",
                marginBottom: 14,
                border: "1px solid #e0e3e7",
                display: "flex",
                alignItems: "center",
                gap: 16,
                position: "relative",
                transition: "box-shadow 0.2s",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#f2f2f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #e0e3e7",
                  flexShrink: 0,
                  marginRight: 8,
                }}
              >
                <FaReceipt size={18} color="#888" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15.5,
                    color: "#232b35",
                    marginBottom: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Booking #{payment.bookingId}
                </div>
                {/* Removed user and date */}
                <div
                  style={{
                    color: "#888",
                    fontSize: 13,
                  }}
                >
                  Cab: {payment.cabName} ({payment.cabNumber})
                </div>
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#27ae60",
                  minWidth: 80,
                  textAlign: "right",
                  background: "#f7f7f7",
                  borderRadius: 8,
                  padding: "7px 0",
                  border: "1px solid #e0e3e7",
                }}
              >
                <FaRupeeSign style={{ marginRight: 2, verticalAlign: -2 }} />
                {Number(payment.balanceAmount).toLocaleString("en-IN")}
              </div>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
}