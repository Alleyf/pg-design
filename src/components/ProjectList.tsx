import React from 'react';
import { Calendar, MapPin, Users, Camera, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
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

export function ProjectList({ projects, onSelectProject, onCreateProject }: ProjectListProps) {
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
        <button
          onClick={onCreateProject}
          className="bg-amber-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-amber-400 transition-colors font-medium"
        >
          创建新项目
        </button>
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
            task.dueDate && new Date() > task.dueDate && !task.completed
          ).length;
          const totalBudget = (project.budget || 0) + project.team.reduce((sum, member) => sum + (member.rate || 0), 0);
          
          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-200 cursor-pointer hover:scale-105 border border-gray-700 hover:border-gray-600"
            >
              {/* 封面图 */}
              {project.coverImage && (
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={project.coverImage} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <div className="bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg">
                      <IconComponent className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[project.status]} backdrop-blur-sm`}>
                      {statusLabels[project.status]}
                    </span>
                  </div>
                  {overdueTasks > 0 && (
                    <div className="absolute bottom-3 right-3 flex items-center space-x-1 text-red-400 bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="text-xs">{overdueTasks}个逾期</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* 无封面图时的顶部 */}
              {!project.coverImage && (
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
              <div className={project.coverImage ? 'p-4' : 'px-4 pb-4'}>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="space-y-2">
                  {project.shootDate && (
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{project.shootDate.toLocaleDateString('zh-CN')}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{project.shootingSettings.duration}h</span>
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
                    <span>更新于 {project.updatedAt.toLocaleDateString('zh-CN')}</span>
                    <span>{project.inspirationImages.length} 张灵感图</span>
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