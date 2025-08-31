import React, { useState } from 'react';
import { Camera, Palette, Package, Users, Plus, X, Clock, MapPin, Edit3 } from 'lucide-react';
import { Project, Equipment } from '../../types/project';

interface PlanningDetailsProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

export function PlanningDetails({ project, onUpdate }: PlanningDetailsProps) {
  const [newEquipment, setNewEquipment] = useState('');
  const [newProp, setNewProp] = useState('');
  const [newWardrobeItem, setNewWardrobeItem] = useState('');
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [settings, setSettings] = useState(project.shootingSettings);

  const addEquipment = () => {
    if (!newEquipment.trim()) return;
    
    const equipment: Equipment = {
      id: Date.now().toString(),
      name: newEquipment,
      type: 'camera',
      isRequired: true,
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

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-6">策划详情</h3>
        
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

        {/* 器材设备 */}
        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Camera className="w-5 h-5 text-amber-400" />
            <h4 className="text-lg font-semibold">器材设备</h4>
          </div>
          
          <div className="space-y-3">
            {project.equipment.map((equipment) => (
              <div key={equipment.id} className="flex items-center justify-between bg-gray-600 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">{equipment.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    equipment.isRequired ? 'bg-red-900 text-red-300' : 'bg-gray-500 text-gray-300'
                  }`}>
                    {equipment.isRequired ? '必需' : '可选'}
                  </span>
                </div>
                <button
                  onClick={() => removeEquipment(equipment.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
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