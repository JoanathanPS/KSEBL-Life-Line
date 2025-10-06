import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, MapPin, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { eventsAPI } from '../api/client';
import { useAuth } from '../hooks/useAuth';

interface Event {
  id: string;
  detectedAt: string;
  confidenceScore: number;
  estimatedLocationKm: number;
  faultType: string;
  severity: string;
  status: string;
  breakerTripped: boolean;
  tripTimeMs: number;
  resolvedAt?: string;
  resolutionNotes?: string;
  feederName: string;
  feederCode: string;
  substationName: string;
  assignedUserName?: string;
}

const EventRow = ({ event, onAcknowledge, onResolve }: { 
  event: Event; 
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}) => {
  const severityColors = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };

  const statusColors = {
    detected: 'bg-red-100 text-red-800',
    acknowledged: 'bg-yellow-100 text-yellow-800',
    crew_dispatched: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <div>
            <div className="font-medium">{event.feederName}</div>
            <div className="text-sm text-gray-500">{event.substationName}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={severityColors[event.severity as keyof typeof severityColors]}>
          {event.severity}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={statusColors[event.status as keyof typeof statusColors]}>
          {event.status.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="h-4 w-4" />
          {event.estimatedLocationKm.toFixed(2)} km
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-4 w-4" />
          {new Date(event.detectedAt).toLocaleString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div>Confidence: {(event.confidenceScore * 100).toFixed(1)}%</div>
          <div className="text-gray-500">Trip: {event.tripTimeMs}ms</div>
        </div>
      </TableCell>
      <TableCell>
        {event.assignedUserName ? (
          <div className="flex items-center gap-1 text-sm">
            <User className="h-4 w-4" />
            {event.assignedUserName}
          </div>
        ) : (
          <span className="text-gray-500 text-sm">Unassigned</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {event.status === 'detected' && (
            <Button size="sm" onClick={() => onAcknowledge(event.id)}>
              Acknowledge
            </Button>
          )}
          {event.status === 'acknowledged' && (
            <Button size="sm" variant="outline" onClick={() => onResolve(event.id)}>
              Resolve
            </Button>
          )}
          <Button size="sm" variant="outline">
            View
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, [filters, pagination.page]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getEvents({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      
      setEvents(response.data.events);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
      }));
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (eventId: string) => {
    try {
      await eventsAPI.acknowledgeEvent(eventId);
      loadEvents(); // Refresh the list
    } catch (error) {
      console.error('Failed to acknowledge event:', error);
    }
  };

  const handleResolve = async (eventId: string) => {
    try {
      const notes = prompt('Enter resolution notes:');
      if (notes) {
        await eventsAPI.resolveEvent(eventId, notes);
        loadEvents(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to resolve event:', error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage line break events across Kerala
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {pagination.total} Total Events
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
              <Input
                placeholder="Search feeders or substations..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="detected">Detected</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="crew_dispatched">Crew Dispatched</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Severity</label>
              <Select value={filters.severity} onValueChange={(value) => handleFilterChange('severity', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={loadEvents} className="w-full">
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Line Break Events</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feeder</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Detected At</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <EventRow
                        key={event.id}
                        event={event}
                        onAcknowledge={handleAcknowledge}
                        onResolve={handleResolve}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No events found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} events
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}