import React, { useEffect, useState } from 'react';
import { ProjectService } from '../lib/database/project';
import { Calendar, MapPin, Users, Camera, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void; // 添加这个属性
}

const projectTypeIcons = {
  portrait: Users,
  landscape: Camera,
  product: Camera,
  wedding: Users,
  event: Calendar,
  commercial: Camera,
  other: Camera,
};

const statusColors = {
  planning: 'bg-blue-500',
  scheduled: 'bg-amber-500',
  'in-progress': 'bg-green-500',
  completed: 'bg-gray-500',
};

const statusLabels = {
  planning: '策划中',
  scheduled: '已安排',
  'in-progress': '进行中',
  completed: '已完成',
};

export const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject, onDeleteProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('获取项目列表失败:', error);
      }
    };
    
    fetchProjects();
  }, []);
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Camera className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">开始你的第一个摄影项目</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          创建专业的拍摄策划，收集灵感，与团队协作，让每次拍摄都更加完美
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">我的摄影项目</h2>
        <div className="text-sm text-gray-400">
          共 {projects.length} 个项目
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const IconComponent = projectTypeIcons[project.type];
          const completedTasks = project.checklist.filter(task => task.completed).length;
          const totalTasks = project.checklist.length;
          const overdueTasks = project.checklist.filter(task => 
            task.due_date && new Date() > new Date(task.due_date) && !task.completed
          ).length;
          const totalBudget = (project.budget || 0) + project.team.reduce((sum, member) => sum + (member.rate || 0), 0);
          
          return (
            <div 
              key={project.id}
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-200 cursor-pointer hover:scale-105 border border-gray-700 hover:border-gray-600"
              onClick={() => onSelectProject(project)}
              style={{ transition: 'all 0.3s ease' }}
            >
              {/* 封面图 */}
              {project.cover_image && (
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={project.cover_image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`确定要删除项目"${project.title}"吗？此操作不可恢复！`)) {
                        onDeleteProject(project.id);
                        alert(`项目 \"${project.title}\" 已成功删除`);
                      }
                    }}
                    className="absolute top-2 right-2 p-1 bg-gray-900/80 hover:bg-red-900/80 rounded-full text-gray-400 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="删除项目"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* 无封面图时的顶部 */}
              {!project.cover_image && (
                <div className="flex items-start justify-between p-4 pb-2">
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <IconComponent className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[project.status]}`}>
                      {statusLabels[project.status]}
                    </span>
                    {overdueTasks > 0 && (
                      <div className="flex items-center space-x-1 text-red-400">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-xs">{overdueTasks}个逾期</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* 内容区域 */}
              <div className={project.cover_image ? 'p-4' : 'px-4 pb-4'}>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="space-y-2">
                  {project.shoot_date && (
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.shoot_date).toLocaleDateString('zh-CN')}</span>
                      {project.shooting_duration && (
                        <>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{project.shooting_duration}h</span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location || '待定'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{project.team.length} 位团队成员</span>
                  </div>
                  {totalBudget > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <DollarSign className="w-4 h-4" />
                      <span>¥{totalBudget}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>更新于 {new Date(project.updated_at).toLocaleDateString('zh-CN')}</span>
                    <span>{project.inspiration_images?.length || 0} 张灵感图</span>
                  </div>
                  {totalTasks > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">任务进度</span>
                      <span className="text-amber-400 font-medium">{completedTasks}/{totalTasks}</span>
                    </div>
                  )}
                  {totalTasks > 0 && (
                    <div className="w-full bg-gray-600 rounded-full h-1 mt-2">
                      <div 
                        className="bg-amber-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}