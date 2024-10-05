import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import CallComponent from './components/CallComponent';  // Import your new component
import Map from './components/HereMap';  // Import your map component
import './App.css';
import axios from 'axios';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/call" element={<CallComponent />} /> 
        <Route path="/map" element={<Map />} /> {/* Add the new route */}
      </Routes>
    </Router>
  );
}

const NotificationListener = () => {
  const [newNotifications, setNewNotifications] = useState([]);

  useEffect(() => {
      // Function to check the backend for new notifications
      const checkForNotifications = async () => {
          try {
              const response = await axios.get('/Notifications_APP/get_new/');
              const { notifications } = response.data;
              
              if (notifications.length > 0) {
                  // If new notifications are found, show an alert
                  alert("You have new notifications!");
                  setNewNotifications(notifications);  // Optionally store them
              }
          } catch (error) {
              console.error("Error fetching notifications:", error);
          }
      };

      // Set up polling every 10 seconds
      const intervalId = setInterval(checkForNotifications, 10000);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
  }, []);

  return (
      <div>
          <h1>Notification Listener</h1>
          {newNotifications.length > 0 && (
              <ul>
                  {newNotifications.map(notification => (
                      <li key={notification.id}>
                          {notification.title}: {notification.content}
                      </li>
                  ))}
              </ul>
          )}
      </div>
  );
};

export default App;
