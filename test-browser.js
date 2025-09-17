// 测试浏览器环境中的Supabase连接
console.log('测试浏览器环境Supabase配置...');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '已设置' : '未设置');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '已设置' : '未设置');

if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.log('✅ 浏览器环境Supabase配置正确');
} else {
  console.log('❌ 浏览器环境Supabase配置缺失');
}