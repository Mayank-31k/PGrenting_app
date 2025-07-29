import React, { useState } from 'react';
import './Auth.css';

const Login = ({ onClose, onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="auth-header">
          <h2>LOGIN</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="YOUR EMAIL"
              required
            />
          </div>
          
          <div className="form-group">
            <label>PASSWORD</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="YOUR PASSWORD"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary auth-submit">
            LOGIN
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            DON'T HAVE AN ACCOUNT?{' '}
            <button className="link-btn" onClick={onSwitchToRegister}>
              REGISTER
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;