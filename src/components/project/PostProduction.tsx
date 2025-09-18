import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Calendar, 
  Clock, 
  Monitor, 
  Palette, 
  Scissors, 
  Download,
  Edit3,
  Save,
  Trash2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Project, PostProduction as PostProductionType } from '../../types/project';

interface PostProductionProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

const SOFTWARE_OPTIONS = [
  'Adobe Lightroom',
  'Adobe Photoshop',
  'Capture One',
  'Luminar',
  'ON1 Photo RAW',
  'Skylum Aurora HDR',
  'DxO PhotoLab',
  'Affinity Photo',
  'GIMP',
  'Darktable',
  'RawTherapee'
];

const FORMAT_OPTIONS = [
  'JPEG',
  'PNG',
  'TIFF',
  'RAW',
  'PSD',
  'DNG',
  'HEIC'
];

const RESOLUTION_OPTIONS = [
  '原始分辨率',
  '4K (3840x2160)',
  '2K (2048x1080)',
  '1080p (1920x1080)',
  '720p (1280x720)',
  '自定义'
];

const COLOR_SPACE_OPTIONS = [
  'sRGB',
  'Adobe RGB',
  'ProPhoto RGB',
  'Rec. 2020',
  'DCI-P3'
];

const COMPRESSION_OPTIONS = [
  '无损压缩',
  '高质量压缩',
  '标准压缩',
  '高压缩比'
];

