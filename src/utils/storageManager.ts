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
      
      // 检查版本兼容性
      if (data.version && data.version !== '1.0.0') {
        console.warn(`数据版本 ${data.version} 可能与当前版本不兼容`);
      }
      
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
   * 数据迁移：从旧版本升级到新版本
   */
  static migrateData(): { success: boolean; message: string } {
    try {
      const projects = this.getProjects();
      let migratedCount = 0;
      
      // 检查是否需要迁移
      const needsMigration = projects.some(project => {
        // 检查是否有旧版本字段需要迁移
        return !project.updatedAt || 
               (project.checklist && project.checklist.some(item => typeof item.dueDate === 'string'));
      });
      
      if (!needsMigration) {
        return { success: true, message: '数据已是最新版本，无需迁移' };
      }
      
      // 执行迁移
      const migratedProjects = projects.map(project => {
        const migrated = { ...project };
        
        // 确保 updatedAt 存在
        if (!migrated.updatedAt) {
          migrated.updatedAt = migrated.createdAt || new Date();
        }
        
        // 迁移 checklist 中的日期字段
        if (migrated.checklist) {
          migrated.checklist = migrated.checklist.map(item => ({
            ...item,
            dueDate: item.dueDate && typeof item.dueDate === 'string' 
              ? new Date(item.dueDate) 
              : item.dueDate
          }));
        }
        
        // 迁移 expenses 中的日期字段
        if (migrated.expenses) {
          migrated.expenses = migrated.expenses.map(expense => ({
            ...expense,
            date: expense.date && typeof expense.date === 'string' 
              ? new Date(expense.date) 
              : expense.date
          }));
        }
        
        migratedCount++;
        return migrated;
      });
      
      // 保存迁移后的数据
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(migratedProjects));
      
      return { 
        success: true, 
        message: `数据迁移完成，共迁移 ${migratedCount} 个项目` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `数据迁移失败：${error instanceof Error ? error.message : '未知错误'}` 
      };
    }
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