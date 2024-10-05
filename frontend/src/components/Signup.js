import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


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
  
    try {
      // Send a POST request to the backend signup endpoint
      const response = await axios.post('http://localhost:8000/api/member/register/', signupData);
  
      if (response.status === 201) {
        // Handle success, redirect to dashboard or show a success message
        console.log('Signup successful:', response.data);
        //navigate('/dashboard'); // Redirect to dashboard after successful signup
      }
    } catch (error) {
      // Handle error, display error message
      console.error('There was an error with signup:', error.response.data);
      alert(error.response.data.error || 'Signup failed. Please try again.');
    }
  };
  

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div>
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

        <div>
          <label>Emergency Contact Name:</label>
          <input
            type="text"
            value={emergencyName}
            onChange={(e) => setEmergencyName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Emergency Contact Phone Number:</label>
          <input
            type="tel"
            value={emergencyPhoneNumber}
            onChange={(e) => setEmergencyPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
