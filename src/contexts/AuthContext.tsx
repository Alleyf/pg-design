import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, AuthState, AuthContextType } from '../types/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage<User | null>('photodesign_user', null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // 清除错误信息
  const clearError = () => setError(null);

  // 登录
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // 从本地存储获取用户数据
      const users = JSON.parse(localStorage.getItem('photodesign_users') || '[]');
      const user = users.find((u: User) => u.email === credentials.email);

      if (!user) {
        setError('用户不存在');
        return false;
      }

      // 简单的密码验证（实际应用中应该使用哈希）
      if (user.password !== credentials.password) {
        setError('密码错误');
        return false;
      }

      // 更新最后登录时间
      const updatedUser = {
        ...user,
        lastLoginAt: new Date(),
        password: undefined // 不保存密码到状态中
      };

      setUser(updatedUser);
      return true;
    } catch (err) {
      setError('登录失败，请重试');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册
  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // 验证密码确认
      if (data.password !== data.confirmPassword) {
        setError('两次输入的密码不一致');
        return false;
      }

      // 验证密码长度
      if (data.password.length < 6) {
        setError('密码长度至少6位');
        return false;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        setError('邮箱格式不正确');
        return false;
      }

      // 检查用户是否已存在
      const users = JSON.parse(localStorage.getItem('photodesign_users') || '[]');
      if (users.find((u: User) => u.email === data.email)) {
        setError('该邮箱已被注册');
        return false;
      }

      if (users.find((u: User) => u.username === data.username)) {
        setError('该用户名已被使用');
        return false;
      }

      // 创建新用户
      const newUser: User = {
        id: Date.now().toString(),
        username: data.username,
        email: data.email,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'dark',
          language: 'zh',
          notifications: true
        }
      };

      // 保存用户数据（包含密码用于验证）
      const userWithPassword = { ...newUser, password: data.password };
      users.push(userWithPassword);
      localStorage.setItem('photodesign_users', JSON.stringify(users));

      // 设置当前用户（不包含密码）
      setUser(newUser);
      return true;
    } catch (err) {
      setError('注册失败，请重试');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出
  const logout = () => {
    setUser(null);
    setError(null);
  };

  // 更新用户资料
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);

      // 更新本地存储中的用户数据
      const users = JSON.parse(localStorage.getItem('photodesign_users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('photodesign_users', JSON.stringify(users));
      }

      return true;
    } catch (err) {
      setError('更新资料失败');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 修改密码
  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    setError(null);

    try {
      // 验证旧密码
      const users = JSON.parse(localStorage.getItem('photodesign_users') || '[]');
      const userData = users.find((u: User) => u.id === user.id);
      
      if (!userData || userData.password !== oldPassword) {
        setError('原密码错误');
        return false;
      }

      // 更新密码
      userData.password = newPassword;
      localStorage.setItem('photodesign_users', JSON.stringify(users));

      return true;
    } catch (err) {
      setError('修改密码失败');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