export function PostProduction({ project, onUpdate }: PostProductionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [postProduction, setPostProduction] = useState<PostProductionType>(
    project.postProduction || {
      id: Date.now().toString(),
      workflow: {
        software: ['Adobe Lightroom'],
        steps: ['导入照片', '初步筛选', '基础调整', '色彩校正', '细节优化', '导出'],
        estimatedTime: 4
      },
      deliverables: {
        format: ['JPEG'],
        resolution: ['原始分辨率'],
        colorSpace: 'sRGB',
        compression: '高质量压缩'
      },
      timeline: {
        culling: new Date(),
        editing: new Date(),
        colorGrading: new Date(),
        retouching: new Date(),
        delivery: new Date()
      },
      notes: ''
    }
  );

  const handleSave = () => {
    onUpdate({
      ...project,
      postProduction
    });
    setIsEditing(false);
  };

  const addWorkflowStep = (step: string) => {
    if (step.trim()) {
      setPostProduction(prev => ({
        ...prev,
        workflow: {
          ...prev.workflow,
          steps: [...prev.workflow.steps, step.trim()]
        }
      }));
    }
  };

  const removeWorkflowStep = (index: number) => {
    setPostProduction(prev => ({
      ...prev,
      workflow: {
        ...prev.workflow,
        steps: prev.workflow.steps.filter((_, i) => i !== index)
      }
    }));
  };

  const addSoftware = (software: string) => {
    if (software && !postProduction.workflow.software.includes(software)) {
      setPostProduction(prev => ({
        ...prev,
        workflow: {
          ...prev.workflow,
          software: [...prev.workflow.software, software]
        }
      }));
    }
  };

  const removeSoftware = (software: string) => {
    setPostProduction(prev => ({
      ...prev,
      workflow: {
        ...prev.workflow,
        software: prev.workflow.software.filter(s => s !== software)
      }
    }));
  };

  const addFormat = (format: string) => {
    if (format && !postProduction.deliverables.format.includes(format)) {
      setPostProduction(prev => ({
        ...prev,
        deliverables: {
          ...prev.deliverables,
          format: [...prev.deliverables.format, format]
        }
      }));
    }
  };

  const removeFormat = (format: string) => {
    setPostProduction(prev => ({
      ...prev,
      deliverables: {
        ...prev.deliverables,
        format: prev.deliverables.format.filter(f => f !== format)
      }
    }));
  };

  const getTimelineStatus = (date: Date) => {
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', color: 'text-red-400', icon: AlertTriangle };
    if (diffDays === 0) return { status: 'today', color: 'text-yellow-400', icon: AlertTriangle };
    if (diffDays <= 3) return { status: 'urgent', color: 'text-orange-400', icon: AlertTriangle };
    return { status: 'normal', color: 'text-green-400', icon: CheckCircle };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">后期制作规划</h3>
          <p className="text-gray-400">规划照片后期处理流程和交付标准</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors font-medium"
        >
          <Edit3 className="w-5 h-5" />
          <span>{isEditing ? '取消编辑' : '编辑规划'}</span>
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-6">
          {/* 工作流程 */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Scissors className="w-5 h-5 text-blue-400" />
              <span>工作流程</span>
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">使用软件</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {postProduction.workflow.software.map((software) => (
                    <span
                      key={software}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{software}</span>
                      <button
                        onClick={() => removeSoftware(software)}
                        className="hover:text-red-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addSoftware(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">添加软件...</option>
                  {SOFTWARE_OPTIONS.filter(s => !postProduction.workflow.software.includes(s)).map(software => (
                    <option key={software} value={software}>{software}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">处理步骤</label>
                <div className="space-y-2">
                  {postProduction.workflow.steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm w-6">{index + 1}.</span>
                      <span className="text-white flex-1">{step}</span>
                      <button
                        onClick={() => removeWorkflowStep(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 mt-2">
                  <input
                    type="text"
                    placeholder="添加新步骤..."
                    className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addWorkflowStep(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addWorkflowStep(input.value);
                      input.value = '';
                    }}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">预计处理时间 (小时)</label>
                <input
                  type="number"
                  value={postProduction.workflow.estimatedTime}
                  onChange={(e) => setPostProduction(prev => ({
                    ...prev,
                    workflow: {
                      ...prev.workflow,
                      estimatedTime: parseInt(e.target.value) || 0
                    }
                  }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          </div>

          {/* 交付标准 */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Download className="w-5 h-5 text-green-400" />
              <span>交付标准</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">输出格式</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {postProduction.deliverables.format.map((format) => (
                    <span
                      key={format}
                      className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{format}</span>
                      <button
                        onClick={() => removeFormat(format)}
                        className="hover:text-red-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addFormat(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">添加格式...</option>
                  {FORMAT_OPTIONS.filter(f => !postProduction.deliverables.format.includes(f)).map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">分辨率</label>
                <select
                  value={postProduction.deliverables.resolution[0] || ''}
                  onChange={(e) => setPostProduction(prev => ({
                    ...prev,
                    deliverables: {
                      ...prev.deliverables,
                      resolution: [e.target.value]
                    }
                  }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                >
                  {RESOLUTION_OPTIONS.map(resolution => (
                    <option key={resolution} value={resolution}>{resolution}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">色彩空间</label>
                <select
                  value={postProduction.deliverables.colorSpace}
                  onChange={(e) => setPostProduction(prev => ({
                    ...prev,
                    deliverables: {
                      ...prev.deliverables,
                      colorSpace: e.target.value
                    }
                  }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                >
                  {COLOR_SPACE_OPTIONS.map(space => (
                    <option key={space} value={space}>{space}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">压缩方式</label>
                <select
                  value={postProduction.deliverables.compression}
                  onChange={(e) => setPostProduction(prev => ({
                    ...prev,
                    deliverables: {
                      ...prev.deliverables,
                      compression: e.target.value
                    }
                  }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                >
                  {COMPRESSION_OPTIONS.map(compression => (
                    <option key={compression} value={compression}>{compression}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 时间安排 */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>时间安排</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">初选筛选</label>
                <input
                  type="date"
                  value={postProduction.timeline.culling.toISOString().split('T')[0]}
                  onChange={(e) => setPostProduction(prev => ({
                    ...prev,
                    timeline: {
                      ...prev.timeline,
                      culling: new Date(e.target.value)
                    }
                  }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">基础编辑</label>
                <input
                  type="date"
                  value={postProduction.timeline.editing.toISOString().split('T')[0]}
                  onChange={(e) => setPostProduction(prev => ({
                    ...prev,
                    timeline: {
                      ...prev.timeline,
                      editing: new Date(e.target.value)
                    }
                  }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">色彩校正</label>
                <input
                  type="date"
                  value={postProduction.timeline.colorGrading.toISOString().split('T')[0]}
                  onChange={(e) => setPostProduction(prev => ({
                    ...prev,
                    timeline: {
                      ...prev.timeline,
                      colorGrading: new Date(e.target.value)
                    }
                  }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">精修处理</label>
                <input
                  type="date"
                  value={postProduction.timeline.retouching.toISOString().split('T')[0]}
                  onChange={(e) => setPostProduction(prev => ({
                    ...prev,
                    timeline: {
                      ...prev.timeline,
                      retouching: new Date(e.target.value)
                    }
                  }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">最终交付</label>
                <input
                  type="date"
                  value={postProduction.timeline.delivery.toISOString().split('T')[0]}
                  onChange={(e) => setPostProduction(prev => ({
                    ...prev,
                    timeline: {
                      ...prev.timeline,
                      delivery: new Date(e.target.value)
                    }
                  }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">备注说明</label>
            <textarea
              value={postProduction.notes}
              onChange={(e) => setPostProduction(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
              placeholder="添加后期制作的特殊要求或注意事项..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors font-medium flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>保存规划</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 工作流程概览 */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Scissors className="w-5 h-5 text-blue-400" />
              <span>工作流程</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-md font-medium text-gray-300 mb-3">使用软件</h5>
                <div className="flex flex-wrap gap-2">
                  {postProduction.workflow.software.map((software) => (
                    <span
                      key={software}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {software}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-md font-medium text-gray-300 mb-3">预计时间</h5>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-white">{postProduction.workflow.estimatedTime} 小时</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-md font-medium text-gray-300 mb-3">处理步骤</h5>
              <div className="space-y-2">
                {postProduction.workflow.steps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="text-white">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 交付标准概览 */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Download className="w-5 h-5 text-green-400" />
              <span>交付标准</span>
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">输出格式</h5>
                <div className="flex flex-wrap gap-1">
                  {postProduction.deliverables.format.map((format) => (
                    <span
                      key={format}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">分辨率</h5>
                <span className="text-white text-sm">{postProduction.deliverables.resolution[0]}</span>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">色彩空间</h5>
                <span className="text-white text-sm">{postProduction.deliverables.colorSpace}</span>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">压缩方式</h5>
                <span className="text-white text-sm">{postProduction.deliverables.compression}</span>
              </div>
            </div>
          </div>

          {/* 时间安排概览 */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>时间安排</span>
            </h4>
            
            <div className="space-y-3">
              {Object.entries(postProduction.timeline).map(([key, date]) => {
                const status = getTimelineStatus(date);
                const Icon = status.icon;
                const stepNames = {
                  culling: '初选筛选',
                  editing: '基础编辑',
                  colorGrading: '色彩校正',
                  retouching: '精修处理',
                  delivery: '最终交付'
                };
                
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${status.color}`} />
                      <span className="text-white font-medium">{stepNames[key as keyof typeof stepNames]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${status.color}`}>
                        {date.toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {postProduction.notes && (
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-3">备注说明</h4>
              <p className="text-gray-300 leading-relaxed">{postProduction.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

