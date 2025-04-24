import React, { useState, useEffect } from 'react';
import Login from './Login.js';
import Register from './Register.js';
import Dashboard from './Dashboard.js';
import AdminDashboard from './adminDashboard.js';
import LogoutMessage from '../utils/logout.js';

const Body = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Show register form
  const handleShowRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    setShowDashboard(false);
  };

  // Show login form
  const handleShowLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
    setShowDashboard(false);
  };

  // Handle login success (user redirected based on role)
  const handleLoginSuccess = () => {
    const role = localStorage.getItem('userRole');  
    setShowLogin(false);
    setShowRegister(false);
    if (role === 'admin') {
      setShowAdminDashboard(true);
    } else {
      setShowDashboard(true);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setShowDashboard(false);
    setShowAdminDashboard(false);
    setIsLoggingOut(true); 
  };

  // Complete the logout process
  const handleLogoutComplete = () => {
    setIsLoggingOut(false);
    setShowLogin(true);
  };

  return (
    <div>
      {isLoggingOut ? (
        <LogoutMessage onComplete={handleLogoutComplete} />
      ) : (
        <>
          {showLogin && <Login databaseHandler={handleLoginSuccess} />}
          {showRegister && <Register />}
          {showDashboard && <Dashboard onLogout={handleLogout} />}
          {showAdminDashboard && <AdminDashboard onLogout={handleLogout} />}

          {/* Show registration/login links */}
          {!showDashboard && !showAdminDashboard && (
            <>
              {showLogin && (
                <center className="mb-5">
                  <small className="form-text text-muted">Don't have an account yet? </small>
                  <a href="#" onClick={handleShowRegister} className="text-primary">Register Here!</a>
                </center>
              )}
              {showRegister && (
                <center className="mb-5">
                  <small className="form-text text-muted">Already have an account? </small>
                  <a href="#" onClick={handleShowLogin} className="text-primary">Login</a>
                </center>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Body;
