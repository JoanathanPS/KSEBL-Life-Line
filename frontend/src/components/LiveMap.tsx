import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OutageEvent, Substation, Feeder } from '../utils/mockData';
import { AlertTriangle, Building2, Zap } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LiveMapProps {
  events: OutageEvent[];
  substations: Substation[];
  feeders: Feeder[];
  className?: string;
}

const MapUpdater: React.FC<{ events: OutageEvent[]; substations: Substation[]; feeders: Feeder[] }> = ({ events, substations, feeders }) => {
  const map = useMap();

  useEffect(() => {
    if (events.length > 0 || substations.length > 0) {
      const bounds = L.latLngBounds([]);
      
      events.forEach(event => {
        bounds.extend(event.coordinates);
      });
      
      substations.forEach(substation => {
        bounds.extend(substation.coordinates);
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [events, substations, map]);

  return null;
};

export const LiveMap: React.FC<LiveMapProps> = ({ events, substations, feeders, className }) => {
  const mapRef = useRef<L.Map>(null);

  const getEventIcon = (severity: OutageEvent['severity']) => {
    const color = {
      critical: '#dc2626',
      high: '#f59e0b',
      medium: '#3b82f6',
      low: '#22c55e',
    }[severity];

    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  const getSubstationIcon = () => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #6366f1; width: 16px; height: 16px; border-radius: 2px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  const getFeederIcon = () => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  };

  return (
    <div className={`h-full w-full ${className}`}>
      <MapContainer
        ref={mapRef}
        center={[10.8505, 76.2711]} // Kerala center
        zoom={8}
        className="h-full w-full rounded-lg"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater events={events} substations={substations} feeders={feeders} />
        
        {/* Event markers */}
        {events.map((event) => (
          <Marker
            key={`event-${event.id}`}
            position={event.coordinates}
            icon={getEventIcon(event.severity)}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning-500" />
                  <span className="font-medium">{event.type.replace('_', ' ').toUpperCase()}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                <div className="text-xs text-gray-600">
                  <p><strong>District:</strong> {event.district}</p>
                  <p><strong>Status:</strong> {event.status}</p>
                  <p><strong>Affected:</strong> {event.affectedCustomers} customers</p>
                  <p><strong>Time:</strong> {new Date(event.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Substation markers */}
        {substations.map((substation) => (
          <Marker
            key={`substation-${substation.id}`}
            position={substation.coordinates}
            icon={getSubstationIcon()}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium">{substation.name}</span>
                </div>
                <div className="text-xs text-gray-600">
                  <p><strong>Capacity:</strong> {substation.capacity} MVA</p>
                  <p><strong>Voltage:</strong> {substation.voltage} kV</p>
                  <p><strong>Status:</strong> {substation.status}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Feeder markers */}
        {feeders.map((feeder) => (
          <Marker
            key={`feeder-${feeder.id}`}
            position={[10.8505, 76.2711]} // Placeholder - would need actual coordinates
            icon={getFeederIcon()}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{feeder.name}</span>
                </div>
                <div className="text-xs text-gray-600">
                  <p><strong>Capacity:</strong> {feeder.capacity} MVA</p>
                  <p><strong>Customers:</strong> {feeder.customers}</p>
                  <p><strong>Status:</strong> {feeder.status}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};