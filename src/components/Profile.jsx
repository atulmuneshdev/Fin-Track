import React from 'react';
import useStore from '../store/useStore';
import { User, Mail, Lock, Camera } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useStore();
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || 'demo@example.com');

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ ...user, name, email });
    // In a real app, you'd show a success toast here
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-card border rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold">
              {getInitials(user?.name)}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-md hover:scale-110 transition-transform">
              <Camera size={16} />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.email || 'demo@example.com'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Personal Information</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-medium text-sm">Full Name</label>
              <div className="relative flex items-center">
                <User size={18} className="absolute left-4 text-muted-foreground" />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary/50 border rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm">Email Address</label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-4 text-muted-foreground" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary/50 border rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold mt-4 shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Change Password</h3>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="font-medium text-sm">Current Password</label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-4 text-muted-foreground" />
                <input 
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-secondary/50 border rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm">New Password</label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-4 text-muted-foreground" />
                <input 
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-secondary/50 border rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl font-bold mt-4 hover:bg-secondary/80 transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
