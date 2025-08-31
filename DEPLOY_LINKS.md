## 🚀 部署链接配置说明

本文档说明如何正确配置 README.md 中的一键部署链接。

### 📝 使用步骤

1. **Fork 本项目**到您的 GitHub 账户
2. **替换用户名**：将以下链接中的 `%3Cusername%3E` 替换为您的 GitHub 用户名
3. **更新 README.md** 中的部署链接

### 🔗 链接替换示例

**原链接**（需要替换）：
```
https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F%3Cusername%3E%2FPhotoDesign
```

**替换后**（假设您的用户名是 `johndoe`）：
```
https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjohndoe%2FPhotoDesign
```

### 📋 需要更新的位置

在 `README.md` 文件中，需要将以下位置的 `%3Cusername%3E` 替换为您的实际 GitHub 用户名：

1. **顶部快速部署按钮**：
   - Vercel 部署链接
   - Netlify 部署链接

2. **Vercel 部署章节**：
   - 一键部署按钮链接

3. **Netlify 部署章节**：
   - 一键部署按钮链接

4. **快速部署命令表格**：
   - Vercel 一键部署链接
   - Netlify 一键部署链接

### ✅ 验证链接

替换完成后，您可以：

1. **点击链接测试**：确保链接指向您的仓库
2. **检查 URL 编码**：确保 GitHub 用户名正确编码
3. **测试部署流程**：验证一键部署功能正常

### 🎯 最终效果

正确配置后，用户点击部署按钮将：

1. **Vercel**：自动跳转到 Vercel 部署页面，预填您的仓库信息
2. **Netlify**：自动跳转到 Netlify 部署页面，选择您的仓库进行部署

### 📞 获取帮助

如果遇到问题，请：

1. 检查 GitHub 用户名拼写
2. 确认仓库是公开的
3. 验证仓库名称为 `PhotoDesign`
4. 提交 Issue 寻求帮助