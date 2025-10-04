import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { AlertTriangle, Filter, Search, Plus, Eye, Edit } from 'lucide-react';
import { Event } from '../types';
import { eventsApi } from '../api/events';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    type: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, filters]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      // Mock data for now
      const mockEvents: Event[] = [
        {
          id: '1',
          timestamp: '2024-01-15T10:30:00Z',
          location: { latitude: 10.8505, longitude: 76.2711, address: 'Thiruvananthapuram' },
          severity: 'high',
          status: 'active',
          type: 'line_break',
          description: 'LT line break detected in residential area',
          affectedCustomers: 45,
          substationId: 'sub-1',
          feederId: 'feed-1',
        },
        {
          id: '2',
          timestamp: '2024-01-15T09:15:00Z',
          location: { latitude: 9.9312, longitude: 76.2673, address: 'Kochi' },
          severity: 'medium',
          status: 'investigating',
          type: 'voltage_drop',
          description: 'Voltage drop in commercial area',
          affectedCustomers: 23,
          substationId: 'sub-2',
          feederId: 'feed-2',
        },
        {
          id: '3',
          timestamp: '2024-01-15T08:45:00Z',
          location: { latitude: 11.2588, longitude: 75.7804, address: 'Kozhikode' },
          severity: 'critical',
          status: 'resolved',
          type: 'power_outage',
          description: 'Complete power outage in industrial zone',
          affectedCustomers: 120,
          substationId: 'sub-3',
          feederId: 'feed-3',
        },
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(event => event.status === filters.status);
    }

    // Severity filter
    if (filters.severity) {
      filtered = filtered.filter(event => event.severity === filters.severity);
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(event => event.type === filters.type);
    }

    setFilteredEvents(filtered);
  };

  const getSeverityColor = (severity: Event['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-error-100 text-error-800';
      case 'high':
        return 'bg-warning-100 text-warning-800';
      case 'medium':
        return 'bg-primary-100 text-primary-800';
      case 'low':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'active':
        return 'bg-error-100 text-error-800';
      case 'investigating':
        return 'bg-warning-100 text-warning-800';
      case 'resolved':
        return 'bg-success-100 text-success-800';
      case 'false_alarm':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Monitor and manage system events</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Event</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
            <select
              className="input"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="false_alarm">False Alarm</option>
            </select>
            <select
              className="input"
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
            >
              <option value="">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              className="input"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">All Types</option>
              <option value="line_break">Line Break</option>
              <option value="voltage_drop">Voltage Drop</option>
              <option value="power_outage">Power Outage</option>
              <option value="equipment_failure">Equipment Failure</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Events ({filteredEvents.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Affected Customers</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      {event.type.replace('_', ' ').toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </TableCell>
                    <TableCell>{event.location.address}</TableCell>
                    <TableCell>{event.affectedCustomers}</TableCell>
                    <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewEvent(event)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Event Details"
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <p className="text-sm">{selectedEvent.type.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Severity</label>
                <p className="text-sm">{selectedEvent.severity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p className="text-sm">{selectedEvent.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Affected Customers</label>
                <p className="text-sm">{selectedEvent.affectedCustomers}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-sm">{selectedEvent.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Location</label>
              <p className="text-sm">{selectedEvent.location.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Timestamp</label>
              <p className="text-sm">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventsPage;