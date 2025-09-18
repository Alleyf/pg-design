import React, { useState } from 'react';
import { X, User, Mail, Settings, LogOut, Edit3, Save, X as XIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfileProps {
  onClose: () => void;
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveProfile = async () => {
    if (!user) return;

    const success = await updateProfile({
      username: editData.username,
      email: editData.email
    });

    if (success) {
      setMessage({ type: 'success', text: '资料更新成功' });
      setIsEditing(false);
    } else {
      setMessage({ type: 'error', text: '资料更新失败' });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的密码不一致' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: '新密码长度至少6位' });
      return;
    }

    const success = await changePassword(passwordData.oldPassword, passwordData.newPassword);
    
    if (success) {
      setMessage({ type: 'success', text: '密码修改成功' });
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setMessage({ type: 'error', text: '密码修改失败' });
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>个人资料</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {message && (
            <div className={`px-4 py-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-900/20 border border-green-500 text-green-300'
                : 'bg-red-900/20 border border-red-500 text-red-300'
            }`}>
              {message.text}
            </div>
          )}

          {/* 用户头像和基本信息 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold">{user.username}</h3>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>

          {/* 编辑资料 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300">基本信息</h4>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-amber-500 hover:text-amber-400 transition-colors text-sm flex items-center space-x-1"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>编辑</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="text-green-500 hover:text-green-400 transition-colors text-sm flex items-center space-x-1"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({ username: user.username, email: user.email });
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-1"
                  >
                    <XIcon className="w-4 h-4" />
                    <span>取消</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">用户名</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                ) : (
                  <p className="text-white text-sm">{user.username}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">邮箱</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                ) : (
                  <p className="text-white text-sm">{user.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* 修改密码 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300">安全设置</h4>
              {!isChangingPassword ? (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-amber-500 hover:text-amber-400 transition-colors text-sm"
                >
                  修改密码
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleChangePassword}
                    className="text-green-500 hover:text-green-400 transition-colors text-sm"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>

            {isChangingPassword && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">原密码</label>
                  <input
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="请输入原密码"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">新密码</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="请输入新密码（至少6位）"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">确认新密码</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 登出按钮 */}
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
