// 项目基础类型
export interface ProjectBase {
  id: string;
  title: string;
  description?: string;
  type: 'portrait' | 'landscape' | 'product' | 'wedding' | 'event' | 'commercial' | 'other';
  status: 'planning' | 'scheduled' | 'in-progress' | 'completed';
  shoot_date?: Date;
  location?: string;
  budget?: number;
  concept?: string;
  mood?: string;
  notes?: string;
  cover_image?: string;
  created_at: Date;
  updated_at: Date;
}

// 团队成员类型
export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  rate?: number;
  confirmed: boolean;
  contact?: string;
}

// 任务清单类型
export interface ChecklistItem {
  id: string;
  description: string;
  due_date?: Date;
  completed: boolean;
  assigned_to?: string;
}

// 项目费用类型
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'equipment' | 'location' | 'team' | 'props' | 'travel' | 'other';
  status: 'planned' | 'confirmed' | 'paid';
  date: Date;
}

// 灵感板类型
export interface Inspiration {
  id: string;
  image_url: string;
  notes?: string;
  tags?: string[];
}

// 器材设备类型
export interface Equipment {
  id: string;
  name: string;
  quantity?: number;
  notes?: string;
}

// 客户类型
export interface Client {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// 完整项目类型
export interface Project extends ProjectBase {
  team: TeamMember[];
  checklist: ChecklistItem[];
  expenses: Expense[];
  inspiration_images: Inspiration[];
  equipment: Equipment[];
  clients: Client[];
}