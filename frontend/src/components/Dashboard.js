import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo/logo.png';  // Import the logo
import './Dashboard.css';
import axios from "axios"; // Import the custom CSS file for new styles

function Dashboard() {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate('/map'); // Navigate to the map page
  };

  const goToCall = () => {
    navigate('/call'); // Navigate to the call page, which will initiate listening
  };

  const goToNotifications = () => {
    navigate('/notifications'); // Navigate to the notifications page
  };

  const goToEmergencyContacts = () => {
    navigate('/emergencycontacts'); // Navigate to the emergency
  }

  const clearAIHistory = async () => {
      try {
          const response = await axios.post('http://localhost:8000/api/chat/clear_history/', {
          });

          if (response.status === 200) {
              console.log('Chat history cleared');
          } else {
              alert('Failed to clear chat history');
          }
      } catch (error) {
            console.error('Clear chat history error:', error);
      }
  }

  clearAIHistory();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-top">
          <img src={logo} alt="App Logo" className="app-logo" />
          <h1>Welcome to SafeOStroll</h1>
          <div className="user-greeting">
            <h3>Hey,</h3>
            <p>Let's see what can I do for you?</p>
          </div>

          {/* Notification bell icon */}
          <div className="notification-icon" onClick={goToNotifications}>
            <i className="fas fa-bell"></i> {/* FontAwesome bell icon */}
          </div>
        </div>

        <div className="action-cards">
          <div className="card voice-card" onClick={goToCall}>
            <h4>Voice Helper</h4>
            <p>Your safety is important. Talk to our AI Chatbot</p>
            <button className="start-btn">Start Call</button>
          </div>

          <div className="card" onClick={goToMap}>
            <h4>Check Maps</h4>
            <p>Click here to see your location and nearby people for safety</p>
          </div>

          <div className="card" onClick={goToEmergencyContacts}>
            <h4>Emergency Contacts</h4>
            <p>Access your emergency contacts</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Dashboard;
