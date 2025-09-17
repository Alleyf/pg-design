import React, { useState } from 'react';
import { Calendar, MapPin, Clock, DollarSign, Users, CheckCircle, AlertTriangle, Edit } from 'lucide-react';
import { ProjectUI as Project } from '../../types/project-ui';
import { EditProjectModal } from './EditProjectModal';

interface ProjectOverviewProps {
  project: Project;
  onUpdate: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectOverview({ project, onUpdate, onDelete }: ProjectOverviewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const editModal = isEditModalOpen ? (
    <EditProjectModal
      project={project}
      onClose={() => setIsEditModalOpen(false)}
      onSave={(updatedProject) => {
        onUpdate(updatedProject);
        setIsEditModalOpen(false);
      }}
    />
  ) : null;
  const completedTasks = project.checklist?.filter(task => task.completed)?.length || 0;
  const totalTasks = project.checklist?.length || 0;
  const confirmedMembers = project.team?.filter(member => member.confirmed)?.length || 0;
  const totalMembers = project.team?.length || 0;
  const totalBudget = (project.budget || 0) + (project.team?.reduce((sum, member) => sum + (member.rate || 0), 0) || 0);
  const overdueTasks = project.checklist?.filter(task => 
    task.dueDate && new Date() > task.dueDate && !task.completed
  )?.length || 0;

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-500';
      case 'scheduled': return 'bg-amber-500';
      case 'in-progress': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const statusLabels = {
    planning: '策划中',
    scheduled: '已安排',
    'in-progress': '进行中',
    completed: '已完成',
  };

  return (
    <>
      {isEditModalOpen && (
        <EditProjectModal
          project={project}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedProject) => {
            onUpdate(updatedProject);
            setIsEditModalOpen(false);
          }}
        />
      )}
      <div className="space-y-6">
      {/* 项目状态卡片 */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="text-gray-400 hover:text-amber-400 transition-colors"
                title="编辑项目信息"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300">{project.description}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-4 py-2 rounded-full text-white font-medium ${getStatusColor(project.status)}`}>
              {statusLabels[project.status]}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {project.shootDate && (
            <div className="flex items-center space-x-2 text-gray-300">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-sm">{project.shootDate.toLocaleDateString('zh-CN')}</span>
            </div>
          )}
          {project.location && (
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-sm">{project.location}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-gray-300">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm">{project.shootingSettings.duration}小时</span>
          </div>
          {totalBudget > 0 && (
            <div className="flex items-center space-x-2 text-gray-300">
              <DollarSign className="w-4 h-4 text-purple-400" />
              <span className="text-sm">¥{totalBudget}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* 警告提醒 */}
      {overdueTasks > 0 && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 font-medium">
              有 {overdueTasks} 个任务已逾期，请及时处理
            </span>
          </div>
        </div>
      )}
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-600 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-amber-400 mb-2">
            {project.inspirationImages?.length || 0}
          </div>
          <div className="text-gray-300">灵感图片</div>
          <div className="text-xs text-gray-400 mt-1">收集的参考素材</div>
        </div>
        
        <div className="bg-gray-600 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {confirmedMembers}/{totalMembers}
          </div>
          <div className="text-gray-300">团队成员</div>
          <div className="text-xs text-gray-400 mt-1">已确认参与</div>
        </div>
        
        <div className="bg-gray-600 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {completedTasks}/{totalTasks}
          </div>
          <div className="text-gray-300">任务完成</div>
          <div className="text-xs text-gray-400 mt-1">策划进度</div>
        </div>
        
        <div className="bg-gray-600 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {project.equipment?.length || 0}
          </div>
          <div className="text-gray-300">器材设备</div>
          <div className="text-xs text-gray-400 mt-1">准备的设备</div>
        </div>
      </div>

      {/* 项目详情 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <span>🎯</span>
            <span>创作理念</span>
          </h4>
          {project.concept ? (
            <p className="text-gray-300 leading-relaxed">{project.concept}</p>
          ) : (
            <p className="text-gray-500 italic">暂未设置创作理念</p>
          )}
          
          {project.mood && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-400 mb-2">情绪与风格</h5>
              <p className="text-gray-300">{project.mood}</p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <span>📝</span>
            <span>项目备注</span>
          </h4>
          {project.notes ? (
            <p className="text-gray-300 leading-relaxed">{project.notes}</p>
          ) : (
            <p className="text-gray-500 italic">暂无备注</p>
          )}
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">快速操作</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => {/* 切换到灵感板 */}}
            className="bg-gray-600 hover:bg-gray-500 rounded-lg p-4 text-left transition-colors"
          >
            <div className="text-2xl mb-2">🎨</div>
            <div className="font-medium">添加灵感</div>
            <div className="text-xs text-gray-400">收集参考图片</div>
          </button>
          
          <button
            onClick={() => {/* 切换到团队管理 */}}
            className="bg-gray-600 hover:bg-gray-500 rounded-lg p-4 text-left transition-colors"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="font-medium">邀请团队</div>
            <div className="text-xs text-gray-400">添加团队成员</div>
          </button>
          
          <button
            onClick={() => {/* 切换到任务清单 */}}
            className="bg-gray-600 hover:bg-gray-500 rounded-lg p-4 text-left transition-colors"
          >
            <div className="text-2xl mb-2">✅</div>
            <div className="font-medium">创建任务</div>
            <div className="text-xs text-gray-400">添加准备事项</div>
          </button>
          
          <button
            onClick={() => {/* 切换到策划详情 */}}
            className="bg-gray-600 hover:bg-gray-500 rounded-lg p-4 text-left transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">完善策划</div>
            <div className="text-xs text-gray-400">设置拍摄详情</div>
          </button>
        </div>
      </div>

      {/* 项目进度总览 */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">项目进度</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">任务完成度</span>
            <span className="text-amber-400 font-medium">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">团队确认度</span>
            <span className="text-green-400 font-medium">{totalMembers > 0 ? Math.round((confirmedMembers / totalMembers) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalMembers > 0 ? (confirmedMembers / totalMembers) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* 项目检查清单 */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">项目检查</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
            <span className="text-gray-300">基本信息完整</span>
            <div className="flex items-center space-x-2">
              {project.title && project.description && project.location ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
            <span className="text-gray-300">团队成员确认</span>
            <div className="flex items-center space-x-2">
              {totalMembers > 0 && confirmedMembers === totalMembers ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : totalMembers > 0 ? (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
            <span className="text-gray-300">器材设备准备</span>
            <div className="flex items-center space-x-2">
              {project.equipment?.length > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
            <span className="text-gray-300">灵感素材收集</span>
            <div className="flex items-center space-x-2">
              {project.inspirationImages?.length >= 3 ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : project.inspirationImages?.length > 0 ? (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
      {isEditModalOpen && (
        <EditProjectModal
          project={project}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedProject) => {
            onUpdate(updatedProject);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </>
  );
}