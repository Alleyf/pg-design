// 简单测试Supabase连接
import('./dist-scripts/src/lib/database/project.js')
  .then(({ ProjectService }) => {
    console.log('正在测试Supabase连接...');
    return ProjectService.getAllProjects();
  })
  .then(projects => {
    console.log('Supabase连接成功！');
    console.log('项目数量:', projects.length);
    if (projects.length > 0) {
      console.log('示例项目:', projects[0].title);
    }
  })
  .catch(error => {
    console.error('Supabase连接失败:', error.message);
  });