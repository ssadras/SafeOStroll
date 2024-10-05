import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo/logo.png';  // Import the logo
import './Dashboard.css'; // Import the custom CSS file for new styles

function Dashboard() {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate('/map'); // Navigate to the map page
  };

  const goToCall = () => {
    navigate('/call'); // Navigate to the call page, which will initiate listening
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-top">
          <img src={logo} alt="App Logo" className="app-logo" />
          <h1>Welcome to SafeOStroll</h1>
          <div className="user-greeting">
            <h3>Hey,  </h3>
            <p>Let's see what can I do for you?</p>
          </div>
        </div>

        <div className="action-cards">
          <div className="card voice-card" onClick={goToCall}>
            <h4>Voice Helper</h4>
            <p>Let's find new things using voice recording</p>
            <button className="start-btn">Start Recording</button>
          </div>

          <div className="card" onClick={goToMap}>
            <h4>Check Maps</h4>
            <p>Click here to see your location and nearby people for safety</p>
          </div>

          <div className="card">
            <h4>Emergency Contacts</h4>
            <p>Access your emergency contacts</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Dashboard;