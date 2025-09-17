// 查询Supabase数据库表数据
import * as dotenv from 'dotenv'
dotenv.config()

const { ProjectService } = require('../src/lib/database/project.js')

async function main() {
  try {
    console.log('正在查询项目数据...')
    const projects = await ProjectService.getAllProjects()
    
    console.log('\n成功获取项目数据:')
    console.log(`共 ${projects.length} 个项目`)
    console.log('示例项目:', projects[0])
    
    if (projects.length > 0) {
      console.log('\n字段映射验证:')
      console.log('- cover_image:', projects[0].cover_image)
      console.log('- shoot_date:', projects[0].shoot_date)
      console.log('- updated_at:', projects[0].updated_at)
    }
  } catch (error) {
    console.error('查询失败:', error)
  }
}

main()