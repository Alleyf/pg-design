import React, { useState } from 'react';
import { User, Building, Mail, Phone, Calendar, FileText, Edit3, Save } from 'lucide-react';
import { Project, ClientInfo } from '../../types/project';

interface ClientManagerProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

export function ClientManager({ project, onUpdate }: ClientManagerProps) {
  const [isEditing, setIsEditing] = useState(!project.client);
  const [clientData, setClientData] = useState<ClientInfo>(
    project.client || {
      name: '',
      contact: '',
      company: '',
      requirements: '',
      deliveryFormat: [],
    }
  );

  const handleSave = () => {
    if (!clientData.name || !clientData.contact) return;

    onUpdate({
      ...project,
      client: clientData,
    });
    setIsEditing(false);
  };

  const addDeliveryFormat = (format: string) => {
    if (!format.trim() || clientData.deliveryFormat.includes(format)) return;
    
    setClientData(prev => ({
      ...prev,
      deliveryFormat: [...prev.deliveryFormat, format],
    }));
  };

  const removeDeliveryFormat = (format: string) => {
    setClientData(prev => ({
      ...prev,
      deliveryFormat: prev.deliveryFormat.filter(f => f !== format),
    }));
  };

  const commonFormats = ['JPG高清', 'RAW原片', '精修图', '视频剪辑', '社交媒体尺寸', '打印尺寸'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">客户信息</h3>
          <p className="text-gray-400">管理客户需求和交付要求</p>
        </div>
        {project.client && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors font-medium"
          >
            <Edit3 className="w-4 h-4" />
            <span>编辑</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">
            {project.client ? '编辑客户信息' : '添加客户信息'}
          </h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">客户姓名 *</label>
                <input
                  type="text"
                  value={clientData.name}
                  onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                  placeholder="客户姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">联系方式 *</label>
                <input
                  type="text"
                  value={clientData.contact}
                  onChange={(e) => setClientData(prev => ({ ...prev, contact: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                  placeholder="电话或邮箱"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">公司/机构</label>
                <input
                  type="text"
                  value={clientData.company || ''}
                  onChange={(e) => setClientData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                  placeholder="公司名称（可选）"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">交付日期</label>
                <input
                  type="date"
                  value={clientData.deliveryDate ? clientData.deliveryDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setClientData(prev => ({ 
                    ...prev, 
                    deliveryDate: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">客户需求</label>
              <textarea
                value={clientData.requirements}
                onChange={(e) => setClientData(prev => ({ ...prev, requirements: e.target.value }))}
                rows={3}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
                placeholder="详细描述客户的具体需求和期望..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">交付格式</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {commonFormats.map(format => (
                  <button
                    key={format}
                    onClick={() => addDeliveryFormat(format)}
                    className={`text-sm px-3 py-2 rounded transition-colors ${
                      clientData.deliveryFormat.includes(format)
                        ? 'bg-amber-500 text-gray-900'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {clientData.deliveryFormat.map(format => (
                  <span
                    key={format}
                    className="bg-amber-500 text-gray-900 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{format}</span>
                    <button
                      onClick={() => removeDeliveryFormat(format)}
                      className="hover:bg-amber-600 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
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
                className="flex items-center space-x-2 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                <span>保存</span>
              </button>
            </div>
          </div>
        </div>
      ) : project.client ? (
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-400">客户姓名</div>
                  <div className="text-white font-medium">{project.client.name}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {project.client.contact.includes('@') ? (
                  <Mail className="w-5 h-5 text-green-400" />
                ) : (
                  <Phone className="w-5 h-5 text-green-400" />
                )}
                <div>
                  <div className="text-sm text-gray-400">联系方式</div>
                  <div className="text-white font-medium">{project.client.contact}</div>
                </div>
              </div>
              
              {project.client.company && (
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-gray-400">公司/机构</div>
                    <div className="text-white font-medium">{project.client.company}</div>
                  </div>
                </div>
              )}
              
              {project.client.deliveryDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm text-gray-400">交付日期</div>
                    <div className="text-white font-medium">
                      {project.client.deliveryDate.toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">客户需求</span>
                </div>
                <div className="bg-gray-600 rounded-lg p-3">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {project.client.requirements || '暂无具体需求'}
                  </p>
                </div>
              </div>
              
              {project.client.deliveryFormat.length > 0 && (
                <div>
                  <div className="text-sm text-gray-400 mb-2">交付格式</div>
                  <div className="flex flex-wrap gap-2">
                    {project.client.deliveryFormat.map(format => (
                      <span
                        key={format}
                        className="bg-amber-500 text-gray-900 px-3 py-1 rounded-full text-sm"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-700 rounded-lg">
          <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium mb-2">还没有客户信息</h4>
          <p className="text-gray-400 mb-6">添加客户信息以便更好地管理项目需求</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-amber-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-amber-400 transition-colors font-medium"
          >
            添加客户信息
          </button>
        </div>
      )}
    </div>
  );
}