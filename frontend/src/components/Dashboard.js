import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo/logo.png';  // Import the logo
import './Dashboard.css'; // Import the custom CSS file

function Dashboard() {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate('/map'); // This is the route where your map will be displayed
  };

  const goToCall = () => {
    navigate('/call'); // Navigate to the call page
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src={logo} alt="SafeOStroll Logo" className="app-logo" />
        <h1 className="dashboard-title">Welcome to SafeOStroll</h1>
        <p className="dashboard-subtitle">Your personal safety companion for a safe walk home.</p>

        <div className="dashboard-buttons">
          <button className="btn primary-btn" onClick={goToMap}>Go to Map</button>
          <button className="btn secondary-btn" onClick={goToCall}>Start a Call</button>
        </div>
      </header>
    </div>
  );
}

export default Dashboard;
