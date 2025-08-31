import React, { useState } from 'react';
import { Plus, Phone, Mail, Check, X, DollarSign, Clock, UserCheck, UserX } from 'lucide-react';
import { Project, TeamMember } from '../../types/project';

interface TeamManagerProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

const roleOptions = [
  '摄影师',
  '助理摄影师',
  '化妆师',
  '造型师',
  '模特',
  '助理',
  '灯光师',
  '道具师',
  '后期修图师',
  '制片人',
  '其他'
];

const paymentStatusLabels = {
  'pending': '待支付',
  'paid': '已支付',
  'not-applicable': '无需支付'
};

const paymentStatusColors = {
  'pending': 'bg-amber-500',
  'paid': 'bg-green-500',
  'not-applicable': 'bg-gray-500'
};

export function TeamManager({ project, onUpdate }: TeamManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    contact: '',
    confirmed: false,
    rate: 0,
    paymentStatus: 'not-applicable'
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMember.name && newMember.role && newMember.contact) {
      const member: TeamMember = {
        id: Date.now().toString(),
        name: newMember.name,
        role: newMember.role,
        contact: newMember.contact,
        confirmed: newMember.confirmed || false,
        rate: newMember.rate || 0,
        paymentStatus: newMember.paymentStatus || 'not-applicable'
      };

      const updatedProject = {
        ...project,
        team: [...project.team, member],
        updatedAt: new Date()
      };

      onUpdate(updatedProject);
      setNewMember({
        name: '',
        role: '',
        contact: '',
        confirmed: false,
        rate: 0,
        paymentStatus: 'not-applicable'
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateMember = (memberId: string, updates: Partial<TeamMember>) => {
    const updatedProject = {
      ...project,
      team: project.team.map(member =>
        member.id === memberId ? { ...member, ...updates } : member
      ),
      updatedAt: new Date()
    };
    onUpdate(updatedProject);
  };

  const handleDeleteMember = (memberId: string) => {
    const updatedProject = {
      ...project,
      team: project.team.filter(member => member.id !== memberId),
      updatedAt: new Date()
    };
    onUpdate(updatedProject);
  };

  const confirmedMembers = project.team.filter(member => member.confirmed);
  const unconfirmedMembers = project.team.filter(member => !member.confirmed);
  const totalCost = project.team.reduce((sum, member) => sum + (member.rate || 0), 0);

  return (
    <div className="space-y-6">
      {/* 团队统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <UserCheck className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-gray-300">已确认</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{confirmedMembers.length}</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-gray-300">待确认</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">{unconfirmedMembers.length}</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <UserX className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">总人数</span>
          </div>
          <div className="text-2xl font-bold text-white">{project.team.length}</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium text-gray-300">人员成本</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">¥{totalCost}</div>
        </div>
      </div>

      {/* 添加团队成员按钮 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">团队成员</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>添加成员</span>
        </button>
      </div>

      {/* 添加成员表单 */}
      {showAddForm && (
        <div className="bg-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-medium mb-4">添加团队成员</h4>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">姓名 *</label>
                <input
                  type="text"
                  required
                  value={newMember.name || ''}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="输入成员姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">角色 *</label>
                <select
                  required
                  value={newMember.role || ''}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">选择角色</option>
                  {roleOptions.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">联系方式 *</label>
                <input
                  type="text"
                  required
                  value={newMember.contact || ''}
                  onChange={(e) => setNewMember(prev => ({ ...prev, contact: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="电话号码或邮箱"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">费用</label>
                <input
                  type="number"
                  value={newMember.rate || 0}
                  onChange={(e) => setNewMember(prev => ({ ...prev, rate: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newMember.confirmed || false}
                  onChange={(e) => setNewMember(prev => ({ ...prev, confirmed: e.target.checked }))}
                  className="rounded border-gray-500 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-300">已确认参与</span>
              </label>
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors"
              >
                添加成员
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 团队成员列表 */}
      <div className="space-y-4">
        {project.team.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <UserX className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">暂无团队成员</h3>
            <p className="text-gray-500 mb-6">添加团队成员来开始协作</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-amber-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-amber-400 transition-colors"
            >
              添加第一个成员
            </button>
          </div>
        ) : (
          project.team.map((member) => (
            <div key={member.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium">{member.name}</h4>
                    <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-sm">
                      {member.role}
                    </span>
                    <button
                      onClick={() => handleUpdateMember(member.id, { confirmed: !member.confirmed })}
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                        member.confirmed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {member.confirmed ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{member.confirmed ? '已确认' : '待确认'}</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      {member.contact.includes('@') ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <Phone className="w-4 h-4" />
                      )}
                      <span>{member.contact}</span>
                    </div>
                    {member.rate && member.rate > 0 && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>¥{member.rate}</span>
                        <span className={`px-2 py-1 rounded text-xs ${paymentStatusColors[member.paymentStatus]}`}>
                          {paymentStatusLabels[member.paymentStatus]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {member.rate && member.rate > 0 && (
                    <select
                      value={member.paymentStatus}
                      onChange={(e) => handleUpdateMember(member.id, { paymentStatus: e.target.value as TeamMember['paymentStatus'] })}
                      className="bg-gray-600 border border-gray-500 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="pending">待支付</option>
                      <option value="paid">已支付</option>
                      <option value="not-applicable">无需支付</option>
                    </select>
                  )}
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}