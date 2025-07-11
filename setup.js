const fs = require('fs');
const path = require('path');

console.log('🚀 Log Viewer Setup Script');
console.log('==========================\n');

// Check if logs.json exists, if not create sample data
const logsFile = path.join(__dirname, 'logs.json');
if (!fs.existsSync(logsFile)) {
  console.log('📝 Creating sample log data...');
  const sampleLogs = [
    {
      "id": "sample-1",
      "level": "info",
      "message": "Application started successfully",
      "resourceId": "app-server-001",
      "timestamp": "2024-01-15T10:00:00.000Z",
      "traceId": "trace-123456",
      "spanId": "span-001",
      "commit": "abc123def"
    },
    {
      "id": "sample-2",
      "level": "warning",
      "message": "High memory usage detected",
      "resourceId": "monitoring-001",
      "timestamp": "2024-01-15T10:05:00.000Z",
      "traceId": "trace-123457",
      "spanId": "span-002",
      "commit": "def456ghi"
    },
    {
      "id": "sample-3",
      "level": "error",
      "message": "Database connection failed",
      "resourceId": "db-service-001",
      "timestamp": "2024-01-15T10:10:00.000Z",
      "traceId": "trace-123458",
      "spanId": "span-003",
      "commit": "ghi789jkl"
    },
    {
      "id": "sample-4",
      "level": "debug",
      "message": "Processing user request",
      "resourceId": "api-gateway-001",
      "timestamp": "2024-01-15T10:15:00.000Z",
      "traceId": "trace-123459",
      "spanId": "span-004",
      "commit": "jkl012mno"
    }
  ];
  
  fs.writeFileSync(logsFile, JSON.stringify(sampleLogs, null, 2));
  console.log('✅ Sample log data created successfully!');
} else {
  console.log('✅ Log data file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Start the backend server: node index.js');
console.log('2. In a new terminal, start the frontend: cd frontend && npm run dev');
console.log('3. Open your browser to http://localhost:5173');
console.log('\n🎉 Happy logging!');
