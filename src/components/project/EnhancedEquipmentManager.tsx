import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Edit3, 
  Save, 
  Trash2, 
  Camera, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Star,
  Package,
  Battery,
  MemoryStick
} from 'lucide-react';
import { Project, Equipment } from '../../types/project';

interface EnhancedEquipmentManagerProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

const EQUIPMENT_TYPES = [
  { value: 'camera', label: '相机', icon: '📷', color: 'bg-blue-500' },
  { value: 'lens', label: '镜头', icon: '🔍', color: 'bg-green-500' },
  { value: 'lighting', label: '灯光', icon: '💡', color: 'bg-yellow-500' },
  { value: 'tripod', label: '三脚架', icon: '📐', color: 'bg-purple-500' },
  { value: 'filter', label: '滤镜', icon: '🎨', color: 'bg-pink-500' },
  { value: 'memory', label: '存储', icon: '💾', color: 'bg-gray-500' },
  { value: 'battery', label: '电池', icon: '🔋', color: 'bg-red-500' },
  { value: 'accessory', label: '配件', icon: '📦', color: 'bg-indigo-500' }
];

const CONDITION_OPTIONS = [
  { value: 'excellent', label: '优秀', color: 'text-green-400', bgColor: 'bg-green-900' },
  { value: 'good', label: '良好', color: 'text-blue-400', bgColor: 'bg-blue-900' },
  { value: 'fair', label: '一般', color: 'text-yellow-400', bgColor: 'bg-yellow-900' },
  { value: 'poor', label: '较差', color: 'text-red-400', bgColor: 'bg-red-900' }
];

