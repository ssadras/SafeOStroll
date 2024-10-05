import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate('/map'); // This is the route where your map will be displayed
  };

  const goToCall = () => {
    navigate('/call'); // Navigate to the call page
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to your Dashboard!</h1>
        <p>This is the main landing page after login or signup.</p>
        <button onClick={goToMap}>Go to map</button>
        <button onClick={goToCall}>Go to call</button>

      </header>
    </div>
  );
}

export default Dashboard;
