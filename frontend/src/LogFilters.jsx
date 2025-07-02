import React from 'react';

const LEVELS = ['info', 'warning', 'error', 'debug'];

export default function LogFilters({ filters, onChange }) {
  const handleInput = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };
  
  const handleLevelChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map(o => o.value);
    onChange({ ...filters, level: options });
  };

  return (
    <div className="filters-card">
      <h3 className="filters-title">Filter Logs</h3>
      <div className="filters-grid">
        <div className="form-group">
          <label htmlFor="message">Search Message</label>
          <input
            type="text"
            id="message"
            name="message"
            placeholder="Enter message to search..."
            value={filters.message || ''}
            onChange={handleInput}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="level">Log Level</label>
          <select
            id="level"
            name="level"
            multiple
            value={filters.level || []}
            onChange={handleLevelChange}
          >
            {LEVELS.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="resourceId">Resource ID</label>
          <input
            type="text"
            id="resourceId"
            name="resourceId"
            placeholder="Enter resource ID..."
            value={filters.resourceId || ''}
            onChange={handleInput}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="timestamp_start">Start Date</label>
          <input
            type="date"
            id="timestamp_start"
            name="timestamp_start"
            value={filters.timestamp_start || ''}
            onChange={handleInput}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="timestamp_end">End Date</label>
          <input
            type="date"
            id="timestamp_end"
            name="timestamp_end"
            value={filters.timestamp_end || ''}
            onChange={handleInput}
          />
        </div>
      </div>
    </div>
  );
} 