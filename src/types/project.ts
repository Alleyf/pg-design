export interface Project {
  id: string;
  title: string;
  description: string;
  type: 'portrait' | 'landscape' | 'product' | 'wedding' | 'event' | 'commercial' | 'other';
  status: 'planning' | 'scheduled' | 'in-progress' | 'completed';
  shootDate?: Date;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  coverImage?: string; // 项目封面图
  
  // 拍摄详情
  concept: string;
  mood: string;
  equipment: Equipment[];
  props: string[];
  wardrobe: string[];
  team: TeamMember[];
  
  // 灵感板
  inspirationImages: InspirationImage[];
  
  // 任务清单
  checklist: ChecklistItem[];
  
  // 预算
  budget?: number;
  expenses: Expense[];
  notes: string;
  
  // 拍摄设置
  shootingSettings: ShootingSettings;
  
  // 客户信息
  client?: ClientInfo;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'camera' | 'lens' | 'lighting' | 'accessory';
  isRequired: boolean;
  brand?: string;
  model?: string;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  contact: string;
  confirmed: boolean;
  rate?: number;
  paymentStatus: 'pending' | 'paid' | 'not-applicable';
}

export interface InspirationImage {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  category: 'pose' | 'lighting' | 'composition' | 'color' | 'mood' | 'other';
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  dueDate?: Date;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'equipment' | 'location' | 'team' | 'creative' | 'logistics' | 'other';
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'equipment' | 'location' | 'team' | 'props' | 'travel' | 'other';
  status: 'planned' | 'confirmed' | 'paid';
  date?: Date;
}

export interface ShootingSettings {
  duration: number; // 拍摄时长（小时）
  startTime?: string;
  endTime?: string;
  weatherRequirement?: string;
  backupPlan?: string;
  specialRequirements: string[];
}

export interface ClientInfo {
  name: string;
  contact: string;
  company?: string;
  requirements: string;
  deliveryDate?: Date;
  deliveryFormat: string[];
}