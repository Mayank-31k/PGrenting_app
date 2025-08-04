import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { X, User, Mail, Calendar, Shield, Edit3, Save, MessageSquare, Clock } from 'lucide-react';
import './UserProfile.css';

const UserProfile = ({ user, onClose, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setError('');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Validate input
      if (!editData.name.trim()) {
        setError('Name is required');
        setIsLoading(false);
        return;
      }

      if (user.provider === 'local' && !editData.email.trim()) {
        setError('Email is required');
        setIsLoading(false);
        return;
      }

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to update your profile');
        setIsLoading(false);
        return;
      }

      // Make API call to update profile
      const response = await fetch('http://localhost:5004/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update parent component
        onUpdateProfile && onUpdateProfile(data.user);
        setIsEditing(false);
      } else {
        setError(data.error || 'Failed to update profile');
      }

    } catch (error) {
      console.error('Update error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const loadInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5004/api/inquiries', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setInquiries(data.inquiries);
      } else {
        console.error('Failed to load inquiries:', data.error);
      }
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inquiries') {
      loadInquiries();
    }
  }, [activeTab]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProviderIcon = (provider) => {
    if (provider === 'google') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      );
    }
    return <Shield className="user-profile-provider-icon" />;
  };

  if (!user) return null;

  return (
    <div className="user-profile-overlay">
      <div className="user-profile-modal">
        {/* Header */}
        <div className="user-profile-header">
          <button
            className="user-profile-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          <h2 className="user-profile-title">My Profile</h2>
          <p className="user-profile-subtitle">Manage your account information</p>
        </div>

        {/* Content */}
        <div className="user-profile-content">
          {error && (
            <div className="user-profile-error">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="user-profile-tabs">
            <button
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={16} />
              Profile
            </button>
            <button
              className={`tab-button ${activeTab === 'inquiries' ? 'active' : ''}`}
              onClick={() => setActiveTab('inquiries')}
            >
              <MessageSquare size={16} />
              My Inquiries
            </button>
          </div>

          {activeTab === 'profile' && (
            <>
              {/* Profile Picture */}
              <div className="user-profile-picture-section">
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt="Profile" 
                    className="user-profile-picture"
                  />
                ) : (
                  <div className="user-profile-picture-placeholder">
                    <User size={40} />
                  </div>
                )}
              </div>

              {/* User Details */}
              <div className="user-profile-details">
            {/* Name */}
            <div className="user-profile-field">
              <label className="user-profile-label">
                <User size={16} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="user-profile-input"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="user-profile-value">{user.name}</div>
              )}
            </div>

            {/* Email */}
            <div className="user-profile-field">
              <label className="user-profile-label">
                <Mail size={16} />
                Email Address
              </label>
              {isEditing && user.provider === 'local' ? (
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="user-profile-input"
                  placeholder="Enter your email"
                />
              ) : (
                <div className="user-profile-value">
                  {user.email}
                  {user.provider === 'google' && (
                    <span className="user-profile-readonly-note">
                      (Google account - cannot be changed)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Provider */}
            <div className="user-profile-field">
              <label className="user-profile-label">
                <Shield size={16} />
                Account Type
              </label>
              <div className="user-profile-value user-profile-provider">
                {getProviderIcon(user.provider)}
                <span>
                  {user.provider === 'google' ? 'Google Account' : 'Email Account'}
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div className="user-profile-field">
              <label className="user-profile-label">
                <Calendar size={16} />
                Member Since
              </label>
              <div className="user-profile-value">
                {formatDate(user.createdAt)}
              </div>
            </div>

            {/* Last Login */}
            <div className="user-profile-field">
              <label className="user-profile-label">
                <Calendar size={16} />
                Last Login
              </label>
              <div className="user-profile-value">
                {formatDate(user.lastLogin)}
              </div>
            </div>
          </div>

              {/* Actions */}
              <div className="user-profile-actions">
                {isEditing ? (
                  <div className="user-profile-edit-actions">
                    <button
                      className="user-profile-button user-profile-button-secondary"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="user-profile-button user-profile-button-primary"
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="user-profile-spinner" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    className="user-profile-button user-profile-button-primary"
                    onClick={handleEdit}
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                )}
              </div>
            </>
          )}

          {activeTab === 'inquiries' && (
            <div className="user-profile-inquiries">
              {loadingInquiries ? (
                <div className="inquiries-loading">
                  <div className="user-profile-spinner" />
                  <p>Loading your inquiries...</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="no-inquiries">
                  <MessageSquare size={48} />
                  <h3>No Inquiries Yet</h3>
                  <p>You haven't made any PG inquiries yet. Browse our listings to find your perfect PG!</p>
                </div>
              ) : (
                <div className="inquiries-list">
                  <div className="inquiries-header">
                    <h3>Your PG Inquiries ({inquiries.length})</h3>
                    <p>Track all your PG inquiries and their status</p>
                  </div>
                  {inquiries.map((inquiry, index) => (
                    <div key={index} className="inquiry-item">
                      <div className="inquiry-header">
                        <div className="inquiry-pg-info">
                          <h4>{inquiry.pgName}</h4>
                          <div className="inquiry-location">
                            <span>📍</span>
                            {inquiry.pgLocation}
                          </div>
                        </div>
                        <div className="inquiry-price">
                          {inquiry.pgPrice}
                        </div>
                      </div>
                      
                      <div className="inquiry-details">
                        <div className="inquiry-message">
                          <strong>Your Message:</strong>
                          <p>{inquiry.message}</p>
                        </div>
                        
                        <div className="inquiry-contact">
                          <strong>Contact Number:</strong>
                          <span>{inquiry.userPhone}</span>
                        </div>
                        
                        <div className="inquiry-meta">
                          <div className="inquiry-date">
                            <Clock size={16} />
                            <span>Sent on {formatDate(inquiry.createdAt)}</span>
                          </div>
                          <div className="inquiry-status">
                            <span className="status-badge">Email Sent</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;