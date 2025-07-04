import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email and otp_code from location or localStorage
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const state = location.state;
    if (state && state.email && state.otp) {
      setEmail(state.email);
      setOtp(state.otp);
      // Store in localStorage in case of page refresh
      localStorage.setItem("reset_email", state.email);
      localStorage.setItem("reset_otp", state.otp);
    } else {
      const savedEmail = localStorage.getItem("reset_email");
      const savedOtp = localStorage.getItem("reset_otp");
      if (savedEmail && savedOtp) {
        setEmail(savedEmail);
        setOtp(savedOtp);
      }
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    if (!email || !otp) {
      setMessage("❌ Email or OTP is missing. Try again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp_code: otp,
          new_password: newPassword,
          new_password_confirm: confirmPassword,
        }),
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      if (response.ok) {
        setMessage("✅ Password changed successfully!");
        localStorage.removeItem("reset_email");
        localStorage.removeItem("reset_otp");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setMessage(`❌ ${data.message || "Failed to reset password"}`);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage("❌ Server error. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <label>New password:</label>
        <div className="password-input-wrapper">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <span
            className="toggle-eye"
            onClick={() => setShowNewPassword((prev) => !prev)}
            title={showNewPassword ? "Hide password" : "Show password"}
          >
            {showNewPassword ? "🔒" : "👁"}
          </span>
        </div>

        <label>Confirm password:</label>
        <div className="password-input-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="toggle-eye"  
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            title={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? "🔒" : "👁"}
          </span>
        </div>

        <button type="submit">Change Password</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
