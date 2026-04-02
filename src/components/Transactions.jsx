import React, { useState } from 'react';
import { Search, Filter, Plus, ArrowUpDown, Trash2, Edit2, X, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import { categories } from '../data/mockData';
import { cn } from '../lib/utils';

const TransactionCard = ({ transaction, role, onDelete }) => (
  <div className="bg-card border rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground font-medium">
          {format(new Date(transaction.date), 'MMM dd, yyyy')}
        </span>
        <h4 className="font-semibold text-sm">{transaction.description}</h4>
      </div>
      <div className={cn(
        "px-2.5 py-1 rounded-full text-xs font-bold",
        transaction.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
      )}>
        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-2 border-t border-border/50">
      <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider">
        {transaction.category}
      </span>
      
      {role === 'admin' && (
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground transition-colors">
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => onDelete(transaction.id)}
            className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  </div>
);

const Transactions = () => {
  const { transactions, role, addTransaction, deleteTransaction } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    category: 'Food',
    type: 'expense',
    description: '',
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    setIsModalOpen(false);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      category: 'Food',
      type: 'expense',
      description: '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold lg:hidden">Transactions</h1>
          {role === 'admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search description or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 sm:flex-none">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-card border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 sm:flex-none">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-card border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 appearance-none"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View: Table */}
      <div className="hidden lg:block bg-card border rounded-2xl shadow-sm overflow-hidden transition-all duration-500 hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => handleSort('date')} className="flex items-center gap-1 hover:text-primary transition-colors">
                    Date <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Description</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">
                  <button onClick={() => handleSort('amount')} className="flex items-center gap-1 ml-auto hover:text-primary transition-colors">
                    Amount <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground text-center">Type</th>
                {role === 'admin' && <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t, idx) => (
                  <tr 
                    key={t.id} 
                    className="hover:bg-muted/30 transition-all group animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <td className="px-6 py-4 text-sm">{format(new Date(t.date), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{t.description}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider">
                        {t.category}
                      </span>
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-sm font-bold text-right tabular-nums",
                      t.type === 'income' ? "text-emerald-500" : "text-destructive"
                    )}>
                      {t.type === 'income' ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                        t.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                      )}>
                        {t.type}
                      </span>
                    </td>
                    {role === 'admin' && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-all duration-200">
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteTransaction(t.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-all duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} className="px-6 py-20 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-500">
                      <div className="p-4 bg-muted rounded-full">
                        <Search size={40} className="opacity-40" />
                      </div>
                      <p className="font-bold text-lg">No results found</p>
                      <p className="text-sm max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet View: Grid of Cards */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => (
            <TransactionCard 
              key={t.id} 
              transaction={t} 
              role={role} 
              onDelete={deleteTransaction} 
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-card border rounded-2xl">
             <div className="flex flex-col items-center gap-3">
              <Search size={40} className="opacity-20" />
              <p className="font-bold">No results found</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal for adding transaction */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold m-0">New Transaction</h3>
                <p className="text-sm text-muted-foreground">Track your latest financial activity</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-secondary/50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Amount ($)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-secondary/50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Type</label>
                  <div className="flex gap-1 p-1 bg-secondary/50 border rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, type: 'income'})}
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                        formData.type === 'income' ? "bg-card shadow-sm text-emerald-500" : "text-muted-foreground"
                      )}
                    >
                      Income
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, type: 'expense'})}
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                        formData.type === 'expense' ? "bg-card shadow-sm text-destructive" : "text-muted-foreground"
                      )}
                    >
                      Expense
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-secondary/50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Weekly Groceries"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-secondary/50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold mt-4 shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Create Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
