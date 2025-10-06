import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Tooltip } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap, MapPin, Phone, Clock, Users } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom icons for different emergency types
const createCustomIcon = (color: string, icon: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
    ">${icon}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

interface EmergencyMessage {
  id: string;
  type: 'line_break' | 'power_outage' | 'equipment_failure' | 'maintenance' | 'storm_damage';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    district: string;
  };
  affectedArea: number; // in km²
  estimatedCustomers: number;
  reportedAt: string;
  estimatedRestoration: string;
  status: 'reported' | 'investigating' | 'repairing' | 'restored';
  contactInfo: {
    phone: string;
    email: string;
    responsibleTeam: string;
  };
}

interface Substation {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  voltageLevel: string;
  capacityMva: number;
  district: string;
  status: 'operational' | 'maintenance' | 'fault';
}

// Kerala district boundaries (simplified coordinates)
const keralaDistricts = [
  {
    name: 'Thiruvananthapuram',
    coordinates: [[8.4, 76.8], [8.6, 77.0], [8.8, 77.2], [8.4, 77.4], [8.2, 77.2], [8.4, 76.8]],
    center: [8.5241, 76.9361]
  },
  {
    name: 'Kollam',
    coordinates: [[8.8, 76.4], [9.0, 76.6], [9.2, 76.8], [8.8, 77.0], [8.6, 76.8], [8.8, 76.4]],
    center: [8.8932, 76.6141]
  },
  {
    name: 'Pathanamthitta',
    coordinates: [[9.2, 76.6], [9.4, 76.8], [9.6, 77.0], [9.2, 77.2], [9.0, 77.0], [9.2, 76.6]],
    center: [9.2648, 76.7870]
  },
  {
    name: 'Alappuzha',
    coordinates: [[9.4, 76.2], [9.6, 76.4], [9.8, 76.6], [9.4, 76.8], [9.2, 76.6], [9.4, 76.2]],
    center: [9.4980, 76.3388]
  },
  {
    name: 'Kottayam',
    coordinates: [[9.6, 76.4], [9.8, 76.6], [10.0, 76.8], [9.6, 77.0], [9.4, 76.8], [9.6, 76.4]],
    center: [9.5916, 76.5222]
  },
  {
    name: 'Idukki',
    coordinates: [[9.8, 76.6], [10.0, 76.8], [10.2, 77.0], [9.8, 77.2], [9.6, 77.0], [9.8, 76.6]],
    center: [9.8252, 76.9955]
  },
  {
    name: 'Ernakulam',
    coordinates: [[10.0, 76.2], [10.2, 76.4], [10.4, 76.6], [10.0, 76.8], [9.8, 76.6], [10.0, 76.2]],
    center: [10.0168, 76.3418]
  },
  {
    name: 'Thrissur',
    coordinates: [[10.4, 76.0], [10.6, 76.2], [10.8, 76.4], [10.4, 76.6], [10.2, 76.4], [10.4, 76.0]],
    center: [10.5276, 76.2144]
  },
  {
    name: 'Palakkad',
    coordinates: [[10.6, 76.2], [10.8, 76.4], [11.0, 76.6], [10.6, 76.8], [10.4, 76.6], [10.6, 76.2]],
    center: [10.7867, 76.6548]
  },
  {
    name: 'Malappuram',
    coordinates: [[10.8, 75.8], [11.0, 76.0], [11.2, 76.2], [10.8, 76.4], [10.6, 76.2], [10.8, 75.8]],
    center: [11.0508, 76.0711]
  },
  {
    name: 'Kozhikode',
    coordinates: [[11.0, 75.6], [11.2, 75.8], [11.4, 76.0], [11.0, 76.2], [10.8, 76.0], [11.0, 75.6]],
    center: [11.2588, 75.7804]
  },
  {
    name: 'Wayanad',
    coordinates: [[11.2, 75.8], [11.4, 76.0], [11.6, 76.2], [11.2, 76.4], [11.0, 76.2], [11.2, 75.8]],
    center: [11.6850, 76.1320]
  },
  {
    name: 'Kannur',
    coordinates: [[11.4, 75.4], [11.6, 75.6], [11.8, 75.8], [11.4, 76.0], [11.2, 75.8], [11.4, 75.4]],
    center: [11.8745, 75.3704]
  },
  {
    name: 'Kasaragod',
    coordinates: [[11.6, 75.2], [11.8, 75.4], [12.0, 75.6], [11.6, 75.8], [11.4, 75.6], [11.6, 75.2]],
    center: [12.5000, 75.0000]
  }
];

