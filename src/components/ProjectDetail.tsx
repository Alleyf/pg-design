import React, { useState, useRef } from 'react';
import { Share2, Download, FileText, Image } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Project } from '../types/project';
import { ProjectOverview } from './project/ProjectOverview';
import { InspirationBoard } from './project/InspirationBoard';
import { PlanningDetails } from './project/PlanningDetails';
import { EnhancedPlanningDetails } from './project/EnhancedPlanningDetails';
import { EnhancedEquipmentManager } from './project/EnhancedEquipmentManager';
import { ShootingLogs } from './project/ShootingLogs';
import { PostProduction } from './project/PostProduction';
import { PhotographyTemplates } from './project/PhotographyTemplates';
import { ChecklistManager } from './project/ChecklistManager';
import { BudgetManager } from './project/BudgetManager';
import { ClientManager } from './project/ClientManager';
import { TeamManager } from './project/TeamManager';

interface ProjectDetailProps {
  project: Project;
  onUpdate: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

type TabType = 'overview' | 'inspiration' | 'planning' | 'enhanced-planning' | 'equipment' | 'shooting-logs' | 'post-production' | 'templates' | 'team' | 'checklist' | 'budget' | 'client';

const tabs = [
  { id: 'overview', label: '项目概览', icon: '📋' },
  { id: 'inspiration', label: '灵感板', icon: '🎨' },
  { id: 'planning', label: '基础策划', icon: '📝' },
  { id: 'enhanced-planning', label: '增强规划', icon: '⚡' },
  { id: 'equipment', label: '器材管理', icon: '📷' },
  { id: 'shooting-logs', label: '拍摄日志', icon: '📷' },
  { id: 'post-production', label: '后期制作', icon: '🎬' },
  { id: 'templates', label: '摄影模板', icon: '📋' },
  { id: 'team', label: '团队协作', icon: '👥' },
  { id: 'checklist', label: '任务清单', icon: '✅' },
  { id: 'budget', label: '预算管理', icon: '💰' },
  { id: 'client', label: '客户信息', icon: '🤝' },
];

export function ProjectDetail({ project, onUpdate, onDelete }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const projectContentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!projectContentRef.current) return;
    
    try {
      const canvas = await html2canvas(projectContentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#1f2937'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${project.title}-项目详情.pdf`);
    } catch (error) {
      console.error('PDF导出失败:', error);
      alert('PDF导出失败，请重试');
    }
  };

  const handleExportImage = async () => {
    if (!projectContentRef.current) return;
    
    try {
      const canvas = await html2canvas(projectContentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#1f2937'
      });
      
      const link = document.createElement('a');
      link.download = `${project.title}-项目详情.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('图片导出失败:', error);
      alert('图片导出失败，请重试');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProjectOverview project={project} onUpdate={onUpdate} onDelete={onDelete} />;
      case 'inspiration':
        return <InspirationBoard project={project} onUpdate={onUpdate} />;
      case 'planning':
        return <PlanningDetails project={project} onUpdate={onUpdate} />;
      case 'enhanced-planning':
        return <EnhancedPlanningDetails project={project} onUpdate={onUpdate} />;
      case 'equipment':
        return <EnhancedEquipmentManager project={project} onUpdate={onUpdate} />;
      case 'shooting-logs':
        return <ShootingLogs project={project} onUpdate={onUpdate} />;
      case 'post-production':
        return <PostProduction project={project} onUpdate={onUpdate} />;
      case 'templates':
        return <PhotographyTemplates project={project} onUpdate={onUpdate} />;
      case 'team':
        return <TeamManager project={project} onUpdate={onUpdate} />;
      case 'checklist':
        return <ChecklistManager project={project} onUpdate={onUpdate} />;
      case 'budget':
        return <BudgetManager project={project} onUpdate={onUpdate} />;
      case 'client':
        return <ClientManager project={project} onUpdate={onUpdate} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-gray-400">{project.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              title="导出PDF"
            >
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={handleExportImage}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              title="导出图片"
            >
              <Image className="w-4 h-4" />
              <span>图片</span>
            </button>
            <button
              onClick={async () => {
                const summary = `${project.title}（${project.type}）\n时间：${project.shootDate ? project.shootDate.toLocaleDateString('zh-CN') : '待定'}\n地点：${project.location || '待定'}\n团队：${project.team.length} 人\n预算：${project.budget ?? 0}`;
                const shareData: ShareData = {
                  title: project.title,
                  text: summary,
                };
                try {
                  if (navigator.share) {
                    await navigator.share(shareData);
                  } else if (navigator.clipboard) {
                    await navigator.clipboard.writeText(JSON.stringify(project, null, 2));
                    alert('已将项目信息复制到剪贴板');
                  } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = JSON.stringify(project);
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    alert('已复制项目JSON');
                  }
                } catch (e) {
                  console.error(e);
                  alert('分享失败，请重试');
                }
              }}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              title="分享项目"
            >
              <Share2 className="w-4 h-4" />
              <span>分享</span>
            </button>
          </div>
        </div>
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

        <div className="p-6" ref={projectContentRef}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}