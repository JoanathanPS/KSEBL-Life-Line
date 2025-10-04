import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Zap, Filter, Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Feeder } from '../types';
import { feedersApi } from '../api/feeders';

const FeedersPage: React.FC = () => {
  const [feeders, setFeeders] = useState<Feeder[]>([]);
  const [filteredFeeders, setFilteredFeeders] = useState<Feeder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeeder, setSelectedFeeder] = useState<Feeder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    voltage: '',
    substationId: '',
  });

  useEffect(() => {
    loadFeeders();
  }, []);

  useEffect(() => {
    filterFeeders();
  }, [feeders, searchTerm, filters]);

  const loadFeeders = async () => {
    try {
      setIsLoading(true);
      // Mock data for now
      const mockFeeders: Feeder[] = [
        {
          id: 'feed-1',
          name: 'TVM-FEEDER-01',
          substationId: 'sub-1',
          capacity: 25,
          voltage: 0.4,
          status: 'operational',
          length: 5.2,
          customers: 150,
          lastMaintenance: '2024-01-10',
        },
        {
          id: 'feed-2',
          name: 'KOCHI-FEEDER-02',
          substationId: 'sub-2',
          capacity: 30,
          voltage: 0.4,
          status: 'operational',
          length: 6.8,
          customers: 200,
          lastMaintenance: '2024-01-12',
        },
        {
          id: 'feed-3',
          name: 'KOZ-FEEDER-03',
          substationId: 'sub-3',
          capacity: 40,
          voltage: 0.4,
          status: 'maintenance',
          length: 8.5,
          customers: 300,
          lastMaintenance: '2024-01-15',
        },
      ];
      setFeeders(mockFeeders);
    } catch (error) {
      console.error('Failed to load feeders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterFeeders = () => {
    let filtered = feeders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(feeder =>
        feeder.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(feeder => feeder.status === filters.status);
    }

    // Voltage filter
    if (filters.voltage) {
      filtered = filtered.filter(feeder => feeder.voltage.toString() === filters.voltage);
    }

    // Substation filter
    if (filters.substationId) {
      filtered = filtered.filter(feeder => feeder.substationId === filters.substationId);
    }

    setFilteredFeeders(filtered);
  };

  const getStatusColor = (status: Feeder['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-success-100 text-success-800';
      case 'maintenance':
        return 'bg-warning-100 text-warning-800';
      case 'fault':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewFeeder = (feeder: Feeder) => {
    setSelectedFeeder(feeder);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feeders</h1>
          <p className="text-gray-600">Manage electrical feeders</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Feeder</span>
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
              placeholder="Search feeders..."
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
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="fault">Fault</option>
            </select>
            <select
              className="input"
              value={filters.voltage}
              onChange={(e) => setFilters(prev => ({ ...prev, voltage: e.target.value }))}
            >
              <option value="">All Voltages</option>
              <option value="0.4">0.4 kV</option>
              <option value="11">11 kV</option>
            </select>
            <select
              className="input"
              value={filters.substationId}
              onChange={(e) => setFilters(prev => ({ ...prev, substationId: e.target.value }))}
            >
              <option value="">All Substations</option>
              <option value="sub-1">Thiruvananthapuram SS</option>
              <option value="sub-2">Kochi SS</option>
              <option value="sub-3">Kozhikode SS</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Feeders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Feeders ({filteredFeeders.length})</span>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Substation</TableHead>
                  <TableHead>Capacity (MVA)</TableHead>
                  <TableHead>Voltage (kV)</TableHead>
                  <TableHead>Length (km)</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeeders.map((feeder) => (
                  <TableRow key={feeder.id}>
                    <TableCell className="font-medium">{feeder.name}</TableCell>
                    <TableCell>{feeder.substationId}</TableCell>
                    <TableCell>{feeder.capacity}</TableCell>
                    <TableCell>{feeder.voltage}</TableCell>
                    <TableCell>{feeder.length}</TableCell>
                    <TableCell>{feeder.customers}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feeder.status)}`}>
                        {feeder.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewFeeder(feeder)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Feeder Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Feeder Details"
        size="lg"
      >
        {selectedFeeder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm">{selectedFeeder.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p className="text-sm">{selectedFeeder.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Capacity</label>
                <p className="text-sm">{selectedFeeder.capacity} MVA</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Voltage</label>
                <p className="text-sm">{selectedFeeder.voltage} kV</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Length</label>
                <p className="text-sm">{selectedFeeder.length} km</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Customers</label>
                <p className="text-sm">{selectedFeeder.customers}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Substation ID</label>
              <p className="text-sm">{selectedFeeder.substationId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Maintenance</label>
              <p className="text-sm">{new Date(selectedFeeder.lastMaintenance).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeedersPage;