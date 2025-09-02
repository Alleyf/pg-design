import React, { useState } from 'react';
import { Plus, X, Tag, ExternalLink, Filter, Search, Upload } from 'lucide-react';
import { Project, InspirationImage } from '../../types/project';

interface InspirationBoardProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

const categories = [
  { value: 'pose', label: '姿势', color: 'bg-pink-500' },
  { value: 'lighting', label: '光线', color: 'bg-yellow-500' },
  { value: 'composition', label: '构图', color: 'bg-blue-500' },
  { value: 'color', label: '色彩', color: 'bg-purple-500' },
  { value: 'mood', label: '情绪', color: 'bg-green-500' },
  { value: 'other', label: '其他', color: 'bg-gray-500' },
];

export function InspirationBoard({ project, onUpdate }: InspirationBoardProps) {
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newImage, setNewImage] = useState({
    url: '',
    title: '',
    description: '',
    tags: '',
    category: 'other' as InspirationImage['category'],
  });

  const handleAddImage = () => {
    if (!newImage.url || !newImage.title) return;

    const inspiration: InspirationImage = {
      id: Date.now().toString(),
      url: newImage.url,
      title: newImage.title,
      description: newImage.description,
      tags: newImage.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      category: newImage.category,
    };

    onUpdate({
      ...project,
      inspirationImages: [...project.inspirationImages, inspiration],
    });

    setNewImage({ url: '', title: '', description: '', tags: '', category: 'other' });
    setIsAddingImage(false);
  };

  const handleRemoveImage = (imageId: string) => {
    onUpdate({
      ...project,
      inspirationImages: project.inspirationImages.filter(img => img.id !== imageId),
    });
  };

  // 过滤图片
  const filteredImages = project.inspirationImages.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 示例图片URL（使用Pexels的图片）
  const sampleImages = [
    { url: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg', title: '人像示例 1', category: 'pose' as const },
    { url: 'https://images.pexels.com/photos/1545590/pexels-photo-1545590.jpeg', title: '风景示例', category: 'composition' as const },
    { url: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg', title: '产品示例', category: 'lighting' as const },
  ];

  const addSampleImage = (url: string, title: string, category: InspirationImage['category']) => {
    const inspiration: InspirationImage = {
      id: Date.now().toString(),
      url,
      title,
      description: '示例参考图片',
      tags: ['示例'],
      category,
    };

    onUpdate({
      ...project,
      inspirationImages: [...project.inspirationImages, inspiration],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">灵感板</h3>
          <p className="text-gray-400">收集参考图片、样片和灵感素材</p>
        </div>
        <button
          onClick={() => setIsAddingImage(true)}
          className="flex items-center space-x-2 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>添加图片</span>
        </button>
      </div>

      {/* 搜索和过滤 */}
      {project.inspirationImages.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400"
                placeholder="搜索图片..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">全部分类</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {project.inspirationImages.length === 0 && !isAddingImage && (
        <div className="text-center py-12 bg-gray-700 rounded-lg">
          <div className="mb-4">
            <Tag className="w-12 h-12 text-gray-500 mx-auto" />
          </div>
          <h4 className="text-lg font-medium mb-2">还没有灵感图片</h4>
          <p className="text-gray-400 mb-6">添加一些参考图片来启发你的创作</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">试试添加这些示例图片：</p>
            <div className="flex justify-center space-x-2">
              {sampleImages.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => addSampleImage(sample.url, sample.title, sample.category)}
                  className="text-xs bg-gray-600 text-gray-300 px-3 py-1 rounded hover:bg-gray-500"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isAddingImage && (
        <div className="bg-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">添加灵感图片</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">图片来源 *</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>上传本地图片</span>
                </button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setNewImage(prev => ({ ...prev, url: event.target?.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                <div className="text-xs text-gray-400">或</div>
                <input
                  type="url"
                  value={newImage.url}
                  onChange={(e) => setNewImage(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="输入图片URL"
                  className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">标题 *</label>
              <input
                type="text"
                value={newImage.title}
                onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                placeholder="为这张图片起个名字"
              />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">分类 *</label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value as InspirationImage['category'] }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">描述</label>
              <textarea
                value={newImage.description}
                onChange={(e) => setNewImage(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none"
                placeholder="描述这张图片的特点或想法"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">标签</label>
              <input
                type="text"
                value={newImage.tags}
                onChange={(e) => setNewImage(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                placeholder="标签1, 标签2, 标签3"
              />
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsAddingImage(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddImage}
                className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
              >
                添加图片
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => {
          const categoryInfo = categories.find(cat => cat.value === image.category);
          return (
          <div
            key={image.id}
            className="bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
          >
            <div className="relative">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg';
                }}
              />
              <div className={`absolute top-2 left-2 ${categoryInfo?.color} text-white px-2 py-1 rounded text-xs font-medium`}>
                {categoryInfo?.label}
              </div>
              <button
                onClick={() => handleRemoveImage(image.id)}
                className="absolute top-2 right-10 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 left-2 bg-gray-800 bg-opacity-80 text-white p-1 rounded-full hover:bg-opacity-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="p-4">
              <h4 className="font-semibold mb-2">{image.title}</h4>
              {image.description && (
                <p className="text-gray-400 text-sm mb-3">{image.description}</p>
              )}
              {image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {image.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
        })}
      </div>

      {filteredImages.length === 0 && project.inspirationImages.length > 0 && (
        <div className="text-center py-8 text-gray-400">
          <Tag className="w-8 h-8 mx-auto mb-2" />
          <p>没有找到匹配的图片</p>
        </div>
      )}
    </div>
  );
}