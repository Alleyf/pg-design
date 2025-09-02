import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Anon Key must be provided in .env file');
}
const supabase = createClient(supabaseUrl, supabaseKey);
// 项目CRUD操作
export const ProjectService = {
    // 获取所有项目
    async getAllProjects() {
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
        if (error)
            throw error;
        return data;
    },
    // 获取单个项目
    async getProjectById(id) {
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
        if (error)
            return null;
        return data;
    },
    // 创建项目
    async createProject(project) {
        const { data, error } = await supabase
            .from('projects')
            .insert(project)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // 更新项目
    async updateProject(id, updates) {
        const { data, error } = await supabase
            .from('projects')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // 删除项目
    async deleteProject(id) {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    }
};
// 团队成员操作
export const TeamService = {
    // 添加团队成员
    async addTeamMember(projectId, member) {
        const { data, error } = await supabase
            .from('project_team')
            .insert({ ...member, project_id: projectId })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // 更新团队成员
    async updateTeamMember(id, updates) {
        const { data, error } = await supabase
            .from('project_team')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // 删除团队成员
    async removeTeamMember(id) {
        const { error } = await supabase
            .from('project_team')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    }
};
// 任务清单服务
export const ChecklistService = {
    // 添加任务
    async addTask(projectId, task) {
        const { data, error } = await supabase
            .from('project_checklist')
            .insert({ ...task, project_id: projectId })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // 更新任务
    async updateTask(id, updates) {
        const { data, error } = await supabase
            .from('project_checklist')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // 删除任务
    async removeTask(id) {
        const { error } = await supabase
            .from('project_checklist')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    }
};
// 费用服务
export const ExpenseService = {
    // 添加费用
    async addExpense(projectId, expense) {
        const { data, error } = await supabase
            .from('project_expenses')
            .insert({ ...expense, project_id: projectId })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // 更新费用
    async updateExpense(id, updates) {
        const { data, error } = await supabase
            .from('project_expenses')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // 删除费用
    async removeExpense(id) {
        const { error } = await supabase
            .from('project_expenses')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    }
};
// 灵感板服务
export const InspirationService = {
    // 添加灵感图片
    async addInspiration(projectId, inspiration) {
        const { data, error } = await supabase
            .from('project_inspiration')
            .insert({ ...inspiration, project_id: projectId })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // 删除灵感图片
    async removeInspiration(id) {
        const { error } = await supabase
            .from('project_inspiration')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    }
};
// 器材设备服务
export const EquipmentService = {
    // 添加设备
    async addEquipment(projectId, equipment) {
        const { data, error } = await supabase
            .from('project_equipment')
            .insert({ ...equipment, project_id: projectId })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // 更新设备
    async updateEquipment(id, updates) {
        const { data, error } = await supabase
            .from('project_equipment')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // 删除设备
    async removeEquipment(id) {
        const { error } = await supabase
            .from('project_equipment')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    }
};
// 客户服务
export const ClientService = {
    // 添加客户
    async addClient(client) {
        const { data, error } = await supabase
            .from('clients')
            .insert(client)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // 关联项目与客户
    async linkProjectToClient(projectId, clientId) {
        const { error } = await supabase
            .from('project_clients')
            .insert({ project_id: projectId, client_id: clientId });
        if (error)
            throw error;
    }
};
