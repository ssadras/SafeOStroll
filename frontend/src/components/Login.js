import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure you have axios imported
import './Login.css'; // Importing the CSS file for styling
import logo from './logo/logo.png';  // Import the logo

function Login() {
  const [email, setEmail] = useState(''); // Using email as username
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted', { email, password });

    try {
      // Send a POST request to the backend login endpoint
      const response = await axios.post('http://localhost:8000/api/member/login/', {
        username: email, // Sending email as username
        password: password,
      });

      if (response.status === 200) {
        // Navigate to dashboard on successful login
        navigate('/dashboard');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
           {/* Centered logo */}
           <img src={logo} alt="App Logo" className="app-logo" />
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-container">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-container">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="signup-link">
          <p>Don't have an account? <a href="/signup">Sign up here</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;