import React from 'react';
import { Calendar, MapPin, Users, Camera, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void; // 添加这个属性
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

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject, onDeleteProject, onCreateProject }) => {
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
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-200 cursor-pointer hover:scale-105 border border-gray-700 hover:border-gray-600"
              onClick={() => onSelectProject(project)}
              style={{ transition: 'all 0.3s ease' }}
            >
              {/* 封面图 */}
              {project.coverImage && (
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={project.coverImage} 
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
                  {/* 分享单个项目 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const summary = `${project.title}（${project.type}）\n时间：${project.shootDate ? project.shootDate.toLocaleDateString('zh-CN') : '待定'}\n地点：${project.location || '待定'}\n团队：${project.team.length} 人\n预算：${project.budget ?? 0}`;
                      const text = summary + '\n\n' + JSON.stringify(project, null, 2);
                      const shareData: ShareData = { title: project.title, text };
                      if (navigator.share) {
                        navigator.share(shareData).catch(() => {});
                      } else if (navigator.clipboard) {
                        navigator.clipboard.writeText(text).then(() => alert('已复制项目信息')).catch(() => {});
                      }
                    }}
                    className="absolute top-2 right-10 p-1 bg-gray-900/80 hover:bg-gray-800 rounded-full text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                    title="分享项目"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v-2a4 4 0 0 1 4-4h1"/>
                      <path d="M20 12v2a4 4 0 0 1-4 4h-1"/>
                      <polyline points="16 6 21 6 21 11"/>
                      <polyline points="8 18 3 18 3 13"/>
                    </svg>
                  </button>
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