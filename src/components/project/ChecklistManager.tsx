import React, { useState } from 'react';
import { Plus, X, Check, Clock, Calendar, AlertTriangle, Filter } from 'lucide-react';
import { Project, ChecklistItem } from '../../types/project';

interface ChecklistManagerProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

const priorities = [
  { value: 'high', label: '高优先级', color: 'text-red-400', bgColor: 'bg-red-900' },
  { value: 'medium', label: '中优先级', color: 'text-yellow-400', bgColor: 'bg-yellow-900' },
  { value: 'low', label: '低优先级', color: 'text-green-400', bgColor: 'bg-green-900' },
];

const taskCategories = [
  { value: 'equipment', label: '器材准备', icon: '📷' },
  { value: 'location', label: '场地安排', icon: '📍' },
  { value: 'team', label: '团队协调', icon: '👥' },
  { value: 'creative', label: '创意策划', icon: '🎨' },
  { value: 'logistics', label: '后勤保障', icon: '📋' },
  { value: 'other', label: '其他', icon: '📝' },
];

export function ChecklistManager({ project, onUpdate }: ChecklistManagerProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [newTask, setNewTask] = useState({
    task: '',
    dueDate: '',
    assignedTo: '',
    priority: 'medium' as ChecklistItem['priority'],
    category: 'other' as ChecklistItem['category'],
  });

  const handleAddTask = () => {
    if (!newTask.task.trim()) return;

    const task: ChecklistItem = {
      id: Date.now().toString(),
      task: newTask.task,
      completed: false,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      assignedTo: newTask.assignedTo || undefined,
      priority: newTask.priority,
      category: newTask.category,
    };

    onUpdate({
      ...project,
      checklist: [...project.checklist, task],
    });

    setNewTask({ task: '', dueDate: '', assignedTo: '', priority: 'medium', category: 'other' });
    setIsAddingTask(false);
  };

  const toggleTask = (taskId: string) => {
    onUpdate({
      ...project,
      checklist: project.checklist.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      ),
    });
  };

  const removeTask = (taskId: string) => {
    onUpdate({
      ...project,
      checklist: project.checklist.filter(task => task.id !== taskId),
    });
  };

  // 过滤任务
  const filteredTasks = project.checklist.filter(task => {
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesCompletion = showCompleted || !task.completed;
    return matchesPriority && matchesCategory && matchesCompletion;
  });

  const completedTasks = project.checklist.filter(task => task.completed).length;
  const totalTasks = project.checklist.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 预设任务模板
  const taskTemplates = [
    { task: '确认拍摄地点和时间', category: 'location', priority: 'high' },
    { task: '准备拍摄器材', category: 'equipment', priority: 'high' },
    { task: '确认模特档期', category: 'team', priority: 'high' },
    { task: '准备道具和服装', category: 'creative', priority: 'medium' },
    { task: '联系化妆师', category: 'team', priority: 'medium' },
    { task: '检查天气情况', category: 'logistics', priority: 'medium' },
    { task: '充电和准备存储卡', category: 'equipment', priority: 'high' },
    { task: '制定拍摄流程', category: 'creative', priority: 'medium' },
  ];

  const addTemplateTask = (template: typeof taskTemplates[0]) => {
    const task: ChecklistItem = {
      id: Date.now().toString(),
      task: template.task,
      completed: false,
      priority: template.priority as ChecklistItem['priority'],
      category: template.category as ChecklistItem['category'],
    };

    onUpdate({
      ...project,
      checklist: [...project.checklist, task],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">任务清单</h3>
          <p className="text-gray-400">跟踪拍摄前的准备工作</p>
        </div>
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center space-x-2 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>添加任务</span>
        </button>
      </div>

      {totalTasks > 0 && (
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">进度概览</h4>
            <span className="text-amber-400 font-medium">{completedTasks}/{totalTasks} 已完成</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div 
              className="bg-amber-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-gray-400">
            {completionRate}% 完成
          </div>
        </div>
      )}

      {/* 过滤器 */}
      {project.checklist.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">过滤：</span>
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-gray-600 border border-gray-500 rounded px-3 py-1 text-sm text-white"
            >
              <option value="all">全部优先级</option>
              {priorities.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-600 border border-gray-500 rounded px-3 py-1 text-sm text-white"
            >
              <option value="all">全部分类</option>
              {taskCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
              ))}
            </select>
            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="rounded"
              />
              <span>显示已完成</span>
            </label>
          </div>
        </div>
      )}

      {isAddingTask && (
        <div className="bg-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">添加新任务</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">任务描述 *</label>
              <input
                type="text"
                value={newTask.task}
                onChange={(e) => setNewTask(prev => ({ ...prev, task: e.target.value }))}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                placeholder="描述需要完成的任务..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">截止日期</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">负责人</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white"
                >
                  <option value="">选择负责人</option>
                  {project.team.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">优先级</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as ChecklistItem['priority'] }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white"
                >
                  {priorities.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">分类</label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value as ChecklistItem['category'] }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white"
                >
                  {taskCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsAddingTask(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddTask}
                className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
              >
                添加任务
              </button>
            </div>
          </div>
        </div>
      )}

      {project.checklist.length === 0 && !isAddingTask && (
        <div className="bg-gray-700 rounded-lg p-8 text-center">
          <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium mb-2">还没有任务清单</h4>
          <p className="text-gray-400 mb-6">使用预设模板快速创建任务，或添加自定义任务</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {taskTemplates.map((task, index) => (
              <button
                key={index}
                onClick={() => addTemplateTask(task)}
                className="text-xs bg-gray-600 text-gray-300 px-3 py-2 rounded hover:bg-gray-500 transition-colors text-left"
              >
                {task.task}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const priorityInfo = priorities.find(p => p.value === task.priority);
          const categoryInfo = taskCategories.find(c => c.value === task.category);
          const isOverdue = task.dueDate && new Date() > task.dueDate && !task.completed;
          
          return (
          <div
            key={task.id}
            className={`bg-gray-700 rounded-lg p-4 transition-all duration-200 border-l-4 ${
              task.completed ? 'bg-opacity-50 border-green-500' : 
              isOverdue ? 'border-red-500' :
              task.priority === 'high' ? 'border-red-400' :
              task.priority === 'medium' ? 'border-yellow-400' : 'border-green-400'
            }`}
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => toggleTask(task.id)}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-500 hover:border-gray-400'
                }`}
              >
                {task.completed && <Check className="w-3 h-3" />}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {task.task}
                    </span>
                    {isOverdue && (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center flex-wrap gap-2 mt-2 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${priorityInfo?.bgColor} ${priorityInfo?.color}`}>
                    {priorityInfo?.label}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-600 text-gray-300">
                    {categoryInfo?.icon} {categoryInfo?.label}
                  </span>
                  {task.dueDate && (
                    <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                      <Calendar className="w-3 h-3" />
                      <span>{task.dueDate.toLocaleDateString('zh-CN')}</span>
                    </div>
                  )}
                  {task.assignedTo && (
                    <div className="flex items-center space-x-1 text-gray-400">
                      <span>负责人:</span>
                      <span className="text-amber-400">{task.assignedTo}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>

      {filteredTasks.length === 0 && project.checklist.length > 0 && (
        <div className="text-center py-8 text-gray-400">
          <Clock className="w-8 h-8 mx-auto mb-2" />
          <p>没有找到匹配的任务</p>
        </div>
      )}
    </div>
  );
}