const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('.'));

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

// Events API
app.get('/api/v1/events', (req, res) => {
  res.json({
    success: true,
    data: {
      events: [
        {
          id: 'EVT-001',
          feederName: 'TVM-CENTRAL-F01',
          substation: 'Thiruvananthapuram 132kV',
          detectedAt: new Date().toISOString(),
          status: 'detected',
          severity: 'critical',
          estimatedLocationKm: 2.5,
          confidence: 0.95,
          assignedTo: null,
          resolutionNotes: null
        },
        {
          id: 'EVT-002',
          feederName: 'KCH-URBAN-F03',
          substation: 'Kochi 220kV',
          detectedAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'acknowledged',
          severity: 'high',
          estimatedLocationKm: 1.8,
          confidence: 0.87,
          assignedTo: 'John Doe',
          resolutionNotes: null
        },
        {
          id: 'EVT-003',
          feederName: 'TSR-INDUSTRIAL-F02',
          substation: 'Thrissur 132kV',
          detectedAt: new Date(Date.now() - 7200000).toISOString(),
          status: 'resolved',
          severity: 'medium',
          estimatedLocationKm: 3.2,
          confidence: 0.78,
          assignedTo: 'Jane Smith',
          resolutionNotes: 'Line repaired, power restored'
        },
        {
          id: 'EVT-004',
          feederName: 'KZD-WEST-F05',
          substation: 'Kozhikode 132kV',
          detectedAt: new Date(Date.now() - 10800000).toISOString(),
          status: 'crew_dispatched',
          severity: 'high',
          estimatedLocationKm: 4.1,
          confidence: 0.82,
          assignedTo: 'Mike Johnson',
          resolutionNotes: null
        }
      ]
    }
  });
});

// Substations API
app.get('/api/v1/substations', (req, res) => {
  res.json({
    success: true,
    data: {
      substations: [
        {
          id: 'SS-001',
          name: 'Thiruvananthapuram 132kV',
          code: 'TVM-132',
          district: 'Thiruvananthapuram',
          voltageLevel: '132kV',
          capacityMva: 50,
          status: 'operational',
          lat: 8.5241,
          lng: 76.9361,
          feeders: 12,
          lastMaintenance: '2024-01-15'
        },
        {
          id: 'SS-002',
          name: 'Kochi 220kV',
          code: 'KCH-220',
          district: 'Ernakulam',
          voltageLevel: '220kV',
          capacityMva: 100,
          status: 'operational',
          lat: 10.0168,
          lng: 76.3418,
          feeders: 18,
          lastMaintenance: '2024-02-10'
        },
        {
          id: 'SS-003',
          name: 'Thrissur 132kV',
          code: 'TSR-132',
          district: 'Thrissur',
          voltageLevel: '132kV',
          capacityMva: 75,
          status: 'maintenance',
          lat: 10.5276,
          lng: 76.2144,
          feeders: 15,
          lastMaintenance: '2024-03-01'
        },
        {
          id: 'SS-004',
          name: 'Kozhikode 132kV',
          code: 'KZD-132',
          district: 'Kozhikode',
          voltageLevel: '132kV',
          capacityMva: 60,
          status: 'operational',
          lat: 11.2588,
          lng: 75.7804,
          feeders: 14,
          lastMaintenance: '2024-02-20'
        },
        {
          id: 'SS-005',
          name: 'Kannur 132kV',
          code: 'KNR-132',
          district: 'Kannur',
          voltageLevel: '132kV',
          capacityMva: 55,
          status: 'operational',
          lat: 11.8745,
          lng: 75.3704,
          feeders: 13,
          lastMaintenance: '2024-01-30'
        }
      ]
    }
  });
});

// Feeders API
app.get('/api/v1/feeders', (req, res) => {
  res.json({
    success: true,
    data: {
      feeders: [
        {
          id: 'F-001',
          name: 'TVM-CENTRAL-F01',
          substation: 'Thiruvananthapuram 132kV',
          lengthKm: 8.5,
          conductorType: 'ACSR 150mm²',
          typicalLoadKw: 2500,
          numConsumers: 1250,
          areaType: 'urban',
          status: 'active',
          lastInspection: '2024-01-20'
        },
        {
          id: 'F-002',
          name: 'KCH-URBAN-F03',
          substation: 'Kochi 220kV',
          lengthKm: 12.3,
          conductorType: 'ACSR 200mm²',
          typicalLoadKw: 3200,
          numConsumers: 1800,
          areaType: 'urban',
          status: 'active',
          lastInspection: '2024-02-15'
        },
        {
          id: 'F-003',
          name: 'TSR-INDUSTRIAL-F02',
          substation: 'Thrissur 132kV',
          lengthKm: 15.7,
          conductorType: 'ACSR 300mm²',
          typicalLoadKw: 4500,
          numConsumers: 2200,
          areaType: 'industrial',
          status: 'maintenance',
          lastInspection: '2024-03-01'
        },
        {
          id: 'F-004',
          name: 'KZD-WEST-F05',
          substation: 'Kozhikode 132kV',
          lengthKm: 9.2,
          conductorType: 'ACSR 180mm²',
          typicalLoadKw: 2800,
          numConsumers: 1500,
          areaType: 'urban',
          status: 'active',
          lastInspection: '2024-02-25'
        },
        {
          id: 'F-005',
          name: 'KNR-RURAL-F08',
          substation: 'Kannur 132kV',
          lengthKm: 18.5,
          conductorType: 'ACSR 120mm²',
          typicalLoadKw: 1800,
          numConsumers: 950,
          areaType: 'rural',
          status: 'active',
          lastInspection: '2024-01-10'
        }
      ]
    }
  });
});

// Analytics API
app.get('/api/v1/analytics/performance', (req, res) => {
  res.json({
    success: true,
    data: {
      modelPerformance: {
        accuracy: 0.9687,
        precision: 0.9523,
        recall: 0.9841,
        f1Score: 0.9680,
        falsePositiveRate: 0.018
      },
      detectionStats: {
        totalDetections: 1247,
        correctDetections: 1208,
        falsePositives: 23,
        falseNegatives: 16,
        avgDetectionTime: 185
      },
      trends: {
        dailyEvents: [12, 8, 15, 22, 18, 25, 19, 14, 21, 16, 13, 17],
        monthlyAccuracy: [0.95, 0.96, 0.97, 0.96, 0.98, 0.97, 0.96, 0.98, 0.97, 0.96, 0.97, 0.97],
        responseTimes: [15.2, 12.8, 14.1, 11.5, 13.7, 10.9, 12.3, 14.6, 11.8, 13.2, 12.1, 13.9]
      }
    }
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Kerala Emergency System API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/v1`);
  console.log(`🔍 Health: http://localhost:${PORT}/api/v1/health`);
});
