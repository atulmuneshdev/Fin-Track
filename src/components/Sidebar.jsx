import React from 'react';
import { LayoutDashboard, Receipt, TrendingUp, LogOut, Sun, Moon, X, User } from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../lib/utils';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-sm font-medium",
      active 
        ? "bg-primary text-primary-foreground" 
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    )}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, darkMode, setDarkMode }) => {
  const { role, setRole, logout } = useStore();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Content */}
      <aside className={cn(
        "w-64 border-r bg-card flex flex-col fixed inset-y-0 z-[60] transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                <TrendingUp size={20} />
              </div>
              <h1 className="text-xl font-bold tracking-tight m-0">FinTrack</h1>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-md hover:bg-secondary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Overview" 
              active={activeTab === 'overview'} 
              onClick={() => {
                setActiveTab('overview');
                setIsOpen(false);
              }}
            />
            <SidebarItem 
              icon={Receipt} 
              label="Transactions" 
              active={activeTab === 'transactions'} 
              onClick={() => {
                setActiveTab('transactions');
                setIsOpen(false);
              }}
            />
            <SidebarItem 
              icon={User} 
              label="Profile" 
              active={activeTab === 'profile'} 
              onClick={() => {
                setActiveTab('profile');
                setIsOpen(false);
              }}
            />
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <span className="text-xs font-medium text-muted-foreground">Dark Mode</span>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-muted-foreground px-2">Role Switcher</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-colors duration-300"
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
