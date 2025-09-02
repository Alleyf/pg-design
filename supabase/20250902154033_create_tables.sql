-- 主项目表
create table projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  type text not null,
  status text not null,
  shoot_date timestamp,
  location text,
  budget numeric,
  concept text,
  mood text,
  notes text,
  cover_image text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 客户表
create table clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  contact_person text,
  email text,
  phone text,
  company text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 项目-客户关联表
create table project_clients (
  project_id uuid references projects(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade,
  primary key (project_id, client_id)
);

-- 项目费用表
create table project_expenses (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  description text not null,
  amount numeric not null,
  category text not null,
  status text not null,
  date timestamp with time zone default now()
);

-- 团队成员表
create table project_team (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  role text,
  rate numeric,
  confirmed boolean default false,
  contact text
);

-- 任务清单表
create table project_checklist (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  description text not null,
  due_date timestamp with time zone,
  completed boolean default false,
  assigned_to uuid references project_team(id) on delete set null
);

-- 灵感板表
create table project_inspiration (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  image_url text not null,
  notes text,
  tags text[]
);

-- 器材设备表
create table project_equipment (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  quantity integer default 1,
  notes text
);


