import React, { useState } from 'react';
import { postLog } from './api';

const LEVELS = ['info', 'warning', 'error', 'debug'];

export default function LogCreator({ onLogAdded }) {
  const [formData, setFormData] = useState({
    level: 'info',
    message: '',
    resourceId: '',
    traceId: '',
    spanId: '',
    commit: '',
    metadata: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const logData = {
        ...formData,
        timestamp: new Date().toISOString()
      };
      
      await postLog(logData);
      setFormData({
        level: 'info',
        message: '',
        resourceId: '',
        traceId: '',
        spanId: '',
        commit: '',
        metadata: {}
      });
      
      if (onLogAdded) {
        onLogAdded();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create log');
    } finally {
      setLoading(false);
    }
  };

  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const fillSampleData = () => {
    const samples = [
      {
        level: 'info',
        message: 'User login successful',
        resourceId: 'auth-service-001',
        traceId: `trace-${generateRandomId()}`,
        spanId: `span-${generateRandomId()}`,
        commit: 'abc123def'
      },
      {
        level: 'warning',
        message: 'High memory usage detected',
        resourceId: 'monitoring-001',
        traceId: `trace-${generateRandomId()}`,
        spanId: `span-${generateRandomId()}`,
        commit: 'def456ghi'
      },
      {
        level: 'error',
        message: 'Database connection failed',
        resourceId: 'db-service-001',
        traceId: `trace-${generateRandomId()}`,
        spanId: `span-${generateRandomId()}`,
        commit: 'ghi789jkl'
      }
    ];
    
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setFormData(prev => ({ ...prev, ...randomSample }));
  };

  return (
    <div className="filters-card">
      <h3 className="filters-title">Create New Log</h3>
      
      {error && (
        <div style={{ 
          background: '#fef2f2', 
          color: '#dc2626', 
          padding: '0.75rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="filters-grid">
          <div className="form-group">
            <label htmlFor="level">Log Level</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              required
            >
              {LEVELS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <input
              type="text"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter log message..."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="resourceId">Resource ID</label>
            <input
              type="text"
              id="resourceId"
              name="resourceId"
              value={formData.resourceId}
              onChange={handleInputChange}
              placeholder="e.g., server-001"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="traceId">Trace ID</label>
            <input
              type="text"
              id="traceId"
              name="traceId"
              value={formData.traceId}
              onChange={handleInputChange}
              placeholder="e.g., trace-123456"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="spanId">Span ID</label>
            <input
              type="text"
              id="spanId"
              name="spanId"
              value={formData.spanId}
              onChange={handleInputChange}
              placeholder="e.g., span-789"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="commit">Commit</label>
            <input
              type="text"
              id="commit"
              name="commit"
              value={formData.commit}
              onChange={handleInputChange}
              placeholder="e.g., abc123def"
              required
            />
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '1.5rem',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={fillSampleData}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              background: 'var(--card-bg)',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Fill Sample Data
          </button>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              background: 'var(--primary-color)',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Log'}
          </button>
        </div>
      </form>
    </div>
  );
} 