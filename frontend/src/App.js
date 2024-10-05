import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import CallComponent from './components/CallComponent';  // Import your new component
import Map from './components/HereMap';  // Import your map component
import './App.css';

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

export default App;
