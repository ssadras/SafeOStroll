import React, { useState } from 'react';
import Login from './components/login';
import Signup from './components/signup';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="App">
      <header className="App-header">
        {isLogin ? <Login /> : <Signup />}
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={toggleAuthMode}>
            {isLogin ? 'Sign up here' : 'Log in here'}
          </button>
        </p>
      </header>
    </div>
  );
}

export default App;
