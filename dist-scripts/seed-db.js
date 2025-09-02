import { ProjectService, ClientService } from '../src/lib/database/project';
// 测试数据
const testClients = [
    {
        name: '时尚杂志社',
        contact_person: '张编辑',
        email: 'zhang@example.com',
        phone: '13800138000',
        company: '时尚传媒集团'
    },
    {
        name: '婚礼策划公司',
        contact_person: '李经理',
        email: 'li@example.com',
        phone: '13900139000'
    }
];
const testProjects = [
    {
        title: '秋季时尚大片拍摄',
        description: '为时尚杂志拍摄秋季服装系列',
        type: 'portrait',
        status: 'in-progress',
        shoot_date: new Date('2025-10-15'),
        location: '北京摄影棚',
        budget: 50000,
        concept: '展现秋季服装的温暖与质感',
        mood: '温暖、高级、自然'
    },
    {
        title: '婚礼跟拍',
        description: '为新人记录婚礼全过程',
        type: 'wedding',
        status: 'scheduled',
        shoot_date: new Date('2025-11-20'),
        location: '上海花园酒店',
        budget: 20000
    }
];
// 插入测试数据
async function seedDatabase() {
    try {
        // 插入客户
        const clients = await Promise.all(testClients.map(client => ClientService.addClient(client)));
        // 插入项目
        const projects = await Promise.all(testProjects.map(project => ProjectService.createProject(project)));
        // 关联项目与客户
        await ClientService.linkProjectToClient(projects[0].id, clients[0].id);
        await ClientService.linkProjectToClient(projects[1].id, clients[1].id);
        console.log('数据库测试数据插入成功');
    }
    catch (error) {
        console.error('插入测试数据失败:', error);
    }
}
seedDatabase();
