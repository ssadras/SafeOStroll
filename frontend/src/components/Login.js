import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import axios from 'axios';
import { UserContext } from '../UserContext';
import './Login.css';
=======
import axios from 'axios'; // Ensure you have axios imported
import './Login.css'; // Importing the CSS file for styling
import logo from './logo/logo.png';  // Import the logo
>>>>>>> 6a9762cb659c8fc6797448a20a7160ccd4ceb7ca

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserId } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted', { email, password });

    try {
      const response = await axios.post('http://localhost:8000/api/member/login/', {
        username: email,
        password: password,
      });

      if (response.status === 200) {
        const userId = response.data.user_id;
        console.log('Login successful. User ID:', userId);
        setUserId(userId);

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