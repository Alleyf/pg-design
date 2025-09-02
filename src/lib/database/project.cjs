// 数据库访问层 (CommonJS版本)
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL和Anon Key必须在.env文件中配置');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 导出服务对象
module.exports = {
  ProjectService: {
    async getAllProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      if (error) throw error;
      return data;
    }
  }
};