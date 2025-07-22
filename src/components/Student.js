import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Student.css";

function Student() {
  const [form, setForm] = useState({
    name: "",
    roll_number: "",
    countryCode: "+91",
    phone_number: "",
    gmail_address: "",
    branch: "",
    year: "",
    exam_hall_number: "",
  });

  const [fieldMessages, setFieldMessages] = useState({});
  const [isLiveValid, setIsLiveValid] = useState({});
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const branchNameMap = {
    CSE: "Computer Science & Engineering (CSE)",
    CAI: "Computer Science & Engineering Artificial Intelligence (CAI)",
    CSM: "Computer Science & Engineering AI & ML (CSM)",
    CSN: "Computer Science & Engineering Networks (CSN)",
    CST: "Computer Science & Engineering Technology (CST)",
    CSD: "Computer Science & Engineering Data Science (CSD)",
    CSC: "Computer Science & Engineering Cyber Security (CSC)",
    ECE: "Electronics & Communication Engineering (ECE)",
    EEE: "Electrical & Electronics Engineering (EEE)",
    MEC: "Mechanical Engineering (MEC)",
    CIV: "Civil Engineering (CIV)",
  };

  const validatePhone = (code, number) => {
    if (code === "+91") {
      return /^[6-9]\d{9}$/.test(number)
        ? { valid: true, message: "Valid Indian number" }
        : { valid: false, message: "Starts with 6-9, 10 digits" };
    }
    if (code === "+1") {
      return /^[2-9]\d{9}$/.test(number)
        ? { valid: true, message: "Valid US number" }
        : { valid: false, message: "US number: 10 digits, starts 2-9" };
    }
    if (code === "+44") {
      return /^\d{10}$/.test(number)
        ? { valid: true, message: "Valid UK number" }
        : { valid: false, message: "UK number: 10 digits" };
    }
    return { valid: false, message: "Unsupported country" };
  };
  const isValidEmail = (email) => {
    const allowedPersonalDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
    ];
    const collegePattern = /^[a-zA-Z0-9._%+-]+@mits\.ac\.in$/;
    if (collegePattern.test(email)) return true;
    const parts = email.split("@");
    if (parts.length !== 2) return false;
    return allowedPersonalDomains.includes(parts[1].toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value: rawValue } = e.target;
    let value = rawValue;

    if (name === "phone_number" && value.length > 10) return;
    if (name === "roll_number" && value.length > 10) return;
    if (name === "year" && value.length > 1) return;

    setForm((prev) => ({ ...prev, [name]: value }));

    let message = "";
    let valid = null;

    if (name === "name") {
      const trimmed = value.trim();
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!trimmed) {
        message = "Name is required";
        valid = false;
      } else if (!nameRegex.test(trimmed)) {
        message = "Only letters and spaces allowed";
        valid = false;
      } else if (trimmed.length < 4) {
        message = "Minimum 4 characters required";
        valid = false;
      } else {
        message = "Valid name!";
        valid = true;
      }
    }

    if (name === "roll_number") {
      const rollRegex = /^[A-Za-z0-9]{10}$/;
      if (!value.trim()) {
        message = "Roll number is required";
        valid = false;
      } else if (!rollRegex.test(value)) {
        message = "Exactly 10 characters: only letters & numbers";
        valid = false;
      } else {
        message = "Valid roll number!";
        valid = true;
      }
    }
    if (name === "gmail_address") {
      if (!isValidEmail(value)) {
        message = "invalid email format";
        valid = false;
      } else {
        message = "Valid email!";
        valid = true;
      }
    }

    if (name === "phone_number") {
      const result = validatePhone(form.countryCode, value);
      message = result.message;
      valid = result.valid;
    }

    if (name === "countryCode") {
      const result = validatePhone(value, form.phone_number);
      setFieldMessages((prev) => ({
        ...prev,
        phone_number: result.message,
      }));
      setIsLiveValid((prev) => ({
        ...prev,
        phone_number: result.valid,
      }));
    }

    if (["branch", "year", "exam_hall_number"].includes(name)) {
      if (!value.trim()) {
        message = "This field is required";
        valid = false;
      } else if (name === "year" && !/^[1-4]$/.test(value)) {
        message = "Year must be between 1 and 4";
        valid = false;
      } else if (
        name === "exam_hall_number" &&
        !/^[A-Za-z0-9]{1,10}$/.test(value)
      ) {
        message = "Max 10 alphanumeric characters";
        valid = false;
      } else {
        message = "Looks good!";
        valid = true;
      }
    }

    setFieldMessages((prev) => ({ ...prev, [name]: message }));
    setIsLiveValid((prev) => ({ ...prev, [name]: valid }));
  };

  const handleCreate = async () => {
    const requiredFields = [
      "name",
      "roll_number",
      "phone_number",
      "gmail_address",
      "branch",
      "year",
      "exam_hall_number",
    ];
    const missing = requiredFields.filter(
      (field) => !form[field] || isLiveValid[field] === false
    );

    if (missing.length > 0) {
      alert("❌ Please fill all required fields correctly.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/students/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to create student.");
      }

      alert("✅ Student Created Successfully");
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/wave-haikei.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="student-form">
        <h2>Student Form</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          {fieldMessages.name && (
            <p
              className={`live-message-text ${
                isLiveValid.name ? "valid" : "invalid"
              }`}
            >
              {isLiveValid.name ? <FaCheckCircle /> : <FaTimesCircle />}{" "}
              {fieldMessages.name}
            </p>
          )}

          {/* Roll Number */}
          <input
            type="text"
            name="roll_number"
            placeholder="Roll Number"
            value={form.roll_number}
            onChange={handleChange}
          />
          {fieldMessages.roll_number && (
            <p
              className={`live-message-text ${
                isLiveValid.roll_number ? "valid" : "invalid"
              }`}
            >
              {isLiveValid.roll_number ? <FaCheckCircle /> : <FaTimesCircle />}{" "}
              {fieldMessages.roll_number}
            </p>
          )}

          {/* Phone */}
          <div className="combined-phone-field">
            <select
              name="countryCode"
              value={form.countryCode}
              onChange={handleChange}
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
            </select>
            <input
              type="tel"
              name="phone_number"
              placeholder="Phone Number"
              value={form.phone_number}
              onChange={handleChange}
            />
          </div>
          {fieldMessages.phone_number && (
            <p
              className={`live-message-text ${
                isLiveValid.phone_number ? "valid" : "invalid"
              }`}
            >
              {isLiveValid.phone_number ? <FaCheckCircle /> : <FaTimesCircle />}{" "}
              {fieldMessages.phone_number}
            </p>
          )}

          {/* Email */}
          <input
            type="text"
            name="gmail_address"
            placeholder="Email Address"
            value={form.gmail_address}
            onChange={handleChange}
          />
          {fieldMessages.gmail_address && (
            <p
              className={`live-message-text ${
                isLiveValid.gmail_address ? "valid" : "invalid"
              }`}
            >
              {isLiveValid.gmail_address ? <FaCheckCircle /> : <FaTimesCircle />}{" "}
              {fieldMessages.gmail_address}
            </p>
          )}

          {/* Branch & Year */}
          <select name="branch" value={form.branch} onChange={handleChange}>
            <option value="">Select Branch</option>
            {Object.entries(branchNameMap).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>

          <select name="year" value={form.year} onChange={handleChange}>
            <option value="">Select Year</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>

          {/* Exam Hall Number */}
          <input
            type="text"
            name="exam_hall_number"
            placeholder="Exam Hall Number"
            value={form.exam_hall_number}
            onChange={handleChange}
          />
          {fieldMessages.exam_hall_number && (
            <p
              className={`live-message-text ${
                isLiveValid.exam_hall_number ? "valid" : "invalid"
              }`}
            >
              {isLiveValid.exam_hall_number ? <FaCheckCircle /> : <FaTimesCircle />}{" "}
              {fieldMessages.exam_hall_number}
            </p>
          )}

          {/* Buttons */}
          <div className="btn-group">
            <button type="button" onClick={handleCreate}>
              Create
            </button>
            <button type="button" onClick={() => navigate("/StudentList")}>
              Student Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Student;
