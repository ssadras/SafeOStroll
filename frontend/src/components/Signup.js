import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css'; // Link to the CSS file
import logo from './logo/logo.png';  // Import the logo


function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [university, setUniversity] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const signupData = {
      full_name: fullName,
      email: email,
      phone: phoneNumber,
      university_id: university,
      emergency_contact_name: emergencyName,
      emergency_contact_phone: emergencyPhoneNumber,
      password: password,
    };

    // Debugging
    console.log(signupData);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/member/register/', 
        signupData, 
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 201) {
        console.log('Signup successful:', response.data);
        navigate('/dashboard'); // Redirect to dashboard after successful signup
      }
    } catch (error) {
      console.error('There was an error with signup:', error.response.data);
      alert(error.response.data.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up
        </h2>
        
        {/* Centered logo */}
        <img src={logo} alt="App Logo" className="app-logo" />

        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>University:</label>
          <select
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            required
          >
            <option value="">Select your university</option>
            <option value="University of Toronto">University of Toronto</option>
            <option value="York University">York University</option>
            <option value="Ryerson University">Ryerson University</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Emergency Contact Name:</label>
          <input
            type="text"
            value={emergencyName}
            onChange={(e) => setEmergencyName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Emergency Contact Phone Number:</label>
          <input
            type="tel"
            value={emergencyPhoneNumber}
            onChange={(e) => setEmergencyPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
