import React, { useEffect } from 'react';
import { Menu } from 'lucide-react';
import useStore from '../store/useStore';
import Sidebar from './Sidebar';

const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
};

const Layout = ({ children, activeTab, setActiveTab }) => {
  const { role, user } = useStore();
  const [darkMode, setDarkMode] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen bg-background text-foreground  transition-colors duration-300">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen bg-background transition-colors duration-300">
        <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-secondary transition-colors"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold capitalize m-0">{activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name || 'Demo User'}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{role}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
