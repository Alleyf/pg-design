import { createClient } from '@supabase/supabase-js';
import { Project, TeamMember, ChecklistItem, Expense, Inspiration, Equipment, Client, ProjectBase } from '../../types/project.js';

// 浏览器环境使用import.meta.env，Node.js环境使用process.env
const supabaseUrl = typeof window !== 'undefined' 
  ? import.meta.env.VITE_SUPABASE_URL 
  : process.env.VITE_SUPABASE_URL;

const supabaseKey = typeof window !== 'undefined'
  ? import.meta.env.VITE_SUPABASE_ANON_KEY
  : process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 项目CRUD操作
const ProjectService = {
  // 获取所有项目
  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        team:project_team(*),
        checklist:project_checklist(*),
        expenses:project_expenses(*),
        inspiration_images:project_inspiration(*),
        equipment:project_equipment(*),
        clients:project_clients(*)
      `);
    
    if (error) throw error;
    return data as Project[];
  },

  // 获取单个项目
  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        team:project_team(*),
        checklist:project_checklist(*),
        expenses:project_expenses(*),
        inspiration_images:project_inspiration(*),
        equipment:project_equipment(*),
        clients:project_clients(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data as Project;
  },

  // 创建项目
  async createProject(project: Omit<ProjectBase, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  // 更新项目
  async updateProject(id: string, updates: Partial<ProjectBase>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  // 删除项目
  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 导出所有服务
export {
  ProjectService,
  TeamService,
  ChecklistService,
  ExpenseService,
  InspirationService,
  EquipmentService,
  ClientService
};

// 团队成员操作
export const TeamService = {
  // 添加团队成员
  async addTeamMember(projectId: string, member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('project_team')
      .insert({ ...member, project_id: projectId })
      .select()
      .single();
    
    if (error) throw error;
    return data as TeamMember;
  },

  // 更新团队成员
  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('project_team')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as TeamMember;
  },

  // 删除团队成员
  async removeTeamMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('project_team')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 任务清单服务
export const ChecklistService = {
  // 添加任务
  async addTask(projectId: string, task: Omit<ChecklistItem, 'id'>): Promise<ChecklistItem> {
    const { data, error } = await supabase
      .from('project_checklist')
      .insert({ ...task, project_id: projectId })
      .select()
      .single();
    
    if (error) throw error;
    return data as ChecklistItem;
  },

  // 更新任务
  async updateTask(id: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem> {
    const { data, error } = await supabase
      .from('project_checklist')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as ChecklistItem;
  },

  // 删除任务
  async removeTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('project_checklist')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 费用服务
export const ExpenseService = {
  // 添加费用
  async addExpense(projectId: string, expense: Omit<Expense, 'id' | 'date'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('project_expenses')
      .insert({ ...expense, project_id: projectId })
      .select()
      .single();
    
    if (error) throw error;
    return data as Expense;
  },

  // 更新费用
  async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
    const { data, error } = await supabase
      .from('project_expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Expense;
  },

  // 删除费用
  async removeExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from('project_expenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 灵感板服务
export const InspirationService = {
  // 添加灵感图片
  async addInspiration(projectId: string, inspiration: Omit<Inspiration, 'id'>): Promise<Inspiration> {
    const { data, error } = await supabase
      .from('project_inspiration')
      .insert({ ...inspiration, project_id: projectId })
      .select()
      .single();
    
    if (error) throw error;
    return data as Inspiration;
  },

  // 删除灵感图片
  async removeInspiration(id: string): Promise<void> {
    const { error } = await supabase
      .from('project_inspiration')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 器材设备服务
export const EquipmentService = {
  // 添加设备
  async addEquipment(projectId: string, equipment: Omit<Equipment, 'id'>): Promise<Equipment> {
    const { data, error } = await supabase
      .from('project_equipment')
      .insert({ ...equipment, project_id: projectId })
      .select()
      .single();
    
    if (error) throw error;
    return data as Equipment;
  },

  // 更新设备
  async updateEquipment(id: string, updates: Partial<Equipment>): Promise<Equipment> {
    const { data, error } = await supabase
      .from('project_equipment')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Equipment;
  },

  // 删除设备
  async removeEquipment(id: string): Promise<void> {
    const { error } = await supabase
      .from('project_equipment')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 客户服务
export const ClientService = {
  // 添加客户
  async addClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) throw error;
    return data as Client;
  },

  // 关联项目与客户
  async linkProjectToClient(projectId: string, clientId: string): Promise<void> {
    const { error } = await supabase
      .from('project_clients')
      .insert({ project_id: projectId, client_id: clientId });
    
    if (error) throw error;
  }
};