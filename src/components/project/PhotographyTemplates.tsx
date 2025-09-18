import React, { useState } from 'react';
import { 
  Camera, 
  Users, 
  Heart, 
  Mountain, 
  ShoppingBag, 
  Calendar, 
  Building,
  CheckCircle,
  Plus,
  Star,
  Download,
  Upload,
  X
} from 'lucide-react';
import { Project } from '../../types/project';

interface PhotographyTemplatesProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

interface Template {
  id: string;
  name: string;
  type: Project['type'];
  icon: React.ReactNode;
  description: string;
  features: string[];
  equipment: string[];
  checklist: string[];
  settings: {
    duration: number;
    specialRequirements: string[];
  };
  inspiration: string[];
}

const TEMPLATES: Template[] = [
  {
    id: 'portrait-classic',
    name: '经典人像摄影',
    type: 'portrait',
    icon: <Users className="w-8 h-8 text-pink-500" />,
    description: '适合个人写真、艺术人像的专业模板',
    features: ['自然光拍摄', '情绪引导', '构图技巧', '后期调色'],
    equipment: ['单反相机', '85mm镜头', '50mm镜头', '反光板', '三脚架'],
    checklist: [
      '确认拍摄场地和时间',
      '准备服装和道具',
      '检查相机电池和存储卡',
      '设置相机参数',
      '与模特沟通拍摄风格',
      '准备备用方案'
    ],
    settings: {
      duration: 2,
      specialRequirements: ['自然光', '情绪引导', '构图技巧']
    },
    inspiration: ['人像构图', '光影运用', '情绪表达', '色彩搭配']
  },
  {
    id: 'wedding-romantic',
    name: '浪漫婚礼摄影',
    type: 'wedding',
    icon: <Heart className="w-8 h-8 text-red-500" />,
    description: '婚礼纪实和婚纱照的专业拍摄模板',
    features: ['纪实拍摄', '情感捕捉', '细节记录', '团队协作'],
    equipment: ['双机位相机', '24-70mm镜头', '70-200mm镜头', '闪光灯', '备用电池'],
    checklist: [
      '确认婚礼流程和时间',
      '准备拍摄设备清单',
      '与新人沟通拍摄需求',
      '勘察拍摄场地',
      '准备备用设备',
      '安排后期制作时间'
    ],
    settings: {
      duration: 8,
      specialRequirements: ['双机位', '情感捕捉', '细节记录']
    },
    inspiration: ['婚礼纪实', '情感表达', '细节特写', '光影运用']
  },
  {
    id: 'landscape-nature',
    name: '自然风光摄影',
    type: 'landscape',
    icon: <Mountain className="w-8 h-8 text-green-500" />,
    description: '自然风光和城市景观的专业拍摄模板',
    features: ['黄金时间拍摄', '构图技巧', '滤镜使用', '天气适应'],
    equipment: ['全画幅相机', '广角镜头', '长焦镜头', '渐变滤镜', '三脚架', '快门线'],
    checklist: [
      '查看天气预报',
      '确认日出日落时间',
      '准备滤镜和配件',
      '检查三脚架稳定性',
      '准备保暖衣物',
      '规划拍摄路线'
    ],
    settings: {
      duration: 4,
      specialRequirements: ['黄金时间', '滤镜使用', '三脚架稳定']
    },
    inspiration: ['风光构图', '光影效果', '色彩层次', '景深控制']
  },
  {
    id: 'product-commercial',
    name: '商业产品摄影',
    type: 'product',
    icon: <ShoppingBag className="w-8 h-8 text-blue-500" />,
    description: '电商产品拍摄和商业广告的专业模板',
    features: ['专业布光', '细节展示', '多角度拍摄', '后期精修'],
    equipment: ['微距镜头', '专业灯光', '背景纸', '反光板', '三脚架', '转盘'],
    checklist: [
      '准备产品样品',
      '设置专业灯光',
      '准备背景和道具',
      '调整相机参数',
      '多角度拍摄',
      '后期精修处理'
    ],
    settings: {
      duration: 3,
      specialRequirements: ['专业布光', '细节展示', '多角度拍摄']
    },
    inspiration: ['产品构图', '光影效果', '细节特写', '色彩还原']
  },
  {
    id: 'event-documentary',
    name: '活动纪实摄影',
    type: 'event',
    icon: <Calendar className="w-8 h-8 text-purple-500" />,
    description: '会议、庆典、演出等活动的纪实拍摄模板',
    features: ['快速抓拍', '多场景切换', '人物特写', '环境记录'],
    equipment: ['高速相机', '变焦镜头', '闪光灯', '备用电池', '存储卡'],
    checklist: [
      '了解活动流程',
      '准备拍摄设备',
      '确认拍摄权限',
      '准备备用设备',
      '安排拍摄位置',
      '后期快速处理'
    ],
    settings: {
      duration: 6,
      specialRequirements: ['快速抓拍', '多场景切换', '人物特写']
    },
    inspiration: ['纪实构图', '瞬间捕捉', '人物表情', '环境氛围']
  },
  {
    id: 'commercial-corporate',
    name: '企业商业摄影',
    type: 'commercial',
    icon: <Building className="w-8 h-8 text-gray-500" />,
    description: '企业宣传、团队形象、办公环境的专业拍摄模板',
    features: ['专业形象', '环境展示', '团队协作', '品牌调性'],
    equipment: ['专业相机', '标准镜头', '广角镜头', '专业灯光', '三脚架'],
    checklist: [
      '了解企业需求',
      '准备拍摄方案',
      '协调拍摄时间',
      '准备专业设备',
      '安排后期制作',
      '交付标准确认'
    ],
    settings: {
      duration: 4,
      specialRequirements: ['专业形象', '环境展示', '品牌调性']
    },
    inspiration: ['企业形象', '环境展示', '团队协作', '专业氛围']
  }
];

