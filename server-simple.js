const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock data
const mockData = {
  overview: {
    totalSubstations: 8,
    activeFeeders: 24,
    totalEventsToday: 4,
    activeEvents: 2,
    resolvedEvents: 2,
    modelAccuracy: 0.9687
  },
  recentEvents: [
    {
      id: '1',
      feederName: 'TVM-CENTRAL-F01',
      detectedAt: new Date().toISOString(),
      status: 'detected',
      severity: 'high',
      estimatedLocationKm: 2.5
    }
  ],
  alerts: { critical: 1, high: 2, medium: 1, low: 0 },
  performance: {
    avgDetectionTimeMs: 185,
    avgResponseTimeMinutes: 12.5,
    falsePositiveRate: 0.018
  }
};

// Routes
app.get('/api/v1/dashboard/summary', (req, res) => {
  res.json({ success: true, data: mockData });
});

app.get('/api/v1/dashboard/map-data', (req, res) => {
  res.json({ 
    success: true, 
    data: { 
      substations: [
        { id: '1', name: 'Thiruvananthapuram 132kV SS', code: 'TVM-132', lat: 8.5241, lng: 76.9361, voltageLevel: '132kV', capacityMva: 50, district: 'Thiruvananthapuram', status: 'operational' },
        { id: '2', name: 'Kochi 220kV SS', code: 'KCH-220', lat: 10.0168, lng: 76.3418, voltageLevel: '220kV', capacityMva: 100, district: 'Ernakulam', status: 'operational' },
        { id: '3', name: 'Thrissur 132kV SS', code: 'TSR-132', lat: 10.5276, lng: 76.2144, voltageLevel: '132kV', capacityMva: 75, district: 'Thrissur', status: 'operational' },
        { id: '4', name: 'Kozhikode 132kV SS', code: 'KZD-132', lat: 11.2588, lng: 75.7804, voltageLevel: '132kV', capacityMva: 60, district: 'Kozhikode', status: 'operational' }
      ]
    } 
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@ksebl.gov.in' && password === 'Admin@123') {
    res.json({
      success: true,
      data: {
        user: { id: '1', fullName: 'Admin User', email: 'admin@ksebl.gov.in', role: 'admin' },
        tokens: { accessToken: 'mock-token' }
      }
    });
  } else {
    res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });
  }
});

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Kerala Emergency System API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/v1`);
  console.log(`🔍 Health: http://localhost:${PORT}/api/v1/health`);
});
