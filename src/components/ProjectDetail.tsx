import React, { useState } from 'react';
import { ProjectUI as Project } from '../types/project-ui';
import { ProjectOverview } from './project/ProjectOverview';
import { InspirationBoard } from './project/InspirationBoard';
import { PlanningDetails } from './project/PlanningDetails';
import { ChecklistManager } from './project/ChecklistManager';
import { BudgetManager } from './project/BudgetManager';
import { ClientManager } from './project/ClientManager';
import { TeamManager } from './project/TeamManager';

interface ProjectDetailProps {
  project: Project;
  onUpdate: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

type TabType = 'overview' | 'inspiration' | 'planning' | 'team' | 'checklist' | 'budget' | 'client';

const tabs = [
  { id: 'overview', label: '项目概览', icon: '📋' },
  { id: 'inspiration', label: '灵感板', icon: '🎨' },
  { id: 'planning', label: '策划详情', icon: '📝' },
  { id: 'team', label: '团队协作', icon: '👥' },
  { id: 'checklist', label: '任务清单', icon: '✅' },
  { id: 'budget', label: '预算管理', icon: '💰' },
  { id: 'client', label: '客户信息', icon: '🤝' },
];

export function ProjectDetail({ project, onUpdate, onDelete }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProjectOverview project={project as any} onUpdate={onUpdate as any} onDelete={onDelete} />;
      case 'inspiration':
        return <InspirationBoard project={project as any} onUpdate={onUpdate as any} />;
      case 'planning':
        return <PlanningDetails project={project as any} onUpdate={onUpdate as any} />;
      case 'team':
        return <TeamManager project={project as any} onUpdate={onUpdate as any} />;
      case 'checklist':
        return <ChecklistManager project={project as any} onUpdate={onUpdate as any} />;
      case 'budget':
        return <BudgetManager project={project as any} onUpdate={onUpdate as any} />;
      case 'client':
        return <ClientManager project={project as any} onUpdate={onUpdate as any} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-400">{project.description}</p>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 px-6 py-4 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-gray-900 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}