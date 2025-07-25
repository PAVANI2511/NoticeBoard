import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [matchValid, setMatchValid] = useState(false);
  const [message, setMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const state = location.state;
    if (state?.email && state?.otp) {
      setEmail(state.email);
      setOtp(state.otp);
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

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  useEffect(() => {
    setPasswordValid(passwordPattern.test(newPassword));
    setMatchValid(newPassword === confirmPassword && confirmPassword.length > 0);
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordValid) {
      setMessage("❌ Password doesn't meet complexity requirements.");
      return;
    }

    if (!matchValid) {
      setMessage("❌ Passwords do not match.");
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
        setMessage(`❌ ${data.message || "Failed to reset password."}`);
      }
    } catch (error) {
      setMessage("❌ Server error. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Change Password</h2>

        <label>New Password</label>
        <div className="password-input-wrapper">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <span
            className="toggle-eye"
            onClick={() => setShowNewPassword((prev) => !prev)}
            title={showNewPassword ? "Hide password" : "Show password"}
          >
          
          </span>
        </div>
        <p className={`validation-message ${passwordValid ? "valid" : ""}`}>
          {newPassword.length > 0
            ? passwordValid
              ? "✅ Strong password"
              : "❌ Password must be at least 8 characters long with uppercase, lowercase, number, and symbol."
            : "\u00A0"}
        </p>

        <label>Confirm Password</label>
        <div className="password-input-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <span
            className="toggle-eye"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            title={showConfirmPassword ? "Hide password" : "Show password"}
          >
          
          </span>
        </div>
        <p className={`validation-message ${matchValid ? "valid" : ""}`}>
          {confirmPassword.length > 0
            ? matchValid
              ? "✅ Passwords match"
              : "❌ Passwords do not match."
            : "\u00A0"}
        </p>

        <button type="submit" className="submit-btn" disabled={!passwordValid || !matchValid}>
          Change Password
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
