import React, { useState } from 'react';
import { X, Camera, Image } from 'lucide-react';
import { Project } from '../types/project';

interface CreateProjectModalProps {
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

// 根据项目类型获取默认封面图
const getDefaultCoverImage = (type: Project['type']): string => {
  const coverImages = {
    portrait: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face',
    landscape: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    product: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    event: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
    commercial: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=300&fit=crop',
    other: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop'
  };
  return coverImages[type];
};

// 封面图选项
const getCoverImageOptions = (type: Project['type']): { url: string; title: string }[] => {
  const options = {
    portrait: [
      { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face', title: '经典人像' },
      { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop&crop=face', title: '女性肖像' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face', title: '男性肖像' },
      { url: 'https://images.unsplash.com/photo-1494790108755-2616c10b46c5?w=400&h=300&fit=crop&crop=face', title: '时尚人像' }
    ],
    landscape: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', title: '山景风光' },
      { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop', title: '森林景观' },
      { url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop', title: '海洋风光' },
      { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=300&fit=crop', title: '城市风光' }
    ],
    product: [
      { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', title: '时尚产品' },
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', title: '手表产品' },
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', title: '耳机产品' },
      { url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop', title: '办公用品' }
    ],
    wedding: [
      { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop', title: '婚礼仪式' },
      { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop', title: '婚纱照' },
      { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop', title: '婚戒特写' },
      { url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop', title: '户外婚礼' }
    ],
    event: [
      { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop', title: '活动现场' },
      { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop', title: '音乐会' },
      { url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=300&fit=crop', title: '会议活动' },
      { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop', title: '展览活动' }
    ],
    commercial: [
      { url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=300&fit=crop', title: '商业摄影' },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop', title: '建筑商业' },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', title: '办公环境' },
      { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', title: '商业肖像' }
    ],
    other: [
      { url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop', title: '创意摄影' },
      { url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop', title: '艺术创作' },
      { url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop', title: '实验摄影' },
      { url: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&h=300&fit=crop', title: '抽象艺术' }
    ]
  };
  return options[type] || options.other;
};

const projectTypes = [
  { value: 'portrait', label: '人像摄影', icon: '👤' },
  { value: 'landscape', label: '风光摄影', icon: '🌄' },
  { value: 'product', label: '产品摄影', icon: '📦' },
  { value: 'wedding', label: '婚礼摄影', icon: '💒' },
  { value: 'event', label: '活动摄影', icon: '🎉' },
  { value: 'commercial', label: '商业摄影', icon: '🏢' },
  { value: 'other', label: '其他', icon: '📸' },
];

export function CreateProjectModal({ onClose, onSubmit }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'portrait' as Project['type'],
    location: '',
    concept: '',
    mood: '',
    shootDate: '',
    budget: '',
    notes: '',
    coverImage: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      status: 'planning',
      location: formData.location,
      concept: formData.concept,
      mood: formData.mood,
      equipment: [],
      props: [],
      wardrobe: [],
      team: [],
      inspirationImages: [],
      checklist: [],
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      expenses: [],
      notes: formData.notes,
      shootDate: formData.shootDate ? new Date(formData.shootDate) : undefined,
      coverImage: formData.coverImage || getDefaultCoverImage(formData.type),
      shootingSettings: {
        duration: 2,
        specialRequirements: [],
      },
    };
    
    onSubmit(projectData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500 p-2 rounded-lg">
              <Camera className="w-5 h-5 text-gray-900" />
            </div>
            <h2 className="text-xl font-bold">创建新项目</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                项目名称 *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="例如：春日花海人像拍摄"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                项目描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                placeholder="简要描述这次拍摄的目标和愿景..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                拍摄类型 *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {projectTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value as Project['type'] }))}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                      formData.type === type.value
                        ? 'bg-amber-500 border-amber-500 text-gray-900'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span className="text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                拍摄地点
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="例如：杭州西湖、工作室等"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                拍摄日期
              </label>
              <input
                type="date"
                value={formData.shootDate}
                onChange={(e) => setFormData(prev => ({ ...prev, shootDate: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                预算 (¥)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="1000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                创作理念
              </label>
              <textarea
                value={formData.concept}
                onChange={(e) => setFormData(prev => ({ ...prev, concept: e.target.value }))}
                rows={2}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                placeholder="描述这次拍摄的创作理念和想要表达的内容..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                情绪与风格
              </label>
              <input
                type="text"
                value={formData.mood}
                onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="例如：温馨、浪漫、复古、简约、戏剧化等"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                项目封面
              </label>
              <div className="space-y-4">
                {/* 当前选择的封面图 */}
                {(formData.coverImage || getDefaultCoverImage(formData.type)) && (
                  <div className="border border-gray-600 rounded-lg p-3">
                    <img
                      src={formData.coverImage || getDefaultCoverImage(formData.type)}
                      alt="项目封面"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-xs text-gray-400 text-center">
                      {formData.coverImage ? '自定义封面' : '默认封面 (基于项目类型)'}
                    </p>
                  </div>
                )}
                
                {/* 自定义URL输入 */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    自定义封面图片链接 (可选)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                      className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.coverImage && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                        className="bg-gray-600 hover:bg-gray-500 text-gray-300 px-3 py-2 rounded-lg transition-colors"
                      >
                        清除
                      </button>
                    )}
                  </div>
                </div>

                {/* 预设封面图选择 */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    或选择预设封面 (基于 {formData.type === 'portrait' ? '人像摄影' : formData.type === 'landscape' ? '风光摄影' : formData.type === 'product' ? '产品摄影' : formData.type === 'wedding' ? '婚礼摄影' : formData.type === 'event' ? '活动摄影' : formData.type === 'commercial' ? '商业摄影' : '其他'} 类型)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {getCoverImageOptions(formData.type).map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coverImage: option.url }))}
                        className={`relative group overflow-hidden rounded-lg border-2 transition-all ${
                          formData.coverImage === option.url
                            ? 'border-amber-500 ring-2 ring-amber-500 ring-opacity-50'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <img
                          src={option.url}
                          alt={option.title}
                          className="w-full h-16 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{option.title}</span>
                        </div>
                        {formData.coverImage === option.url && (
                          <div className="absolute top-1 right-1 bg-amber-500 rounded-full p-1">
                            <Image className="w-3 h-3 text-gray-900" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="bg-amber-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
            >
              创建项目
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}