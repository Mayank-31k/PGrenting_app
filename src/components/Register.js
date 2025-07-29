import React, { useState } from 'react';
import './Auth.css';

const Register = ({ onClose, onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onRegister(formData);
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
          <h2>REGISTER</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>FULL NAME</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="YOUR FULL NAME"
              required
            />
          </div>
          
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
            <label>PHONE</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="YOUR PHONE NUMBER"
              required
            />
          </div>
          
          <div className="form-group">
            <label>COLLEGE</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="YOUR COLLEGE NAME"
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
              placeholder="CREATE PASSWORD"
              required
            />
          </div>
          
          <div className="form-group">
            <label>CONFIRM PASSWORD</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="CONFIRM PASSWORD"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary auth-submit">
            REGISTER
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            ALREADY HAVE AN ACCOUNT?{' '}
            <button className="link-btn" onClick={onSwitchToLogin}>
              LOGIN
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;