import { useState, useEffect } from 'react';

/**
 * 自定义 Hook：管理 localStorage 中的数据
 * @param key localStorage 的键名
 * @param initialValue 初始值
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 从 localStorage 读取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      
      if (item === null) {
        return initialValue;
      }
      
      // 解析 JSON，特别处理日期字段
      const parsedValue = JSON.parse(item, (key, value) => {
        // 检查是否是日期字符串格式
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });
      
      return parsedValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 返回一个被包装的 setValue 函数，同时更新本地状态和 localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      console.log(`useLocalStorage setValue called for key "${key}"`);
      console.log('Current storedValue:', storedValue);
      console.log('New value:', value);
      
      // 允许 value 是一个函数，这样可以基于当前值进行更新
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      console.log('Value to store:', valueToStore);
      
      // 保存状态
      setStoredValue(valueToStore);
      console.log('setStoredValue called');
      
      // 保存到 localStorage
      if (typeof window !== 'undefined') {
        const jsonString = JSON.stringify(valueToStore);
        console.log('Saving to localStorage:', jsonString);
        window.localStorage.setItem(key, jsonString);
        console.log('localStorage updated');
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 监听其他标签页中对同一 key 的修改
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // 只监听其他标签页的修改，忽略当前标签页的修改
      if (e.key === key && e.newValue !== null && e.storageArea === localStorage) {
        try {
          const newValue = JSON.parse(e.newValue, (key, value) => {
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
              return new Date(value);
            }
            return value;
          });
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    // 暂时禁用 storage 事件监听器来测试删除功能
    // window.addEventListener('storage', handleStorageChange);
    // return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}

/**
 * 清除 localStorage 中的特定键
 * @param key 要清除的键名
 */
export function clearLocalStorage(key: string) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error clearing localStorage key "${key}":`, error);
  }
}

/**
 * 获取 localStorage 的存储大小
 */
export function getLocalStorageSize() {
  let total = 0;
  if (typeof window !== 'undefined') {
    for (const key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        total += window.localStorage[key].length + key.length;
      }
    }
  }
  return total;
}