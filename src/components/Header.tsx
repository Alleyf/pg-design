import React from 'react';
import { Camera, Plus, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onCreateProject: () => void;
  onBackToProjects?: () => void;
}

export function Header({ onCreateProject, onBackToProjects }: HeaderProps) {
  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBackToProjects && (
              <button
                onClick={onBackToProjects}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>返回项目</span>
              </button>
            )}
            <div className="flex items-center space-x-3">
              <div className="bg-amber-500 p-2 rounded-lg">
                <Camera className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold">PhotoDesign</h1>
                <p className="text-sm text-gray-400">专业摄影策划工具</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={onCreateProject}
            className="flex items-center space-x-2 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>新建项目</span>
          </button>
        </div>
      </div>
    </header>
  );
}