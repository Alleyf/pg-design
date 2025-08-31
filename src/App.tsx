import React, { useState } from 'react';
import { ProjectList } from './components/ProjectList';
import { ProjectDetail } from './components/ProjectDetail';
import { Header } from './components/Header';
import { CreateProjectModal } from './components/CreateProjectModal';
import { Project } from './types/project';

function App() {
  // 示例项目数据
  const sampleProjects: Project[] = [
    {
      id: '1',
      title: '春日花海人像拍摄',
      description: '在樱花盛开的季节，拍摄温馨浪漫的人像作品',
      type: 'portrait',
      status: 'planning',
      location: '杭州西湖',
      concept: '春日暖阳下的自然人像',
      mood: '温馨、浪漫、自然',
      coverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face',
      equipment: [],
      props: [],
      wardrobe: [],
      team: [],
      inspirationImages: [],
      checklist: [
        { id: '1', task: '确认拍摄场地', completed: true, priority: 'high', category: 'location' },
        { id: '2', task: '准备拍摄道具', completed: false, priority: 'medium', category: 'equipment' }
      ],
      budget: 2000,
      expenses: [],
      notes: '注意天气变化',
      shootDate: new Date(2024, 3, 15),
      shootingSettings: {
        duration: 3,
        specialRequirements: ['自然光拍摄']
      },
      createdAt: new Date(2024, 2, 1),
      updatedAt: new Date(2024, 2, 5)
    },
    {
      id: '2',
      title: '产品拍摄 - 时尚手表',
      description: '高端手表产品的商业摄影',
      type: 'product',
      status: 'scheduled',
      location: '专业摄影棚',
      concept: '简约现代风格',
      mood: '简约、精致、专业',
      coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      equipment: [],
      props: [],
      wardrobe: [],
      team: [
        { id: '1', name: '张摄影师', role: '摄影师', contact: '13800138000', confirmed: true, rate: 800, paymentStatus: 'pending' }
      ],
      inspirationImages: [],
      checklist: [],
      budget: 3000,
      expenses: [],
      notes: '',
      shootDate: new Date(2024, 3, 20),
      shootingSettings: {
        duration: 4,
        specialRequirements: ['专业灯光']
      },
      createdAt: new Date(2024, 2, 10),
      updatedAt: new Date(2024, 2, 12)
    }
  ];

  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects(prev => [newProject, ...prev]);
    setSelectedProject(newProject);
    setIsCreateModalOpen(false);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => 
      p.id === updatedProject.id 
        ? { ...updatedProject, updatedAt: new Date() }
        : p
    ));
    setSelectedProject({ ...updatedProject, updatedAt: new Date() });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header 
        onCreateProject={() => setIsCreateModalOpen(true)}
        onBackToProjects={selectedProject ? () => setSelectedProject(null) : undefined}
      />
      
      <main className="container mx-auto px-4 py-8">
        {selectedProject ? (
          <ProjectDetail 
            project={selectedProject}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
          />
        ) : (
          <ProjectList 
            projects={projects}
            onSelectProject={setSelectedProject}
            onCreateProject={() => setIsCreateModalOpen(true)}
          />
        )}
      </main>

      {isCreateModalOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
}

export default App;