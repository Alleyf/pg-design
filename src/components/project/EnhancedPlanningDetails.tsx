import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Palette, 
  Package, 
  Users, 
  Plus, 
  X, 
  Clock, 
  MapPin, 
  Edit3, 
  Sun, 
  Cloud, 
  Wind, 
  Thermometer,
  Navigation,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Project, Equipment, ShootingSettings } from '../../types/project';

interface EnhancedPlanningDetailsProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

export function EnhancedPlanningDetails({ project, onUpdate }: EnhancedPlanningDetailsProps) {
  const [newEquipment, setNewEquipment] = useState('');
  const [newProp, setNewProp] = useState('');
  const [newWardrobeItem, setNewWardrobeItem] = useState('');
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [settings, setSettings] = useState(project.shootingSettings);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // 计算黄金时间
  const calculateGoldenHour = (date: Date) => {
    // 简化的黄金时间计算（实际应用中需要更精确的天文计算）
    const hour = date.getHours();
    const isMorning = hour >= 6 && hour <= 8;
    const isEvening = hour >= 17 && hour <= 19;
    
    return {
      isGoldenHour: isMorning || isEvening,
      type: isMorning ? 'morning' : isEvening ? 'evening' : 'none',
      recommendation: isMorning ? '晨光拍摄' : isEvening ? '夕阳拍摄' : '建议调整时间到黄金时段'
    };
  };

  // 获取天气信息（模拟API调用）
  const fetchWeatherData = async (location: string) => {
    setIsLoadingWeather(true);
    try {
      // 这里应该调用真实的天气API
      // 模拟数据
      const mockWeather = {
        temperature: 22,
        condition: '晴天',
        humidity: 65,
        windSpeed: 12,
        goldenHour: calculateGoldenHour(project.shootDate || new Date())
      };
      setWeatherData(mockWeather);
    } catch (error) {
      console.error('获取天气数据失败:', error);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    if (project.location && project.shootDate) {
      fetchWeatherData(project.location);
    }
  }, [project.location, project.shootDate]);

  const addEquipment = () => {
    if (!newEquipment.trim()) return;
    
    const equipment: Equipment = {
      id: Date.now().toString(),
      name: newEquipment,
      type: 'camera',
      isRequired: true,
      condition: 'good',
    };

    onUpdate({
      ...project,
      equipment: [...project.equipment, equipment],
    });
    setNewEquipment('');
  };

  const removeEquipment = (equipmentId: string) => {
    onUpdate({
      ...project,
      equipment: project.equipment.filter(e => e.id !== equipmentId),
    });
  };

  const addProp = () => {
    if (!newProp.trim()) return;
    
    onUpdate({
      ...project,
      props: [...project.props, newProp],
    });
    setNewProp('');
  };

  const removeProp = (index: number) => {
    onUpdate({
      ...project,
      props: project.props.filter((_, i) => i !== index),
    });
  };

  const addWardrobeItem = () => {
    if (!newWardrobeItem.trim()) return;
    
    onUpdate({
      ...project,
      wardrobe: [...project.wardrobe, newWardrobeItem],
    });
    setNewWardrobeItem('');
  };

  const removeWardrobeItem = (index: number) => {
    onUpdate({
      ...project,
      wardrobe: project.wardrobe.filter((_, i) => i !== index),
    });
  };

  const handleSaveSettings = () => {
    onUpdate({
      ...project,
      shootingSettings: settings,
    });
    setIsEditingSettings(false);
  };

  const addSpecialRequirement = (requirement: string) => {
    if (!requirement.trim()) return;
    setSettings(prev => ({
      ...prev,
      specialRequirements: [...prev.specialRequirements, requirement],
    }));
  };

  const removeSpecialRequirement = (index: number) => {
    setSettings(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.filter((_, i) => i !== index),
    }));
  };

  const getEquipmentTypeIcon = (type: Equipment['type']) => {
    switch (type) {
      case 'camera': return '📷';
      case 'lens': return '🔍';
      case 'lighting': return '💡';
      case 'tripod': return '📐';
      case 'filter': return '🎨';
      case 'memory': return '💾';
      case 'battery': return '🔋';
      default: return '📦';
    }
  };

  const getConditionColor = (condition: Equipment['condition']) => {
    switch (condition) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">增强拍摄规划</h3>
        
        {/* 天气和黄金时间信息 */}
        {weatherData && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cloud className="w-6 h-6 text-white" />
                <h4 className="text-xl font-semibold text-white">天气与拍摄条件</h4>
              </div>
              <button
                onClick={() => fetchWeatherData(project.location)}
                disabled={isLoadingWeather}
                className="text-white hover:text-gray-200 transition-colors"
              >
                {isLoadingWeather ? '更新中...' : '刷新'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                <Thermometer className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{weatherData.temperature}°C</div>
                <div className="text-sm text-gray-200">温度</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                <Cloud className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-lg font-semibold text-white">{weatherData.condition}</div>
                <div className="text-sm text-gray-200">天气</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                <Wind className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-lg font-semibold text-white">{weatherData.windSpeed} km/h</div>
                <div className="text-sm text-gray-200">风速</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                <div className="text-lg font-semibold text-white">{weatherData.humidity}%</div>
                <div className="text-sm text-gray-200">湿度</div>
              </div>
            </div>

            {/* 黄金时间建议 */}
            <div className={`rounded-lg p-4 ${
              weatherData.goldenHour.isGoldenHour 
                ? 'bg-green-500 bg-opacity-30 border border-green-400' 
                : 'bg-yellow-500 bg-opacity-30 border border-yellow-400'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <Sun className="w-5 h-5 text-white" />
                <span className="font-semibold text-white">黄金时间建议</span>
              </div>
              <p className="text-white">
                {weatherData.goldenHour.recommendation}
                {weatherData.goldenHour.isGoldenHour && (
                  <span className="ml-2 text-green-200">✓ 当前是理想拍摄时间</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* 拍摄设置 */}
        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h4 className="text-lg font-semibold">拍摄设置</h4>
            </div>
            <button
              onClick={() => setIsEditingSettings(!isEditingSettings)}
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditingSettings ? '取消' : '编辑'}</span>
            </button>
          </div>
          
          {isEditingSettings ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">拍摄时长 (小时)</label>
                  <input
                    type="number"
                    value={settings.duration}
                    onChange={(e) => setSettings(prev => ({ ...prev, duration: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                    min="0.5"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">开始时间</label>
                  <input
                    type="time"
                    value={settings.startTime || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">结束时间</label>
                  <input
                    type="time"
                    value={settings.endTime || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">天气要求</label>
                <input
                  type="text"
                  value={settings.weatherRequirement || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, weatherRequirement: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                  placeholder="例如：晴天、阴天、雨天等"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">备用方案</label>
                <textarea
                  value={settings.backupPlan || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, backupPlan: e.target.value }))}
                  rows={2}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
                  placeholder="如果天气不佳或其他突发情况的备用计划..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors"
                >
                  保存设置
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-600 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">拍摄时长</div>
                <div className="text-lg font-semibold">{settings.duration} 小时</div>
              </div>
              {settings.startTime && (
                <div className="bg-gray-600 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">时间安排</div>
                  <div className="text-lg font-semibold">
                    {settings.startTime} - {settings.endTime || '待定'}
                  </div>
                </div>
              )}
              {settings.weatherRequirement && (
                <div className="bg-gray-600 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">天气要求</div>
                  <div className="text-lg font-semibold">{settings.weatherRequirement}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 增强器材设备管理 */}
        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Camera className="w-5 h-5 text-amber-400" />
            <h4 className="text-lg font-semibold">器材设备管理</h4>
          </div>
          
          <div className="space-y-3">
            {project.equipment.map((equipment) => (
              <div key={equipment.id} className="bg-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getEquipmentTypeIcon(equipment.type)}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{equipment.name}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          equipment.isRequired ? 'bg-red-900 text-red-300' : 'bg-gray-500 text-gray-300'
                        }`}>
                          {equipment.isRequired ? '必需' : '可选'}
                        </span>
                        {equipment.condition && (
                          <span className={`px-2 py-1 rounded text-xs ${
                            equipment.condition === 'excellent' ? 'bg-green-900 text-green-300' :
                            equipment.condition === 'good' ? 'bg-blue-900 text-blue-300' :
                            equipment.condition === 'fair' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-red-900 text-red-300'
                          }`}>
                            {equipment.condition === 'excellent' ? '优秀' :
                             equipment.condition === 'good' ? '良好' :
                             equipment.condition === 'fair' ? '一般' : '较差'}
                          </span>
                        )}
                      </div>
                      {equipment.brand && equipment.model && (
                        <div className="text-sm text-gray-400">
                          {equipment.brand} {equipment.model}
                        </div>
                      )}
                      {equipment.notes && (
                        <div className="text-sm text-gray-300 mt-1">{equipment.notes}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeEquipment(equipment.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addEquipment()}
                className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                placeholder="添加器材设备..."
              />
              <button
                onClick={addEquipment}
                className="bg-amber-500 text-gray-900 p-2 rounded-lg hover:bg-amber-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 道具 */}
        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Package className="w-5 h-5 text-green-400" />
            <h4 className="text-lg font-semibold">道具清单</h4>
          </div>
          
          <div className="space-y-3">
            {project.props.map((prop, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-600 rounded-lg p-3">
                <span className="text-white">{prop}</span>
                <button
                  onClick={() => removeProp(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newProp}
                onChange={(e) => setNewProp(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addProp()}
                className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                placeholder="添加道具..."
              />
              <button
                onClick={addProp}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 服装造型 */}
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5 text-purple-400" />
            <h4 className="text-lg font-semibold">服装造型</h4>
          </div>
          
          <div className="space-y-3">
            {project.wardrobe.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-600 rounded-lg p-3">
                <span className="text-white">{item}</span>
                <button
                  onClick={() => removeWardrobeItem(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newWardrobeItem}
                onChange={(e) => setNewWardrobeItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addWardrobeItem()}
                className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                placeholder="添加服装或造型要求..."
              />
              <button
                onClick={addWardrobeItem}
                className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

