import React, { useRef, useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";

export default function ImageUpload({
  onUploaded,
  userId = "0",
  initialUrl = "",
  size = 84,
  label = "Tap to select image"
}) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(initialUrl);

  // Convert file to base64 (remove data:image/...;base64, prefix)
  const fileToBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        const base64 = result.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Upload image to API_ENDPOINTS.UPLOAD_BASE64_IMAGE
  const uploadImageApi = async base64 => {
    const response = await fetch(API_ENDPOINTS.UPLOAD_BASE64_IMAGE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        base64Image: base64
      })
    });
    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    return data;
  };

  // Handle file selection (no upload here)
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle upload button click
  const handleUploadClick = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }
    setUploading(true);
    try {
      const base64 = await fileToBase64(selectedFile);
      const response = await uploadImageApi(base64);
      if (
        response &&
        response.responseCode === 200 &&
        typeof response.responseData === "string"
      ) {
        setImageUrl(response.responseData);
        if (onUploaded) onUploaded(response.responseData);
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      alert("Image upload failed");
    }
    setUploading(false);
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#f7f8fa",
          border: "2px solid #e0e3e7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          overflow: "hidden",
          cursor: uploading ? "not-allowed" : "pointer",
          opacity: uploading ? 0.6 : 1,
          position: "relative"
        }}
        onClick={() =>
          !uploading && fileInputRef.current && fileInputRef.current.click()
        }
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%"
            }}
          />
        ) : (
          <span style={{ color: "#bbb", fontSize: 36, fontWeight: 700 }}>+</span>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
          disabled={uploading}
        />
        {uploading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#888"
            }}
          >
            Uploading...
          </div>
        )}
      </div>
      <div style={{ textAlign: "center", fontSize: 13, color: "#888", marginTop: 6 }}>
        {label}
      </div>
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={uploading || !selectedFile}
          style={{
            padding: "6px 18px",
            borderRadius: 8,
            background: "#FFD600",
            color: "#232b35",
            border: "none",
            fontWeight: 600,
            cursor: uploading || !selectedFile ? "not-allowed" : "pointer"
          }}
        >
          Upload
        </button>
      </div>
      {imageUrl && (
        <input
          type="text"
          value={imageUrl}
          readOnly
          style={{
            width: "100%",
            marginTop: 8,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            background: "#f7f7f7",
            fontSize: 13,
            color: "#555"
          }}
        />
      )}
    </div>
  );
}