const KeralaEmergencyMap: React.FC = () => {
  const [emergencies, setEmergencies] = useState<EmergencyMessage[]>([]);
  const [substations, setSubstations] = useState<Substation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyMessage | null>(null);
  const [filter, setFilter] = useState<{
    severity: string[];
    type: string[];
    status: string[];
  }>({
    severity: [],
    type: [],
    status: []
  });

  useEffect(() => {
    loadMapData();
    // Simulate real-time updates
    const interval = setInterval(loadMapData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMapData = async () => {
    try {
      setLoading(true);
      
      // Mock emergency data
      const mockEmergencies: EmergencyMessage[] = [
        {
          id: '1',
          type: 'line_break',
          severity: 'critical',
          title: 'High Voltage Line Break - TVM Central',
          description: '33kV transmission line break detected near Thiruvananthapuram Central. Immediate attention required.',
          location: {
            lat: 8.5241,
            lng: 76.9361,
            address: 'Near Secretariat, Thiruvananthapuram',
            district: 'Thiruvananthapuram'
          },
          affectedArea: 15.5,
          estimatedCustomers: 2500,
          reportedAt: new Date().toISOString(),
          estimatedRestoration: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          status: 'investigating',
          contactInfo: {
            phone: '+91-471-1234567',
            email: 'emergency@ksebl.gov.in',
            responsibleTeam: 'TVM Emergency Response Team'
          }
        },
        {
          id: '2',
          type: 'power_outage',
          severity: 'high',
          title: 'Area Power Outage - Kochi Metro',
          description: 'Complete power outage in Kochi metro area due to transformer failure.',
          location: {
            lat: 10.0168,
            lng: 76.3418,
            address: 'Marine Drive, Kochi',
            district: 'Ernakulam'
          },
          affectedArea: 8.2,
          estimatedCustomers: 1800,
          reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          estimatedRestoration: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          status: 'repairing',
          contactInfo: {
            phone: '+91-484-1234567',
            email: 'kochi-emergency@ksebl.gov.in',
            responsibleTeam: 'Kochi Maintenance Team'
          }
        },
        {
          id: '3',
          type: 'equipment_failure',
          severity: 'medium',
          title: 'Substation Equipment Failure',
          description: 'Circuit breaker failure at Thrissur 132kV substation.',
          location: {
            lat: 10.5276,
            lng: 76.2144,
            address: 'Thrissur 132kV Substation',
            district: 'Thrissur'
          },
          affectedArea: 5.0,
          estimatedCustomers: 1200,
          reportedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          estimatedRestoration: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          status: 'investigating',
          contactInfo: {
            phone: '+91-487-1234567',
            email: 'thrissur-emergency@ksebl.gov.in',
            responsibleTeam: 'Thrissur Technical Team'
          }
        },
        {
          id: '4',
          type: 'storm_damage',
          severity: 'high',
          title: 'Storm Damage - Kozhikode',
          description: 'Heavy storm caused multiple line damages in Kozhikode district.',
          location: {
            lat: 11.2588,
            lng: 75.7804,
            address: 'Kozhikode Beach Road',
            district: 'Kozhikode'
          },
          affectedArea: 25.0,
          estimatedCustomers: 3500,
          reportedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          estimatedRestoration: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          status: 'reported',
          contactInfo: {
            phone: '+91-495-1234567',
            email: 'kozhikode-emergency@ksebl.gov.in',
            responsibleTeam: 'Kozhikode Storm Response Team'
          }
        }
      ];

      // Mock substation data
      const mockSubstations: Substation[] = [
        {
          id: '1',
          name: 'Thiruvananthapuram 132kV SS',
          code: 'TVM-132',
          lat: 8.5241,
          lng: 76.9361,
          voltageLevel: '132kV',
          capacityMva: 50,
          district: 'Thiruvananthapuram',
          status: 'operational'
        },
        {
          id: '2',
          name: 'Kochi 220kV SS',
          code: 'KCH-220',
          lat: 10.0168,
          lng: 76.3418,
          voltageLevel: '220kV',
          capacityMva: 100,
          district: 'Ernakulam',
          status: 'fault'
        },
        {
          id: '3',
          name: 'Thrissur 132kV SS',
          code: 'TSR-132',
          lat: 10.5276,
          lng: 76.2144,
          voltageLevel: '132kV',
          capacityMva: 75,
          district: 'Thrissur',
          status: 'maintenance'
        },
        {
          id: '4',
          name: 'Kozhikode 132kV SS',
          code: 'KZD-132',
          lat: 11.2588,
          lng: 75.7804,
          voltageLevel: '132kV',
          capacityMva: 60,
          district: 'Kozhikode',
          status: 'operational'
        }
      ];

      setEmergencies(mockEmergencies);
      setSubstations(mockSubstations);
    } catch (error) {
      console.error('Failed to load map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmergencyIcon = (type: string, severity: string) => {
    const icons = {
      line_break: '⚡',
      power_outage: '🔌',
      equipment_failure: '⚙️',
      maintenance: '🔧',
      storm_damage: '⛈️'
    };
    
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
      critical: '#DC2626'
    };

    return createCustomIcon(colors[severity as keyof typeof colors], icons[type as keyof typeof icons]);
  };

  const getSubstationIcon = (status: string) => {
    const colors = {
      operational: '#10B981',
      maintenance: '#F59E0B',
      fault: '#EF4444'
    };

    return createCustomIcon(colors[status as keyof typeof colors], '🏭');
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      reported: 'bg-blue-100 text-blue-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      repairing: 'bg-orange-100 text-orange-800',
      restored: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors];
  };

  const filteredEmergencies = emergencies.filter(emergency => {
    if (filter.severity.length > 0 && !filter.severity.includes(emergency.severity)) return false;
    if (filter.type.length > 0 && !filter.type.includes(emergency.type)) return false;
    if (filter.status.length > 0 && !filter.status.includes(emergency.status)) return false;
    return true;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kerala Emergency Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-4 text-muted-foreground">Loading emergency data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Kerala Emergency Response Map
          </CardTitle>
          <p className="text-sm text-gray-600">
            Real-time view of electrical emergencies and infrastructure across Kerala
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[10.8505, 76.2711]} // Kerala center coordinates
              zoom={8}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Kerala District Boundaries */}
              {keralaDistricts.map((district, index) => (
                <Polygon
                  key={index}
                  positions={district.coordinates}
                  pathOptions={{
                    color: '#3B82F6',
                    weight: 2,
                    opacity: 0.6,
                    fillColor: '#DBEAFE',
                    fillOpacity: 0.1
                  }}
                >
                  <Tooltip direction="center" offset={[0, 0]}>
                    <div className="text-center">
                      <strong>{district.name}</strong>
                    </div>
                  </Tooltip>
                </Polygon>
              ))}

              {/* Emergency Markers */}
              {filteredEmergencies.map((emergency) => (
                <Marker
                  key={emergency.id}
                  position={[emergency.location.lat, emergency.location.lng]}
                  icon={getEmergencyIcon(emergency.type, emergency.severity)}
                  eventHandlers={{
                    click: () => setSelectedEmergency(emergency),
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[300px]">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{emergency.title}</h3>
                        <Badge className={getSeverityColor(emergency.severity)}>
                          {emergency.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{emergency.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{emergency.location.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{emergency.estimatedCustomers.toLocaleString()} customers affected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Reported: {new Date(emergency.reportedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-gray-500" />
                          <span>Est. Restoration: {new Date(emergency.estimatedRestoration).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">{emergency.contactInfo.phone}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{emergency.contactInfo.responsibleTeam}</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Substation Markers */}
              {substations.map((substation) => (
                <Marker
                  key={substation.id}
                  position={[substation.lat, substation.lng]}
                  icon={getSubstationIcon(substation.status)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-lg">{substation.name}</h3>
                      <p className="text-sm text-gray-600">{substation.code}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{substation.voltageLevel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{substation.capacityMva} MVA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(substation.status)}>
                            {substation.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Emergency Types</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <span>Line Break</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔌</span>
                  <span>Power Outage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚙️</span>
                  <span>Equipment Failure</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">⛈️</span>
                  <span>Storm Damage</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Severity Levels</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Critical</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Details Panel */}
      {selectedEmergency && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Emergency Details</span>
              <button
                onClick={() => setSelectedEmergency(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold">{selectedEmergency.title}</h3>
                <div className="flex gap-2">
                  <Badge className={getSeverityColor(selectedEmergency.severity)}>
                    {selectedEmergency.severity.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(selectedEmergency.status)}>
                    {selectedEmergency.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <p className="text-gray-600">{selectedEmergency.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Location Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Address:</strong> {selectedEmergency.location.address}</p>
                    <p><strong>District:</strong> {selectedEmergency.location.district}</p>
                    <p><strong>Coordinates:</strong> {selectedEmergency.location.lat.toFixed(4)}, {selectedEmergency.location.lng.toFixed(4)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Impact Assessment</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Affected Area:</strong> {selectedEmergency.affectedArea} km²</p>
                    <p><strong>Customers:</strong> {selectedEmergency.estimatedCustomers.toLocaleString()}</p>
                    <p><strong>Reported:</strong> {new Date(selectedEmergency.reportedAt).toLocaleString()}</p>
                    <p><strong>Est. Restoration:</strong> {new Date(selectedEmergency.estimatedRestoration).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Phone:</strong> {selectedEmergency.contactInfo.phone}</p>
                  <p><strong>Email:</strong> {selectedEmergency.contactInfo.email}</p>
                  <p><strong>Team:</strong> {selectedEmergency.contactInfo.responsibleTeam}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KeralaEmergencyMap;
