import React, { useState } from 'react';
import { TrendingUp, User, Lock, Mail } from 'lucide-react';
import { cn } from '../lib/utils';



const AuthInput = ({ icon: Icon, name, value, onChange, type = "text", ...props }) => {
  return (
    <div className="relative flex items-center group">
      <Icon
        size={18}
        className="absolute left-4 text-muted-foreground group-focus-within:text-primary transition-colors"
      />

      <input
        {...props}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full bg-secondary/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
      />
    </div>
  );
};


const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  // FIXED HANDLER
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //  SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    onLogin({
      name: formData.name || 'Demo User',
      email: formData.email,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <TrendingUp size={24} />
          </div>
          <h1 className="text-3xl font-bold">FinTrack</h1>
        </div>

        <div className="bg-card border rounded-2xl shadow-xl overflow-hidden">

          {/* Toggle */}
          <div className="flex">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={cn(
                "flex-1 py-3 font-bold",
                isLogin ? "bg-primary/10 text-primary" : "text-gray-500"
              )}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={cn(
                "flex-1 py-3 font-bold",
                !isLogin ? "bg-primary/10 text-primary" : "text-gray-500"
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              <h2 className="text-xl font-bold text-center">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>

              {!isLogin && (
                <AuthInput
                  name="name"
                  icon={User}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
              )}

              <AuthInput
                name="email"
                icon={Mail}
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />

              <AuthInput
                name="password"
                icon={Lock}
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
              />

              {!isLogin && (
                <AuthInput
                  name="confirmPassword"
                  icon={Lock}
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                />
              )}

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;