export function PhotographyTemplates({ project, onUpdate }: PhotographyTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const applyTemplate = (template: Template) => {
    setIsApplying(true);
    
    // 应用模板到项目
    const updatedProject: Project = {
      ...project,
      type: template.type,
      shootingSettings: {
        ...project.shootingSettings,
        duration: template.settings.duration,
        specialRequirements: template.settings.specialRequirements
      },
      equipment: template.equipment.map((item, index) => ({
        id: `template-${template.id}-${index}`,
        name: item,
        type: 'camera' as const,
        isRequired: true,
        condition: 'good' as const
      })),
      checklist: template.checklist.map((task, index) => ({
        id: `template-${template.id}-task-${index}`,
        task,
        completed: false,
        priority: 'medium' as const,
        category: 'creative' as const
      })),
      inspirationImages: template.inspiration.map((inspiration, index) => ({
        id: `template-${template.id}-inspiration-${index}`,
        url: '',
        title: inspiration,
        description: `关于${inspiration}的参考图片`,
        tags: [inspiration],
        category: 'other' as const
      })),
      templates: [...(project.templates || []), template.id]
    };

    onUpdate(updatedProject);
    setSelectedTemplate(null);
    setIsApplying(false);
  };

  const getTypeIcon = (type: Project['type']) => {
    switch (type) {
      case 'portrait': return <Users className="w-4 h-4" />;
      case 'wedding': return <Heart className="w-4 h-4" />;
      case 'landscape': return <Mountain className="w-4 h-4" />;
      case 'product': return <ShoppingBag className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'commercial': return <Building className="w-4 h-4" />;
      default: return <Camera className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Project['type']) => {
    switch (type) {
      case 'portrait': return 'text-pink-400';
      case 'wedding': return 'text-red-400';
      case 'landscape': return 'text-green-400';
      case 'product': return 'text-blue-400';
      case 'event': return 'text-purple-400';
      case 'commercial': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">摄影模板</h3>
          <p className="text-gray-400">选择专业模板快速设置拍摄项目</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm">
            <Upload className="w-4 h-4" />
            <span>导入模板</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm">
            <Download className="w-4 h-4" />
            <span>导出模板</span>
          </button>
        </div>
      </div>

      {/* 当前项目使用的模板 */}
      {project.templates && project.templates.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h4 className="text-md font-semibold mb-3 text-green-400">已应用的模板</h4>
          <div className="flex flex-wrap gap-2">
            {project.templates.map((templateId) => {
              const template = TEMPLATES.find(t => t.id === templateId);
              if (!template) return null;
              return (
                <span
                  key={templateId}
                  className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{template.name}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 模板列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors cursor-pointer"
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="flex items-center space-x-3 mb-4">
              {template.icon}
              <div>
                <h4 className="text-lg font-semibold text-white">{template.name}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  {getTypeIcon(template.type)}
                  <span className={getTypeColor(template.type)}>
                    {template.type === 'portrait' ? '人像' :
                     template.type === 'wedding' ? '婚礼' :
                     template.type === 'landscape' ? '风景' :
                     template.type === 'product' ? '产品' :
                     template.type === 'event' ? '活动' :
                     template.type === 'commercial' ? '商业' : '其他'}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">{template.description}</p>
            
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium text-gray-400 mb-2">特色功能</h5>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>预计时长: {template.settings.duration}小时</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>专业模板</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 模板详情弹窗 */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {selectedTemplate.icon}
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{selectedTemplate.name}</h3>
                    <p className="text-gray-400">{selectedTemplate.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-blue-400">特色功能</h4>
                  <ul className="space-y-2">
                    {selectedTemplate.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 text-green-400">推荐器材</h4>
                  <ul className="space-y-2">
                    {selectedTemplate.equipment.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-300">
                        <Camera className="w-4 h-4 text-blue-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-purple-400">检查清单</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedTemplate.checklist.map((task, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-300">
                      <div className="w-4 h-4 border border-gray-500 rounded"></div>
                      <span className="text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-yellow-400">灵感方向</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.inspiration.map((item, index) => (
                    <span
                      key={index}
                      className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => applyTemplate(selectedTemplate)}
                  disabled={isApplying}
                  className="bg-amber-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
                >
                  {isApplying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                      <span>应用中...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>应用模板</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

