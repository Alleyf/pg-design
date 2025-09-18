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
  
  // 新增摄影专业字段
  shootingLogs?: ShootingLog[];
  postProduction?: PostProduction;
  templates?: string[]; // 使用的模板
}

export interface Equipment {
  id: string;
  name: string;
  type: 'camera' | 'lens' | 'lighting' | 'accessory' | 'tripod' | 'filter' | 'memory' | 'battery';
  isRequired: boolean;
  brand?: string;
  model?: string;
  notes?: string;
  // 新增器材管理字段
  serialNumber?: string;
  purchaseDate?: Date;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  rentalInfo?: {
    isRental: boolean;
    rentalCompany?: string;
    rentalCost?: number;
    rentalPeriod?: string;
    returnDate?: Date;
  };
  specifications?: {
    focalLength?: string; // 镜头焦距
    aperture?: string; // 光圈范围
    sensorSize?: string; // 传感器尺寸
    megapixels?: number; // 像素数
    isoRange?: string; // ISO范围
    weight?: number; // 重量(kg)
    dimensions?: string; // 尺寸
  };
  maintenance?: {
    lastService?: Date;
    nextService?: Date;
    serviceNotes?: string;
  };
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
  // 新增摄影专业字段
  goldenHour?: {
    sunrise: string;
    sunset: string;
    goldenHourStart: string;
    goldenHourEnd: string;
  };
  weatherForecast?: {
    date: string;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  locationDetails?: {
    address: string;
    coordinates?: { lat: number; lng: number };
    parkingInfo?: string;
    accessInfo?: string;
    restrictions?: string[];
    bestShootingSpots?: string[];
  };
  lightingConditions?: {
    naturalLight: boolean;
    artificialLight: boolean;
    lightDirection?: string;
    lightIntensity?: 'low' | 'medium' | 'high';
    colorTemperature?: number;
  };
}

export interface ClientInfo {
  name: string;
  contact: string;
  company?: string;
  requirements: string;
  deliveryDate?: Date;
  deliveryFormat: string[];
  // 新增客户管理字段
  preferences?: {
    style?: string[];
    colors?: string[];
    mood?: string[];
    avoidElements?: string[];
  };
  history?: {
    previousProjects: string[];
    totalSpent: number;
    lastProjectDate?: Date;
  };
  contract?: {
    signed: boolean;
    contractDate?: Date;
    terms?: string;
    paymentTerms?: string;
  };
}

// 新增：拍摄日志
export interface ShootingLog {
  id: string;
  date: Date;
  session: string; // 拍摄场次
  location: string;
  weather: string;
  equipment: string[]; // 使用的器材
  settings: {
    camera: string;
    lens: string;
    aperture: string;
    shutterSpeed: string;
    iso: number;
    focalLength: string;
  };
  notes: string;
  challenges: string[];
  solutions: string[];
  lessonsLearned: string[];
  images: {
    total: number;
    keepers: number;
    favorites: number;
  };
}

// 新增：后期制作规划
export interface PostProduction {
  id: string;
  workflow: {
    software: string[];
    steps: string[];
    estimatedTime: number; // 小时
  };
  deliverables: {
    format: string[];
    resolution: string[];
    colorSpace: string;
    compression: string;
  };
  timeline: {
    culling: Date;
    editing: Date;
    colorGrading: Date;
    retouching: Date;
    delivery: Date;
  };
  notes: string;
}