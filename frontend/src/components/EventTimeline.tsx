import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Event } from '../types';
import { clsx } from 'clsx';

interface EventTimelineProps {
  events: Event[];
  className?: string;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events, className }) => {
  const getStatusIcon = (status: Event['status']) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="h-4 w-4 text-error-500" />;
      case 'investigating':
        return <Clock className="h-4 w-4 text-warning-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-success-500" />;
      case 'false_alarm':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: Event['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-l-error-500';
      case 'high':
        return 'border-l-warning-500';
      case 'medium':
        return 'border-l-primary-500';
      case 'low':
        return 'border-l-success-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card className={clsx('h-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary-500" />
          <span>Event Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No events recorded</p>
            </div>
          ) : (
            sortedEvents.map((event, index) => (
              <div
                key={event.id}
                className={clsx(
                  'border-l-4 pl-4 pb-4',
                  getSeverityColor(event.severity),
                  index !== sortedEvents.length - 1 && 'border-b border-gray-100'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(event.status)}
                      <span className="font-medium text-sm">
                        {event.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        event.severity === 'critical' && 'bg-error-100 text-error-800',
                        event.severity === 'high' && 'bg-warning-100 text-warning-800',
                        event.severity === 'medium' && 'bg-primary-100 text-primary-800',
                        event.severity === 'low' && 'bg-success-100 text-success-800'
                      )}>
                        {event.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span>{event.location.address}</span>
                      <span>{event.affectedCustomers} customers affected</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};