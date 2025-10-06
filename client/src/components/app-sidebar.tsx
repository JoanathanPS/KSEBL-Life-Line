import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Activity, 
  Zap, 
  MapPin, 
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Events', href: '/events', icon: AlertTriangle },
  { name: 'Waveforms', href: '/waveforms', icon: Activity },
  { name: 'Substations', href: '/substations', icon: Zap },
  { name: 'Feeders', href: '/feeders', icon: MapPin },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <img 
          src="/attached_assets/SIH P-1_LOGO_1759550517457.jpg" 
          alt="KSEBL Logo" 
          className="h-8 w-auto object-contain"
        />
        <div className="ml-3">
          <h1 className="text-lg font-semibold text-gray-900">KSEBL Life Line</h1>
          <p className="text-xs text-gray-500">Line Break Detection</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.fullName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role || 'User'}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}