import React, { useState, useRef } from 'react';
import { Download, Upload, Trash2, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { StorageManager } from '../utils/storageManager';

interface DataManagerProps {
  onDataImported?: () => void;
  onDataCleared?: () => void;
}

export function DataManager({ onDataImported, onDataCleared }: DataManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExport = () => {
    try {
      const data = StorageManager.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `photodesign-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      showNotification('success', '数据导出成功！');
    } catch (error) {
      showNotification('error', '导出失败，请稍后重试');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const result = StorageManager.importData(content);
        
        if (result.success) {
          showNotification('success', result.message);
          onDataImported?.();
          setIsOpen(false);
        } else {
          showNotification('error', result.message);
        }
      } catch (error) {
        showNotification('error', '文件读取失败');
      }
    };
    
    reader.readAsText(file);
    // 清空文件输入，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearData = () => {
    if (window.confirm('确定要清空所有数据吗？此操作不可撤销！')) {
      try {
        StorageManager.clearAllData();
        showNotification('success', '数据已清空');
        onDataCleared?.();
        setIsOpen(false);
      } catch (error) {
        showNotification('error', '清空数据失败');
      }
    }
  };

  const storageInfo = StorageManager.getStorageInfo();

  if (!isOpen) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
        >
          <Database className="w-4 h-4" />
          <span>数据管理</span>
        </button>

        {/* 通知提示 */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* 遮罩层 */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      
      {/* 弹窗 */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <Database className="w-6 h-6" />
              <span>数据管理</span>
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* 存储信息 */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium mb-2 text-gray-300">存储使用情况</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">项目数据:</span>
                <span className="text-white">{storageInfo.formattedProjectsSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">总计:</span>
                <span className="text-white">{storageInfo.formattedTotalSize}</span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>导出数据</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-500 text-white py-3 px-4 rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>导入数据</span>
            </button>

            <button
              onClick={handleClearData}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-500 text-white py-3 px-4 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>清空所有数据</span>
            </button>
          </div>

          {/* 说明文字 */}
          <div className="mt-6 text-xs text-gray-400 space-y-1">
            <p>• 导出：将所有项目数据保存为JSON文件</p>
            <p>• 导入：从JSON文件恢复项目数据</p>
            <p>• 清空：删除浏览器中的所有项目数据</p>
          </div>

          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      {/* 通知提示 */}
      {notification && (
        <div className={`fixed top-4 right-4 z-60 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}
    </>
  );
}