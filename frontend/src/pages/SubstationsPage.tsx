import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Building2, Filter, Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Substation } from '../types';
import { substationsApi } from '../api/substations';

const SubstationsPage: React.FC = () => {
  const [substations, setSubstations] = useState<Substation[]>([]);
  const [filteredSubstations, setFilteredSubstations] = useState<Substation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubstation, setSelectedSubstation] = useState<Substation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    voltage: '',
  });

  useEffect(() => {
    loadSubstations();
  }, []);

  useEffect(() => {
    filterSubstations();
  }, [substations, searchTerm, filters]);

  const loadSubstations = async () => {
    try {
      setIsLoading(true);
      // Mock data for now
      const mockSubstations: Substation[] = [
        {
          id: 'sub-1',
          name: 'Thiruvananthapuram SS',
          location: { latitude: 10.8505, longitude: 76.2711, address: 'Thiruvananthapuram' },
          capacity: 50,
          voltage: 11,
          status: 'operational',
          lastInspection: '2024-01-01',
          nextInspection: '2024-04-01',
          feeders: [],
        },
        {
          id: 'sub-2',
          name: 'Kochi SS',
          location: { latitude: 9.9312, longitude: 76.2673, address: 'Kochi' },
          capacity: 75,
          voltage: 11,
          status: 'operational',
          lastInspection: '2024-01-05',
          nextInspection: '2024-04-05',
          feeders: [],
        },
        {
          id: 'sub-3',
          name: 'Kozhikode SS',
          location: { latitude: 11.2588, longitude: 75.7804, address: 'Kozhikode' },
          capacity: 100,
          voltage: 33,
          status: 'maintenance',
          lastInspection: '2024-01-10',
          nextInspection: '2024-04-10',
          feeders: [],
        },
      ];
      setSubstations(mockSubstations);
    } catch (error) {
      console.error('Failed to load substations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSubstations = () => {
    let filtered = substations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(substation =>
        substation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        substation.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(substation => substation.status === filters.status);
    }

    // Voltage filter
    if (filters.voltage) {
      filtered = filtered.filter(substation => substation.voltage.toString() === filters.voltage);
    }

    setFilteredSubstations(filtered);
  };

  const getStatusColor = (status: Substation['status']) => {
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

  const handleViewSubstation = (substation: Substation) => {
    setSelectedSubstation(substation);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Substations</h1>
          <p className="text-gray-600">Manage electrical substations</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Substation</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search substations..."
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
              <option value="11">11 kV</option>
              <option value="33">33 kV</option>
              <option value="132">132 kV</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Substations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Substations ({filteredSubstations.length})</span>
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
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity (MVA)</TableHead>
                  <TableHead>Voltage (kV)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Inspection</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubstations.map((substation) => (
                  <TableRow key={substation.id}>
                    <TableCell className="font-medium">{substation.name}</TableCell>
                    <TableCell>{substation.location.address}</TableCell>
                    <TableCell>{substation.capacity}</TableCell>
                    <TableCell>{substation.voltage}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(substation.status)}`}>
                        {substation.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(substation.lastInspection).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSubstation(substation)}
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

      {/* Substation Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Substation Details"
        size="lg"
      >
        {selectedSubstation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm">{selectedSubstation.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p className="text-sm">{selectedSubstation.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Capacity</label>
                <p className="text-sm">{selectedSubstation.capacity} MVA</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Voltage</label>
                <p className="text-sm">{selectedSubstation.voltage} kV</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Location</label>
              <p className="text-sm">{selectedSubstation.location.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Last Inspection</label>
                <p className="text-sm">{new Date(selectedSubstation.lastInspection).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Next Inspection</label>
                <p className="text-sm">{new Date(selectedSubstation.nextInspection).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubstationsPage;