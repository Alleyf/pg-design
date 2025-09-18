import React, { useState } from 'react';
import { ProjectList } from './components/ProjectList';
import { ProjectDetail } from './components/ProjectDetail';
import { Header } from './components/Header';
import { CreateProjectModal } from './components/CreateProjectModal';
import { Project } from './types/project';
import { useLocalStorage } from './hooks/useLocalStorage';

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

  // 使用本地存储管理项目数据
  const [projects, setProjects] = useLocalStorage<Project[]>('photodesign_projects', sampleProjects);
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage<string | null>('photodesign_selected_project', null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 根据 ID 查找选中的项目
  const selectedProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) || null : null;

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    setIsCreateModalOpen(false);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => 
      p.id === updatedProject.id 
        ? { ...updatedProject, updatedAt: new Date() }
        : p
    ));
    // 无需更新 selectedProject，因为它会自动从 projects 中查找
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProjectId(null);
      // 添加延迟以确保状态更新
      setTimeout(() => {
        if (window.location.pathname !== '/') {
          window.history.pushState({}, '', '/');
        }
      }, 0);
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProjectId(project.id);
  };

  const handleImportProject = (projectsData: Project[]) => {
    setProjects(projectsData);
  };

  // 处理数据变更（导入/清空后需要重新加载数据）
  const handleDataChanged = () => {
    // 强制重新加载页面以确保数据同步
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header
        onCreateProject={() => setIsCreateModalOpen(true)}
        onBackToProjects={selectedProject ? () => setSelectedProjectId(null) : undefined}
        onDataChanged={handleDataChanged}
        onShareAll={async () => {
          try {
            const text = JSON.stringify(projects, null, 2);
            const shareData: ShareData = {
              title: 'PG Design 项目列表',
              text,
            };
            if (navigator.share) {
              await navigator.share(shareData);
            } else if (navigator.clipboard) {
              await navigator.clipboard.writeText(text);
              alert('已复制所有项目到剪贴板');
            } else {
              const blob = new Blob([text], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'projects.json';
              a.click();
              URL.revokeObjectURL(url);
            }
          } catch (e) {
            console.error(e);
            alert('分享失败，请重试');
          }
        }}
      />
      {isCreateModalOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProject}
        />
      )}
      <main className="container mx-auto p-4">
        {selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            onUpdate={handleUpdateProject}
            onDelete={(projectId) => handleDeleteProject(projectId)}
          />
        ) : (
          <ProjectList
            projects={projects}
            onSelectProject={handleSelectProject}
            onDeleteProject={handleDeleteProject} // 添加这个prop
            onCreateProject={() => setIsCreateModalOpen(true)}
          />
        )}
      </main>
    </div>
  );
}

export default App;