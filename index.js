const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Joi = require('joi');
const path = require('path');

const app = express();
const PORT = 3001;
const LOGS_FILE = path.join(__dirname, 'logs.json');

app.use(cors());
app.use(express.json());

// Log schema
const logSchema = Joi.object({
  level: Joi.string().valid('info', 'warning', 'error', 'debug').required(),
  message: Joi.string().required(),
  resourceId: Joi.string().required(),
  timestamp: Joi.string().isoDate().required(),
  traceId: Joi.string().required(),
  spanId: Joi.string().required(),
  commit: Joi.string().required(),
  metadata: Joi.object().optional(),
});

// Helper to read logs
function readLogs() {
  if (!fs.existsSync(LOGS_FILE)) return [];
  const data = fs.readFileSync(LOGS_FILE, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to write logs
function writeLogs(logs) {
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
}

// Helper to generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// POST /logs
app.post('/logs', (req, res) => {
  const { error, value } = logSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  
  const logs = readLogs();
  const logWithId = {
    ...value,
    id: generateId()
  };
  logs.push(logWithId);
  writeLogs(logs);
  res.status(201).json({ message: 'Log added', log: logWithId });
});

// GET /logs with filters
app.get('/logs', (req, res) => {
  let logs = readLogs();
  const {
    level,
    message,
    resourceId,
    traceId,
    spanId,
    commit,
    timestamp_start,
    timestamp_end,
  } = req.query;

  if (level) {
    const levels = Array.isArray(level) ? level : level.split(',');
    logs = logs.filter((log) => levels.includes(log.level));
  }
  if (message) {
    const msg = message.toLowerCase();
    logs = logs.filter((log) => log.message.toLowerCase().includes(msg));
  }
  if (resourceId) logs = logs.filter((log) => log.resourceId === resourceId);
  if (traceId) logs = logs.filter((log) => log.traceId === traceId);
  if (spanId) logs = logs.filter((log) => log.spanId === spanId);
  if (commit) logs = logs.filter((log) => log.commit === commit);
  if (timestamp_start) {
    logs = logs.filter((log) => new Date(log.timestamp) >= new Date(timestamp_start));
  }
  if (timestamp_end) {
    logs = logs.filter((log) => new Date(log.timestamp) <= new Date(timestamp_end));
  }
  // Sort by timestamp descending
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(logs);
});

// DELETE /logs/:id - Delete specific log by ID
app.delete('/logs/:id', (req, res) => {
  const logs = readLogs();
  const logId = req.params.id;
  
  const logIndex = logs.findIndex(log => log.id === logId);
  if (logIndex === -1) {
    return res.status(404).json({ error: 'Log not found' });
  }
  
  const deletedLog = logs.splice(logIndex, 1)[0];
  writeLogs(logs);
  res.json({ message: 'Log deleted', deletedLog });
});

// DELETE /logs - Clear all logs
app.delete('/logs', (req, res) => {
  writeLogs([]);
  res.json({ message: 'All logs cleared' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 