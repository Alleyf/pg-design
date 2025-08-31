import React, { useState } from 'react';
import { Plus, X, DollarSign, TrendingUp, PieChart } from 'lucide-react';
import { Project, Expense } from '../../types/project';

interface BudgetManagerProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

const expenseCategories = [
  { value: 'equipment', label: '器材租赁', color: 'bg-blue-500' },
  { value: 'location', label: '场地费用', color: 'bg-green-500' },
  { value: 'team', label: '人员费用', color: 'bg-purple-500' },
  { value: 'props', label: '道具采购', color: 'bg-yellow-500' },
  { value: 'travel', label: '交通住宿', color: 'bg-red-500' },
  { value: 'other', label: '其他费用', color: 'bg-gray-500' },
];

export function BudgetManager({ project, onUpdate }: BudgetManagerProps) {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'other' as Expense['category'],
    status: 'planned' as Expense['status'],
  });

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      status: newExpense.status,
      date: new Date(),
    };

    onUpdate({
      ...project,
      expenses: [...project.expenses, expense],
    });

    setNewExpense({ description: '', amount: '', category: 'other', status: 'planned' });
    setIsAddingExpense(false);
  };

  const removeExpense = (expenseId: string) => {
    onUpdate({
      ...project,
      expenses: project.expenses.filter(exp => exp.id !== expenseId),
    });
  };

  const updateExpenseStatus = (expenseId: string, status: Expense['status']) => {
    onUpdate({
      ...project,
      expenses: project.expenses.map(exp =>
        exp.id === expenseId ? { ...exp, status } : exp
      ),
    });
  };

  const totalExpenses = project.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const teamCosts = project.team.reduce((sum, member) => sum + (member.rate || 0), 0);
  const totalBudget = totalExpenses + teamCosts;
  const plannedBudget = project.budget || 0;
  const budgetUsage = plannedBudget > 0 ? (totalBudget / plannedBudget) * 100 : 0;

  const expensesByCategory = expenseCategories.map(category => ({
    ...category,
    amount: project.expenses
      .filter(exp => exp.category === category.value)
      .reduce((sum, exp) => sum + exp.amount, 0),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">预算管理</h3>
          <p className="text-gray-400">跟踪项目费用和预算使用情况</p>
        </div>
        <button
          onClick={() => setIsAddingExpense(true)}
          className="flex items-center space-x-2 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>添加费用</span>
        </button>
      </div>

      {/* 预算概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-400 mb-1">¥{plannedBudget}</div>
          <div className="text-gray-300 text-sm">计划预算</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-400 mb-1">¥{totalExpenses}</div>
          <div className="text-gray-300 text-sm">项目费用</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <PieChart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-400 mb-1">¥{teamCosts}</div>
          <div className="text-gray-300 text-sm">人员费用</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <div className={`text-2xl font-bold mb-1 ${
            budgetUsage > 100 ? 'text-red-400' : 
            budgetUsage > 80 ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {budgetUsage.toFixed(0)}%
          </div>
          <div className="text-gray-300 text-sm">预算使用率</div>
        </div>
      </div>

      {/* 预算使用进度条 */}
      {plannedBudget > 0 && (
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">预算使用情况</h4>
            <span className={`font-medium ${
              budgetUsage > 100 ? 'text-red-400' : 
              budgetUsage > 80 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              ¥{totalBudget} / ¥{plannedBudget}
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-300 ${
                budgetUsage > 100 ? 'bg-red-500' : 
                budgetUsage > 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetUsage, 100)}%` }}
            />
          </div>
          {budgetUsage > 100 && (
            <p className="text-red-400 text-sm mt-2">⚠️ 预算已超支 ¥{totalBudget - plannedBudget}</p>
          )}
        </div>
      )}

      {/* 分类费用统计 */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">费用分类</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expensesByCategory.map((category) => (
            <div key={category.value} className="bg-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${category.color}`} />
                <span className="text-gray-300 text-sm">{category.label}</span>
              </div>
              <div className="text-xl font-bold text-white">¥{category.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {isAddingExpense && (
        <div className="bg-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">添加费用项目</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">费用描述 *</label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                placeholder="例如：相机租赁、场地费等"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">金额 (¥) *</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">分类</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value as Expense['category'] }))}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
              >
                {expenseCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 mt-4">
            <button
              onClick={() => setIsAddingExpense(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleAddExpense}
              className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
            >
              添加费用
            </button>
          </div>
        </div>
      )}

      {/* 费用列表 */}
      <div className="space-y-3">
        {project.expenses.map((expense) => {
          const categoryInfo = expenseCategories.find(cat => cat.value === expense.category);
          return (
            <div key={expense.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${categoryInfo?.color}`} />
                  <div>
                    <span className="text-white font-medium">{expense.description}</span>
                    <div className="text-sm text-gray-400">{categoryInfo?.label}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-bold text-amber-400">¥{expense.amount}</span>
                  <select
                    value={expense.status}
                    onChange={(e) => updateExpenseStatus(expense.id, e.target.value as Expense['status'])}
                    className={`text-xs px-2 py-1 rounded border-0 ${
                      expense.status === 'paid' ? 'bg-green-600 text-white' :
                      expense.status === 'confirmed' ? 'bg-yellow-600 text-white' :
                      'bg-gray-600 text-gray-300'
                    }`}
                  >
                    <option value="planned">计划中</option>
                    <option value="confirmed">已确认</option>
                    <option value="paid">已支付</option>
                  </select>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {project.expenses.length === 0 && (
        <div className="text-center py-12 bg-gray-700 rounded-lg">
          <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium mb-2">还没有费用记录</h4>
          <p className="text-gray-400">添加项目相关的费用来跟踪预算使用情况</p>
        </div>
      )}
    </div>
  );
}