import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Zap, Activity, AlertTriangle } from 'lucide-react';
import { substationsAPI } from '../api/client';

interface Substation {
  id: string;
  name: string;
  code: string;
  locationLat: number;
  locationLng: number;
  voltageLevel: string;
  capacityMva: number;
  isActive: boolean;
  activeEvents: number;
}

export default function SubstationsPage() {
  const [substations, setSubstations] = useState<Substation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubstations();
  }, []);

  const loadSubstations = async () => {
    try {
      setLoading(true);
      const response = await substationsAPI.getSubstations();
      setSubstations(response.data);
    } catch (error) {
      console.error('Failed to load substations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-muted-foreground">Loading substations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Substations</h1>
          <p className="text-gray-600 mt-1">
            Monitor electrical substations across Kerala
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {substations.length} Total Substations
          </Badge>
        </div>
      </div>

      {/* Substations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {substations.map((substation) => (
          <Card key={substation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{substation.name}</CardTitle>
                <Badge
                  className={
                    substation.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {substation.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{substation.code}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>
                    {substation.locationLat.toFixed(4)}, {substation.locationLng.toFixed(4)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-gray-500" />
                  <span>{substation.voltageLevel} kV</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <span>{substation.capacityMva} MVA</span>
                </div>

                {substation.activeEvents > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600 font-medium">
                      {substation.activeEvents} Active Events
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <Button size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}