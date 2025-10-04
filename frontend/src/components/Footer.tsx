import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="h-6 w-6 rounded bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">KL</span>
            </div>
            <span className="text-sm text-gray-600">
              Kerala LT Line Break Detection System
            </span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>© 2024 Kerala State Electricity Board</span>
            <span>Version 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};