const { ProjectService } = require('../src/lib/database/project');

async function main() {
  try {
    const projects = await ProjectService.getAllProjects();
    console.log('项目数据:', projects);
    console.log(`共 ${projects.length} 个项目`);
  } catch (error) {
    console.error('查询失败:', error);
  }
}

main();