export function EnhancedEquipmentManager({ project, onUpdate }: EnhancedEquipmentManagerProps) {
  const [isAddingEquipment, setIsAddingEquipment] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: '',
    type: 'camera',
    isRequired: true,
    condition: 'good',
    brand: '',
    model: '',
    notes: '',
    serialNumber: '',
    purchaseDate: new Date(),
    specifications: {
      focalLength: '',
      aperture: '',
      sensorSize: '',
      megapixels: 0,
      isoRange: '',
      weight: 0,
      dimensions: ''
    },
    rentalInfo: {
      isRental: false,
      rentalCompany: '',
      rentalCost: 0,
      rentalPeriod: '',
      returnDate: new Date()
    },
    maintenance: {
      lastService: new Date(),
      nextService: new Date(),
      serviceNotes: ''
    }
  });

  const handleAddEquipment = () => {
    if (!newEquipment.name) return;

    const equipment: Equipment = {
      id: Date.now().toString(),
      name: newEquipment.name,
      type: newEquipment.type || 'camera',
      isRequired: newEquipment.isRequired || false,
      brand: newEquipment.brand,
      model: newEquipment.model,
      notes: newEquipment.notes,
      serialNumber: newEquipment.serialNumber,
      purchaseDate: newEquipment.purchaseDate,
      condition: newEquipment.condition || 'good',
      specifications: newEquipment.specifications,
      rentalInfo: newEquipment.rentalInfo,
      maintenance: newEquipment.maintenance
    };

    onUpdate({
      ...project,
      equipment: [...project.equipment, equipment]
    });

    setNewEquipment({
      name: '',
      type: 'camera',
      isRequired: true,
      condition: 'good',
      brand: '',
      model: '',
      notes: '',
      serialNumber: '',
      purchaseDate: new Date(),
      specifications: {
        focalLength: '',
        aperture: '',
        sensorSize: '',
        megapixels: 0,
        isoRange: '',
        weight: 0,
        dimensions: ''
      },
      rentalInfo: {
        isRental: false,
        rentalCompany: '',
        rentalCost: 0,
        rentalPeriod: '',
        returnDate: new Date()
      },
      maintenance: {
        lastService: new Date(),
        nextService: new Date(),
        serviceNotes: ''
      }
    });
    setIsAddingEquipment(false);
  };

  const handleUpdateEquipment = (updatedEquipment: Equipment) => {
    onUpdate({
      ...project,
      equipment: project.equipment.map(eq => 
        eq.id === updatedEquipment.id ? updatedEquipment : eq
      )
    });
    setEditingEquipment(null);
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    onUpdate({
      ...project,
      equipment: project.equipment.filter(eq => eq.id !== equipmentId)
    });
  };

  const getEquipmentIcon = (type: Equipment['type']) => {
    const typeInfo = EQUIPMENT_TYPES.find(t => t.value === type);
    return typeInfo?.icon || '📦';
  };

  const getConditionInfo = (condition: Equipment['condition']) => {
    return CONDITION_OPTIONS.find(c => c.value === condition) || CONDITION_OPTIONS[1];
  };

  const filteredEquipment = project.equipment.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || equipment.type === filterType;
    const matchesCondition = filterCondition === 'all' || equipment.condition === filterCondition;
    return matchesSearch && matchesType && matchesCondition;
  });

  const getMaintenanceStatus = (equipment: Equipment) => {
    if (!equipment.maintenance?.nextService) return 'unknown';
    const nextService = new Date(equipment.maintenance.nextService);
    const now = new Date();
    const diffDays = Math.ceil((nextService.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 30) return 'due-soon';
    return 'good';
  };

  const getMaintenanceColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'text-red-400';
      case 'due-soon': return 'text-yellow-400';
      case 'good': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">增强器材管理</h3>
          <p className="text-gray-400">管理摄影器材的详细信息、维护记录和租赁信息</p>
        </div>
        <button
          onClick={() => setIsAddingEquipment(true)}
          className="flex items-center space-x-2 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>添加器材</span>
        </button>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-600 border border-gray-500 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400"
              placeholder="搜索器材名称、品牌或型号..."
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">所有类型</option>
              {EQUIPMENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">所有状态</option>
              {CONDITION_OPTIONS.map(condition => (
                <option key={condition.value} value={condition.value}>{condition.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 添加器材表单 */}
      {isAddingEquipment && (
        <div className="bg-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">添加新器材</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">器材名称 *</label>
                <input
                  type="text"
                  value={newEquipment.name || ''}
                  onChange={(e) => setNewEquipment(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  placeholder="例如：佳能 EOS R5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">器材类型 *</label>
                <select
                  value={newEquipment.type || 'camera'}
                  onChange={(e) => setNewEquipment(prev => ({ ...prev, type: e.target.value as Equipment['type'] }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                >
                  {EQUIPMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">设备状态</label>
                <select
                  value={newEquipment.condition || 'good'}
                  onChange={(e) => setNewEquipment(prev => ({ ...prev, condition: e.target.value as Equipment['condition'] }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                >
                  {CONDITION_OPTIONS.map(condition => (
                    <option key={condition.value} value={condition.value}>{condition.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">品牌</label>
                <input
                  type="text"
                  value={newEquipment.brand || ''}
                  onChange={(e) => setNewEquipment(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  placeholder="例如：佳能、尼康、索尼"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">型号</label>
                <input
                  type="text"
                  value={newEquipment.model || ''}
                  onChange={(e) => setNewEquipment(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  placeholder="例如：EOS R5、D850、A7R IV"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">序列号</label>
                <input
                  type="text"
                  value={newEquipment.serialNumber || ''}
                  onChange={(e) => setNewEquipment(prev => ({ ...prev, serialNumber: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  placeholder="设备序列号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">购买日期</label>
                <input
                  type="date"
                  value={newEquipment.purchaseDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setNewEquipment(prev => ({ ...prev, purchaseDate: new Date(e.target.value) }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">备注</label>
              <textarea
                value={newEquipment.notes || ''}
                onChange={(e) => setNewEquipment(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
                placeholder="添加器材的特殊说明或注意事项..."
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsAddingEquipment(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddEquipment}
                className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
              >
                添加器材
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 器材列表 */}
      <div className="space-y-4">
        {filteredEquipment.map((equipment) => {
          const typeInfo = EQUIPMENT_TYPES.find(t => t.value === equipment.type);
          const conditionInfo = getConditionInfo(equipment.condition);
          const maintenanceStatus = getMaintenanceStatus(equipment);
          
          return (
            <div key={equipment.id} className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getEquipmentIcon(equipment.type)}</span>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{equipment.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{equipment.brand} {equipment.model}</span>
                      {equipment.serialNumber && (
                        <>
                          <span>•</span>
                          <span>SN: {equipment.serialNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingEquipment(equipment)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEquipment(equipment.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-600 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-1">类型</div>
                  <div className="text-white font-medium">{typeInfo?.label}</div>
                </div>
                <div className="bg-gray-600 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-1">状态</div>
                  <div className={`font-medium ${conditionInfo.color}`}>
                    {conditionInfo.label}
                  </div>
                </div>
                <div className="bg-gray-600 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-1">必需性</div>
                  <div className={`font-medium ${equipment.isRequired ? 'text-red-400' : 'text-gray-400'}`}>
                    {equipment.isRequired ? '必需' : '可选'}
                  </div>
                </div>
                <div className="bg-gray-600 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-1">维护状态</div>
                  <div className={`font-medium ${getMaintenanceColor(maintenanceStatus)}`}>
                    {maintenanceStatus === 'overdue' ? '逾期' :
                     maintenanceStatus === 'due-soon' ? '即将到期' :
                     maintenanceStatus === 'good' ? '良好' : '未知'}
                  </div>
                </div>
              </div>

              {equipment.rentalInfo?.isRental && (
                <div className="bg-yellow-900 bg-opacity-30 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300 font-medium">租赁信息</span>
                  </div>
                  <div className="text-sm text-yellow-200">
                    {equipment.rentalInfo.rentalCompany} • 
                    ¥{equipment.rentalInfo.rentalCost}/天 • 
                    到期: {equipment.rentalInfo.returnDate?.toLocaleDateString('zh-CN')}
                  </div>
                </div>
              )}

              {equipment.specifications && (
                <div className="bg-gray-600 rounded-lg p-3 mb-4">
                  <h5 className="text-sm font-medium text-gray-300 mb-2">技术规格</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {equipment.specifications.focalLength && (
                      <div>
                        <span className="text-gray-400">焦距: </span>
                        <span className="text-white">{equipment.specifications.focalLength}</span>
                      </div>
                    )}
                    {equipment.specifications.aperture && (
                      <div>
                        <span className="text-gray-400">光圈: </span>
                        <span className="text-white">{equipment.specifications.aperture}</span>
                      </div>
                    )}
                    {equipment.specifications.megapixels && (
                      <div>
                        <span className="text-gray-400">像素: </span>
                        <span className="text-white">{equipment.specifications.megapixels}MP</span>
                      </div>
                    )}
                    {equipment.specifications.weight && (
                      <div>
                        <span className="text-gray-400">重量: </span>
                        <span className="text-white">{equipment.specifications.weight}kg</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {equipment.notes && (
                <div className="bg-gray-600 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-gray-300 mb-1">备注</h5>
                  <p className="text-white text-sm">{equipment.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12 bg-gray-700 rounded-lg">
          <div className="mb-4">
            <Camera className="w-12 h-12 text-gray-500 mx-auto" />
          </div>
          <h4 className="text-lg font-medium mb-2">没有找到器材</h4>
          <p className="text-gray-400 mb-6">
            {project.equipment.length === 0 
              ? '还没有添加任何器材设备' 
              : '没有匹配搜索条件的器材'}
          </p>
        </div>
      )}
    </div>
  );
}

