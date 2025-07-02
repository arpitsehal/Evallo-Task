import React, { useState } from 'react';
import { formatTimestamp } from './utils';
import { deleteLog, clearAllLogs } from './api';

export default function LogList({ logs, onLogDeleted }) {
  const [deleting, setDeleting] = useState(null);
  const [clearing, setClearing] = useState(false);

  const handleDeleteLog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) {
      return;
    }

    setDeleting(id);
    try {
      await deleteLog(id);
      if (onLogDeleted) {
        onLogDeleted();
      }
    } catch (error) {
      console.error('Failed to delete log:', error);
      alert('Failed to delete log');
    } finally {
      setDeleting(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL logs? This action cannot be undone.')) {
      return;
    }

    setClearing(true);
    try {
      await clearAllLogs();
      if (onLogDeleted) {
        onLogDeleted();
      }
    } catch (error) {
      console.error('Failed to clear logs:', error);
      alert('Failed to clear logs');
    } finally {
      setClearing(false);
    }
  };

  if (!logs.length) {
    return (
      <div className="logs-card">
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3>No logs found</h3>
          <p>Try adjusting your filters or add some logs to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="logs-card">
      <div className="logs-header">
        <h3 className="logs-title">Log Entries</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span className="logs-count">{logs.length} logs</span>
          <button
            onClick={handleClearAll}
            disabled={clearing}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '6px',
              background: 'var(--error-color)',
              color: 'white',
              cursor: clearing ? 'not-allowed' : 'pointer',
              fontSize: '0.75rem',
              opacity: clearing ? 0.7 : 1
            }}
          >
            {clearing ? 'Clearing...' : 'Clear All'}
          </button>
        </div>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="logs-table">
          <thead>
            <tr>
              <th>Level</th>
              <th>Timestamp</th>
              <th>Message</th>
              <th>Resource ID</th>
              <th>Trace ID</th>
              <th>Span ID</th>
              <th>Commit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td>
                  <span className={`log-level ${log.level}`}>
                    {log.level}
                  </span>
                </td>
                <td className="log-timestamp">
                  {formatTimestamp(log.timestamp)}
                </td>
                <td className="log-message">
                  {log.message}
                </td>
                <td>
                  <span className="log-id">{log.resourceId}</span>
                </td>
                <td>
                  <span className="log-id">{log.traceId}</span>
                </td>
                <td>
                  <span className="log-id">{log.spanId}</span>
                </td>
                <td>
                  <span className="log-id">{log.commit}</span>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    disabled={deleting === log.id}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: 'var(--error-color)',
                      color: 'white',
                      cursor: deleting === log.id ? 'not-allowed' : 'pointer',
                      fontSize: '0.75rem',
                      opacity: deleting === log.id ? 0.7 : 1
                    }}
                  >
                    {deleting === log.id ? '...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 