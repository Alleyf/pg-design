// 查询Supabase数据库表数据 (CommonJS版本)
require('dotenv').config();

const { ProjectService } = require('../src/lib/database/project.cjs');

async function main() {
  try {
    console.log('正在查询项目数据...');
    const projects = await ProjectService.getAllProjects();
    
    console.log('\n成功获取项目数据:');
    console.log(`共 ${projects.length} 个项目`);
    if (projects.length > 0) {
      console.log('首个项目:', {
        id: projects[0].id,
        title: projects[0].title,
        cover_image: projects[0].cover_image,
        shoot_date: projects[0].shoot_date
      });
    }
  } catch (error) {
    console.error('查询失败:', error);
  }
}

main();