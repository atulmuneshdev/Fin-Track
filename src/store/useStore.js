import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions } from '../data/mockData';

const useStore = create(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      role: 'admin', // 'admin' | 'viewer'
      isAuthenticated: false,
      user: null,

      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
      updateUser: (user) => set({ user }),
      
      setRole: (role) => set({ role }),
      
      addTransaction: (transaction) => 
        set((state) => ({ 
          transactions: [
            { ...transaction, id: Math.random().toString(36).substr(2, 9) },
            ...state.transactions 
          ] 
        })),
        
      editTransaction: (id, updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) => 
            t.id === id ? { ...t, ...updatedTransaction } : t
          ),
        })),
        
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      getTotals: () => {
        const { transactions } = get();
        const income = transactions
          .filter((t) => t.type === 'income')
          .reduce((acc, curr) => acc + curr.amount, 0);
        const expenses = transactions
          .filter((t) => t.type === 'expense')
          .reduce((acc, curr) => acc + curr.amount, 0);
        return {
          totalBalance: income - expenses,
          totalIncome: income,
          totalExpenses: expenses,
        };
      },

      getSpendingByCategory: () => {
        const { transactions } = get();
        const spending = transactions
          .filter((t) => t.type === 'expense')
          .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
          }, {});
        
        return Object.entries(spending).map(([name, value]) => ({ name, value }));
      },

      getTrendData: () => {
        const { transactions } = get();
        // Group by date and calculate running balance
        const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        let balance = 0;
        return sorted.map((t) => {
          balance += t.type === 'income' ? t.amount : -t.amount;
          return {
            date: t.date,
            balance,
          };
        });
      },
    }),
    {
      name: 'finance-dashboard-storage',
    }
  )
);

export default useStore;
