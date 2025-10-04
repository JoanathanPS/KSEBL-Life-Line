import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Event } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export const useRealTimeData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Subscribe to events table changes
    const eventsSubscription = supabase
      .channel('events')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'events' 
        }, 
        (payload) => {
          console.log('Event change received:', payload);
          // Handle real-time updates here
          // This would typically update the events state
        }
      )
      .subscribe((status) => {
        console.log('Supabase subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      eventsSubscription.unsubscribe();
    };
  }, []);

  return {
    events,
    isConnected,
  };
};