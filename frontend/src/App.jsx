import { useState, useEffect } from 'react'
import LogFilters from './LogFilters'
import LogList from './LogList'
import LogCreator from './LogCreator'
import { getLogs } from './api'
import './App.css'

function App() {
  const [filters, setFilters] = useState({ level: [] })
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreator, setShowCreator] = useState(false)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const data = await getLogs(filters)
      setLogs(data)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [filters])

  const handleLogAdded = () => {
    fetchLogs()
    setShowCreator(false)
  }

  const handleLogDeleted = () => {
    fetchLogs()
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Log Viewer</h1>
        <p>Monitor and filter your application logs in real-time</p>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1rem',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setShowCreator(!showCreator)}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            background: showCreator ? 'var(--warning-color)' : 'var(--success-color)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          {showCreator ? 'Hide Creator' : 'Add New Log'}
        </button>
      </div>
      
      {showCreator && (
        <LogCreator onLogAdded={handleLogAdded} />
      )}
      
      <LogFilters filters={filters} onChange={setFilters} />
      
      {loading ? (
        <div className="loading">Loading logs...</div>
      ) : (
        <LogList logs={logs} onLogDeleted={handleLogDeleted} />
      )}
    </div>
  )
}

export default App
