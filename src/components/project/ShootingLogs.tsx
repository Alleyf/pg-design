import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Calendar, 
  MapPin, 
  Camera, 
  Settings, 
  Image, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle,
  Edit3,
  Save,
  Trash2
} from 'lucide-react';
import { Project, ShootingLog } from '../../types/project';

interface ShootingLogsProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

export function ShootingLogs({ project, onUpdate }: ShootingLogsProps) {
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [newLog, setNewLog] = useState<Partial<ShootingLog>>({
    session: '',
    location: '',
    weather: '',
    equipment: [],
    settings: {
      camera: '',
      lens: '',
      aperture: '',
      shutterSpeed: '',
      iso: 100,
      focalLength: ''
    },
    notes: '',
    challenges: [],
    solutions: [],
    lessonsLearned: [],
    images: {
      total: 0,
      keepers: 0,
      favorites: 0
    }
  });

  const handleAddLog = () => {
    if (!newLog.session || !newLog.location) return;

    const log: ShootingLog = {
      id: Date.now().toString(),
      date: new Date(),
      session: newLog.session,
      location: newLog.location,
      weather: newLog.weather || '',
      equipment: newLog.equipment || [],
      settings: newLog.settings || {
        camera: '',
        lens: '',
        aperture: '',
        shutterSpeed: '',
        iso: 100,
        focalLength: ''
      },
      notes: newLog.notes || '',
      challenges: newLog.challenges || [],
      solutions: newLog.solutions || [],
      lessonsLearned: newLog.lessonsLearned || [],
      images: newLog.images || {
        total: 0,
        keepers: 0,
        favorites: 0
      }
    };

    onUpdate({
      ...project,
      shootingLogs: [...(project.shootingLogs || []), log]
    });

    setNewLog({
      session: '',
      location: '',
      weather: '',
      equipment: [],
      settings: {
        camera: '',
        lens: '',
        aperture: '',
        shutterSpeed: '',
        iso: 100,
        focalLength: ''
      },
      notes: '',
      challenges: [],
      solutions: [],
      lessonsLearned: [],
      images: {
        total: 0,
        keepers: 0,
        favorites: 0
      }
    });
    setIsAddingLog(false);
  };

  const handleUpdateLog = (logId: string, updatedLog: ShootingLog) => {
    onUpdate({
      ...project,
      shootingLogs: (project.shootingLogs || []).map(log => 
        log.id === logId ? updatedLog : log
      )
    });
    setEditingLogId(null);
  };

  const handleDeleteLog = (logId: string) => {
    onUpdate({
      ...project,
      shootingLogs: (project.shootingLogs || []).filter(log => log.id !== logId)
    });
  };

  const addArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (item.trim()) {
      setter([...array, item.trim()]);
    }
  };

  const removeArrayItem = (array: string[], index: number, setter: (items: string[]) => void) => {
    setter(array.filter((_, i) => i !== index));
  };

  const getKeeperRate = (log: ShootingLog) => {
    if (log.images.total === 0) return 0;
    return Math.round((log.images.keepers / log.images.total) * 100);
  };

  const getFavoriteRate = (log: ShootingLog) => {
    if (log.images.total === 0) return 0;
    return Math.round((log.images.favorites / log.images.total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">拍摄日志</h3>
          <p className="text-gray-400">记录每次拍摄的详细信息和经验总结</p>
        </div>
        <button
          onClick={() => setIsAddingLog(true)}
          className="flex items-center space-x-2 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>添加日志</span>
        </button>
      </div>

      {/* 添加新日志表单 */}
      {isAddingLog && (
        <div className="bg-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">添加拍摄日志</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">拍摄场次 *</label>
                <input
                  type="text"
                  value={newLog.session || ''}
                  onChange={(e) => setNewLog(prev => ({ ...prev, session: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  placeholder="例如：第一场、外景拍摄等"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">拍摄地点 *</label>
                <input
                  type="text"
                  value={newLog.location || ''}
                  onChange={(e) => setNewLog(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  placeholder="具体拍摄位置"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">天气条件</label>
                <input
                  type="text"
                  value={newLog.weather || ''}
                  onChange={(e) => setNewLog(prev => ({ ...prev, weather: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  placeholder="晴天、阴天、雨天等"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">使用器材</label>
                <input
                  type="text"
                  value={newLog.equipment?.join(', ') || ''}
                  onChange={(e) => setNewLog(prev => ({ 
                    ...prev, 
                    equipment: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                  }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  placeholder="相机、镜头、配件等，用逗号分隔"
                />
              </div>
            </div>

            {/* 拍摄参数 */}
            <div className="bg-gray-600 rounded-lg p-4">
              <h5 className="text-md font-semibold mb-3 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>拍摄参数</span>
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">相机</label>
                  <input
                    type="text"
                    value={newLog.settings?.camera || ''}
                    onChange={(e) => setNewLog(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings!, camera: e.target.value }
                    }))}
                    className="w-full bg-gray-500 border border-gray-400 rounded px-2 py-1 text-white text-sm"
                    placeholder="相机型号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">镜头</label>
                  <input
                    type="text"
                    value={newLog.settings?.lens || ''}
                    onChange={(e) => setNewLog(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings!, lens: e.target.value }
                    }))}
                    className="w-full bg-gray-500 border border-gray-400 rounded px-2 py-1 text-white text-sm"
                    placeholder="镜头型号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">光圈</label>
                  <input
                    type="text"
                    value={newLog.settings?.aperture || ''}
                    onChange={(e) => setNewLog(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings!, aperture: e.target.value }
                    }))}
                    className="w-full bg-gray-500 border border-gray-400 rounded px-2 py-1 text-white text-sm"
                    placeholder="f/2.8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">快门</label>
                  <input
                    type="text"
                    value={newLog.settings?.shutterSpeed || ''}
                    onChange={(e) => setNewLog(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings!, shutterSpeed: e.target.value }
                    }))}
                    className="w-full bg-gray-500 border border-gray-400 rounded px-2 py-1 text-white text-sm"
                    placeholder="1/125s"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">ISO</label>
                  <input
                    type="number"
                    value={newLog.settings?.iso || 100}
                    onChange={(e) => setNewLog(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings!, iso: parseInt(e.target.value) || 100 }
                    }))}
                    className="w-full bg-gray-500 border border-gray-400 rounded px-2 py-1 text-white text-sm"
                    min="50"
                    max="25600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">焦距</label>
                  <input
                    type="text"
                    value={newLog.settings?.focalLength || ''}
                    onChange={(e) => setNewLog(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings!, focalLength: e.target.value }
                    }))}
                    className="w-full bg-gray-500 border border-gray-400 rounded px-2 py-1 text-white text-sm"
                    placeholder="50mm"
                  />
                </div>
              </div>
            </div>

            {/* 图片统计 */}
            <div className="bg-gray-600 rounded-lg p-4">
              <h5 className="text-md font-semibold mb-3 flex items-center space-x-2">
                <Image className="w-4 h-4" />
                <span>图片统计</span>
              </h5>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">总拍摄数</label>
                  <input
                    type="number"
                    value={newLog.images?.total || 0}
                    onChange={(e) => setNewLog(prev => ({ 
                      ...prev, 
                      images: { ...prev.images!, total: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full bg-gray-500 border border-gray-400 rounded px-2 py-1 text-white text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">保留数</label>
                  <input
                    type="number"
                    value={newLog.images?.keepers || 0}
                    onChange={(e) => setNewLog(prev => ({ 
                      ...prev, 
                      images: { ...prev.images!, keepers: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full bg-gray-500 border border-gray-400 rounded px-2 py-1 text-white text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">精选数</label>
                  <input
                    type="number"
                    value={newLog.images?.favorites || 0}
                    onChange={(e) => setNewLog(prev => ({ 
                      ...prev, 
                      images: { ...prev.images!, favorites: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full bg-gray-500 border border-gray-400 rounded px-2 py-1 text-white text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">拍摄笔记</label>
              <textarea
                value={newLog.notes || ''}
                onChange={(e) => setNewLog(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
                placeholder="记录拍摄过程中的观察和想法..."
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsAddingLog(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddLog}
                className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
              >
                添加日志
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 日志列表 */}
      <div className="space-y-4">
        {(project.shootingLogs || []).map((log) => (
          <div key={log.id} className="bg-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-500 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                  {log.session}
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{log.date.toLocaleDateString('zh-CN')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{log.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingLogId(log.id)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteLog(log.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-600 rounded-lg p-3">
                <div className="text-sm text-gray-400 mb-1">拍摄参数</div>
                <div className="text-sm text-white">
                  {log.settings.camera} + {log.settings.lens}
                </div>
                <div className="text-xs text-gray-400">
                  {log.settings.aperture} | {log.settings.shutterSpeed} | ISO {log.settings.iso}
                </div>
              </div>
              <div className="bg-gray-600 rounded-lg p-3">
                <div className="text-sm text-gray-400 mb-1">图片统计</div>
                <div className="text-sm text-white">
                  {log.images.total} 张拍摄
                </div>
                <div className="text-xs text-gray-400">
                  {log.images.keepers} 保留 ({getKeeperRate(log)}%) | {log.images.favorites} 精选 ({getFavoriteRate(log)}%)
                </div>
              </div>
              <div className="bg-gray-600 rounded-lg p-3">
                <div className="text-sm text-gray-400 mb-1">天气条件</div>
                <div className="text-sm text-white">{log.weather || '未记录'}</div>
              </div>
              <div className="bg-gray-600 rounded-lg p-3">
                <div className="text-sm text-gray-400 mb-1">使用器材</div>
                <div className="text-sm text-white">
                  {log.equipment.length > 0 ? log.equipment.join(', ') : '未记录'}
                </div>
              </div>
            </div>

            {log.notes && (
              <div className="bg-gray-600 rounded-lg p-4 mb-4">
                <h5 className="text-sm font-medium text-gray-300 mb-2">拍摄笔记</h5>
                <p className="text-white text-sm leading-relaxed">{log.notes}</p>
              </div>
            )}

            {(log.challenges.length > 0 || log.solutions.length > 0 || log.lessonsLearned.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {log.challenges.length > 0 && (
                  <div className="bg-red-900 bg-opacity-30 rounded-lg p-3">
                    <h6 className="text-sm font-medium text-red-300 mb-2 flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>遇到的挑战</span>
                    </h6>
                    <ul className="text-sm text-red-200 space-y-1">
                      {log.challenges.map((challenge, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-red-400">•</span>
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {log.solutions.length > 0 && (
                  <div className="bg-blue-900 bg-opacity-30 rounded-lg p-3">
                    <h6 className="text-sm font-medium text-blue-300 mb-2 flex items-center space-x-1">
                      <Lightbulb className="w-4 h-4" />
                      <span>解决方案</span>
                    </h6>
                    <ul className="text-sm text-blue-200 space-y-1">
                      {log.solutions.map((solution, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-400">•</span>
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {log.lessonsLearned.length > 0 && (
                  <div className="bg-green-900 bg-opacity-30 rounded-lg p-3">
                    <h6 className="text-sm font-medium text-green-300 mb-2 flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>经验总结</span>
                    </h6>
                    <ul className="text-sm text-green-200 space-y-1">
                      {log.lessonsLearned.map((lesson, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-400">•</span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {(project.shootingLogs || []).length === 0 && !isAddingLog && (
        <div className="text-center py-12 bg-gray-700 rounded-lg">
          <div className="mb-4">
            <Camera className="w-12 h-12 text-gray-500 mx-auto" />
          </div>
          <h4 className="text-lg font-medium mb-2">还没有拍摄日志</h4>
          <p className="text-gray-400 mb-6">开始记录你的拍摄经历，积累宝贵经验</p>
        </div>
      )}
    </div>
  );
}

