import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap, MapPin } from 'lucide-react';
import { dashboardAPI } from '../api/client';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Substation {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  voltageLevel: string;
  capacityMva: number;
  activeEvents: number;
}

const KeralaMap = () => {
  const [substations, setSubstations] = useState<Substation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubstation, setSelectedSubstation] = useState<Substation | null>(null);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getMapData();
      setSubstations(response.data.substations);
    } catch (error) {
      console.error('Failed to load map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (activeEvents: number) => {
    if (activeEvents === 0) return 'green';
    if (activeEvents <= 2) return 'yellow';
    if (activeEvents <= 5) return 'orange';
    return 'red';
  };

  const getMarkerSize = (activeEvents: number) => {
    return Math.max(8, Math.min(20, 8 + activeEvents * 2));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Grid Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-4 text-muted-foreground">Loading map...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Grid Map</CardTitle>
        <p className="text-sm text-gray-600">
          Real-time view of Kerala electrical grid with active events
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
            
            {substations.map((substation) => (
              <Marker
                key={substation.id}
                position={[substation.lat, substation.lng]}
                eventHandlers={{
                  click: () => setSelectedSubstation(substation),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-lg">{substation.name}</h3>
                    <p className="text-sm text-gray-600">{substation.code}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{substation.voltageLevel} kV</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{substation.capacityMva} MVA</span>
                      </div>
                      {substation.activeEvents > 0 && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-600 font-medium">
                            {substation.activeEvents} Active Events
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>No Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>1-2 Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>3-5 Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>5+ Events</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeralaMap;
