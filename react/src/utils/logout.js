// components/LogoutMessage.js
import React, { useEffect, useState } from 'react';

const LogoutMessage = ({ onComplete, duration = 3 }) => {
  const [countdown, setCountdown] = useState(duration);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete(); // Tell parent to show login after countdown
    }
  }, [countdown, onComplete]);

  return (
    <div className="text-center mt-5">
      <div className="spinner-border text-success mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <h5 className="text-success">Logging Out</h5>
      <p>Redirecting to login in {countdown}...</p>
    </div>
  );
};

export default LogoutMessage;
