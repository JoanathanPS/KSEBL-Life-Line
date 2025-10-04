import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { AlertTriangle, Clock, MapPin, Users } from 'lucide-react';
import { OutageEvent } from '../utils/mockData';
import { clsx } from 'clsx';

interface AlertPanelProps {
  events: OutageEvent[];
  className?: string;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ events, className }) => {
  const getSeverityColor = (severity: OutageEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-l-error-500 bg-error-50';
      case 'high':
        return 'border-l-warning-500 bg-warning-50';
      case 'medium':
        return 'border-l-primary-500 bg-primary-50';
      case 'low':
        return 'border-l-success-500 bg-success-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status: OutageEvent['status']) => {
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

  return (
    <Card className={clsx('h-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-warning-500" />
          <span>Active Alerts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No active alerts</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={clsx(
                'border-l-4 p-4 rounded-r-lg',
                getSeverityColor(event.severity)
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-sm">{event.type.replace('_', ' ').toUpperCase()}</h4>
                    <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(event.status))}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.district}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{event.affectedCustomers} customers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};