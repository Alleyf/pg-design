export type ProjectType = 'portrait' | 'landscape' | 'product' | 'wedding' | 'event' | 'commercial' | 'other';

export type ProjectStatus = 'planning' | 'scheduled' | 'in-progress' | 'completed';

export interface TeamMemberUI {
  id: string;
  name: string;
  role?: string;
  rate?: number;
  confirmed: boolean;
  contact?: string;
  paymentStatus?: 'pending' | 'paid' | 'overdue';
}

export interface ChecklistItemUI {
  id: string;
  task: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
}

export interface ExpenseUI {
  id: string;
  description: string;
  amount: number;
  category?: string;
  status?: 'planned' | 'confirmed' | 'paid';
  date?: Date;
}

export interface InspirationUI {
  id: string;
  imageUrl: string;
  notes?: string;
  tags?: string[];
}

export interface ShootingSettingsUI {
  duration: number; // hours
  specialRequirements: string[];
}

export interface ProjectUI {
  id: string;
  title: string;
  description?: string;
  type: ProjectType;
  status: ProjectStatus;
  location?: string;
  concept?: string;
  mood?: string;
  coverImage?: string;
  equipment: string[];
  props: string[];
  wardrobe: string[];
  team: TeamMemberUI[];
  inspirationImages: InspirationUI[];
  checklist: ChecklistItemUI[];
  budget?: number;
  expenses: ExpenseUI[];
  notes?: string;
  shootDate?: Date;
  shootingSettings: ShootingSettingsUI;
  createdAt: Date;
  updatedAt: Date;
}


