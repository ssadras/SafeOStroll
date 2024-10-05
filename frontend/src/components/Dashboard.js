import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate('/map'); // This is the route where your map will be displayed
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to your Dashboard!</h1>
        <p>This is the main landing page after login or signup.</p>
        <button onClick={goToMap}>Go to map</button>
      </header>
    </div>
  );
}

export default Dashboard;
