import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import CallComponent from './components/CallComponent';  
import Map from './components/HereMap';
import './App.css';
import { UserProvider } from './UserContext';  // Import the UserProvider
import NotificationListener from './NotificationListener'; // Import the NotificationListener

function App() {
    return (
        <UserProvider>
            <Router>
                <NotificationListener />  {/* Notification listener runs globally in the background */}
                
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/call" element={<CallComponent />} /> 
                    <Route path="/map" element={<Map />} /> {/* Add the new route */}
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;