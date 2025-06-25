import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft, FaCarSide } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BottomNav from "../common/BottomNav";
import ImageUpload from "../common/ImageUpload";
import StatusModal from "../modal/StatusModal";
import API_ENDPOINTS from "../config/apiConfig";

export default function AddVehicle() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ownerName: "",
    driverName: "",
    driverContact: "",
    driverLicense: "",
    address: "",
    latitude: "",
    longitude: "",
    perKmRate: "",
    baseFare: "",
    status: "inactive",
    cab: {
      // Do NOT include cabId for new cab
      cabName: "",
      cabType: "",
      cabNumber: "",
      cabModel: "",
      cabColor: "",
      cabInsurance: "",
      cabCapacity: "",
      fluelType: "",
      cabImageUrl: "",
      cabCity: "",
      cabState: "",
      ac: false,
    },
    registrationId: 0,
  });
  const [modal, setModal] = useState({ open: false, message: "", success: true });
  const [loading, setLoading] = useState(false);
  const addressInputRef = useRef(null);

  // Get userId for ImageUpload
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id || user.userId || "";

  useEffect(() => {
    const name =
      user.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : user.name || "";
    const contact = user.phone || "";
    setForm((prev) => ({
      ...prev,
      ownerName: name,
      driverName: name,
      driverContact: contact,
    }));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: ["in", "np"] },
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        // place is the object returned from Google Places Autocomplete
        setForm(prev => ({
          ...prev,
          address: place.formatted_address || place.name || "",
          latitude: place.geometry?.location?.lat() || "",
          longitude: place.geometry?.location?.lng() || ""
        }));
      });
    }
  }, []);

  // This handler works for both top-level and cab fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("cab.")) {
      const cabField = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        cab: {
          ...prev.cab,
          [cabField]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageUploaded = (imageUrl) => {
    console.log("Image uploaded:", imageUrl);
    // imageUrl is the URL returned from your image upload API
    setForm(prev => ({
      ...prev,
      cab: {
        ...prev.cab,
        cabImageUrl: imageUrl
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.ADD_VEHICLE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId }),
      });
      const data = await response.json();

      if (response.ok && data.responseCode === 200) {
        setModal({
          open: true,
          message: "Vehicle added successfully!",
          success: true
        });
      } else {
        setModal({
          open: true,
          message: data.responseMessage || "Failed to add vehicle. Please try again.",
          success: false
        });
      }
    } catch (error) {
      setModal({
        open: true,
        message: "Failed to add vehicle. Please try again.",
        success: false
      });
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f8fa",
        display: "flex",
        flexDirection: "column",
        fontFamily: "inherit",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          background: "#fff",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          padding: "24px 0 16px 0",
          display: "flex",
          alignItems: "center",
          position: "relative",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#232b35",
            fontSize: 22,
            position: "absolute",
            left: 18,
            top: 22,
            cursor: "pointer",
          }}
          aria-label="Back"
        >
          <FaArrowLeft />
        </button>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            fontWeight: 700,
            fontSize: 22,
            color: "#232b35",
            letterSpacing: 0.5,
          }}
        >
          Add Vehicle
        </div>
      </div>

      {/* Main Layout */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          margin: "24px auto 0 auto",
          padding: "0 0 80px 0",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
            padding: 0,
            overflow: "hidden",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              background: "#f7f8fa",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: "24px 0 18px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
                boxShadow: "0 2px 8px rgba(255,214,0,0.10)",
              }}
            >
              <FaCarSide size={32} color="#FFD600" />
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: "#232b35",
                marginBottom: 2,
                letterSpacing: 0.2,
              }}
            >
              Vehicle Registration
            </div>
            <div
              style={{
                color: "#888",
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Please fill all the details below to add your vehicle.
            </div>
          </div>

          {/* Form */}
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              padding: "18px 12px 0 12px",
              boxSizing: "border-box",
            }}
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="cabImageUrl" value={form.cab.cabImageUrl || ""} />
            <input type="hidden" name="latitude" value={form.latitude || ""} />
            <input type="hidden" name="longitude" value={form.longitude || ""} />

            {/* Owner & Driver */}
            <SectionTitle>Owner & Driver</SectionTitle>
            <Input
              label="Owner Name"
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              required
            />
            <Input
              label="Driver Name"
              name="driverName"
              value={form.driverName}
              onChange={handleChange}
              required
            />
            <Input
              label="Driver Contact"
              name="driverContact"
              value={form.driverContact}
              onChange={handleChange}
              required
            />
            <Input
              label="Driver License"
              name="driverLicense"
              value={form.driverLicense}
              onChange={handleChange}
              required
            />
            <Input
              label="Address"
              name="address"
              ref={addressInputRef}
              value={form.address}
              onChange={handleChange}
              autoComplete="off"
              required
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
            <input type="hidden" name="latitude" value={form.latitude} />
            <input type="hidden" name="longitude" value={form.longitude} />

            {/* Cab Image Upload */}
            <SectionTitle>Cab Image</SectionTitle>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <ImageUpload
                onUploaded={handleImageUploaded}
                imageUrl={form.cab.cabImageUrl}
                userId={userId}
              />
            </div>

            {/* Cab Details */}
            <SectionTitle>Cab Details</SectionTitle>
            <Input
              label="Cab Name"
              name="cab.cabName"
              value={form.cab.cabName}
              onChange={handleChange}
              required
            />
            <Input
              label="Cab Type"
              name="cab.cabType"
              value={form.cab.cabType}
              onChange={handleChange}
              required
            />
            <Input
              label="Cab Number"
              name="cab.cabNumber"
              value={form.cab.cabNumber}
              onChange={handleChange}
              required
            />
            <Input
              label="Cab Model"
              name="cab.cabModel"
              value={form.cab.cabModel}
              onChange={handleChange}
              required
            />
            <Input
              label="Cab Color"
              name="cab.cabColor"
              value={form.cab.cabColor}
              onChange={handleChange}
            />
            <Input
              label="Cab Insurance"
              name="cab.cabInsurance"
              value={form.cab.cabInsurance}
              onChange={handleChange}
            />
            <Input
              label="Cab Capacity"
              name="cab.cabCapacity"
              value={form.cab.cabCapacity}
              onChange={handleChange}
            />
            <Input
              label="Fuel Type"
              name="cab.fluelType"
              value={form.cab.fluelType}
              onChange={handleChange}
            />
            <Input
              label="Cab City"
              name="cab.cabCity"
              value={form.cab.cabCity}
              onChange={handleChange}
            />
            <Input
              label="Cab State"
              name="cab.cabState"
              value={form.cab.cabState}
              onChange={handleChange}
            />
            <label
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 15,
                color: "#232b35",
                margin: "10px 0 0 2px",
                background: "#f7f8fa",
                borderRadius: 8,
                padding: "8px 12px",
                fontWeight: 500,
                border: "1px solid #e9ecef",
              }}
            >
              <input
                type="checkbox"
                name="cab.ac"
                checked={form.cab.ac}
                onChange={handleChange}
                style={{ marginRight: 8 }}
              />
              AC Available
            </label>

            {/* Fare Details */}
            <SectionTitle>Fare Details</SectionTitle>
            <Input
              label="Per Km Rate"
              name="perKmRate"
              value={form.perKmRate}
              onChange={handleChange}
              type="number"
              min={0}
              required
            />
            <Input
              label="Base Fare"
              name="baseFare"
              value={form.baseFare}
              onChange={handleChange}
              type="number"
              min={0}
              required
            />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "28px 0 18px 0",
              }}
            >
              <button
                type="submit"
                disabled={loading}
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
              >
                {loading ? (
                  <span style={{ fontWeight: 700, fontSize: 20, color: "#FFD600" }}>
                    Adding...
                  </span>
                ) : (
                  <span style={{ fontWeight: 700, fontSize: 20, color: "#FFD600" }}>
                    Add Vehicle
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          position: "fixed",
          left: 0,
          bottom: 0,
          zIndex: 100,
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <BottomNav />
      </div>

      <StatusModal
        open={modal.open}
        message={modal.message}
        success={modal.success}
        onClose={() => setModal(m => ({ ...m, open: false }))}
      />
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontWeight: 700,
        fontSize: 15,
        color: "#232b35",
        margin: "20px 0 8px 0",
        background: "#fffbe6",
        borderRadius: 7,
        padding: "9px 12px",
        letterSpacing: 0.2,
        border: "1.2px solid #ffe066",
      }}
    >
      {children}
    </div>
  );
}

function Input({ label, style, ...props }) {
  return (
    <div
      style={{
        ...style,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginBottom: 12,
        boxSizing: "border-box",
      }}
    >
      <label
        style={{
          fontSize: 13.5,
          color: "#232b35",
          marginBottom: 4,
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      <input
        {...props}
        style={{
          width: "100%",
          padding: "10px 11px",
          borderRadius: 7,
          border: "1.2px solid #e0e3e7",
          fontSize: 15,
          color: "#232b35",
          background: "#fff",
          outline: "none",
          fontWeight: 500,
          transition: "border 0.2s",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}