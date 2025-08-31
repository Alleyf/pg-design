import { Project } from '../types/project';

const STORAGE_KEYS = {
  PROJECTS: 'photodesign_projects',
  SELECTED_PROJECT: 'photodesign_selected_project',
} as const;

/**
 * 本地存储管理工具类
 */
export class StorageManager {
  /**
   * 导出所有数据为JSON
   */
  static exportData(): string {
    const data = {
      projects: this.getProjects(),
      selectedProjectId: this.getSelectedProjectId(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * 从JSON导入数据
   */
  static importData(jsonData: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonData);
      
      // 验证数据结构
      if (!data.projects || !Array.isArray(data.projects)) {
        return { success: false, message: '数据格式无效：缺少项目数组' };
      }

      // 恢复日期对象
      const projects = data.projects.map((project: any) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
        shootDate: project.shootDate ? new Date(project.shootDate) : undefined,
        checklist: project.checklist?.map((item: any) => ({
          ...item,
          dueDate: item.dueDate ? new Date(item.dueDate) : undefined
        })) || [],
        expenses: project.expenses?.map((expense: any) => ({
          ...expense,
          date: expense.date ? new Date(expense.date) : undefined
        })) || [],
        client: project.client ? {
          ...project.client,
          deliveryDate: project.client.deliveryDate ? new Date(project.client.deliveryDate) : undefined
        } : undefined
      }));

      // 保存数据
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      
      if (data.selectedProjectId) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_PROJECT, JSON.stringify(data.selectedProjectId));
      }

      return { success: true, message: `成功导入 ${projects.length} 个项目` };
    } catch (error) {
      return { success: false, message: `导入失败：${error instanceof Error ? error.message : '未知错误'}` };
    }
  }

  /**
   * 清空所有数据
   */
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  /**
   * 获取存储的项目数据
   */
  static getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!data) return [];
      
      return JSON.parse(data, (key, value) => {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });
    } catch {
      return [];
    }
  }

  /**
   * 获取选中的项目ID
   */
  static getSelectedProjectId(): string | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SELECTED_PROJECT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * 获取存储使用情况
   */
  static getStorageInfo() {
    let totalSize = 0;
    let itemCount = 0;
    
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
        itemCount++;
      }
    }

    const projectsSize = localStorage.getItem(STORAGE_KEYS.PROJECTS)?.length || 0;
    const selectedProjectSize = localStorage.getItem(STORAGE_KEYS.SELECTED_PROJECT)?.length || 0;
    
    return {
      totalSize,
      itemCount,
      projectsSize,
      selectedProjectSize,
      formattedTotalSize: this.formatBytes(totalSize),
      formattedProjectsSize: this.formatBytes(projectsSize)
    };
  }

  /**
   * 格式化字节数
   */
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}