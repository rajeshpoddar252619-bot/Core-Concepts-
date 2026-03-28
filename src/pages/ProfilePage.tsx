import { motion } from 'motion/react';
import { User, Mail, LogOut, Bookmark, Clock, ChevronRight, LogIn, ShieldCheck } from 'lucide-react';
import { signIn, logOut } from '../lib/firebase';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage({ user }: { user: any }) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center border border-white/10 shadow-2xl">
          <User className="w-10 h-10 text-accent" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Join Core Concepts</h2>
          <p className="text-text-secondary text-sm max-w-[250px] mx-auto">Sign in to track your progress and save resources.</p>
        </div>
        <button
          onClick={signIn}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-accent text-primary font-bold shadow-xl hover:scale-105 transition-transform"
        >
          <LogIn className="w-5 h-5" />
          SIGN IN WITH GOOGLE
        </button>
        
        <button
          onClick={() => navigate('/admin')}
          className="text-text-secondary text-xs font-medium hover:text-accent transition-colors mt-4"
        >
          Admin Access
        </button>
      </div>
    );
  }

  const sections = [
    { id: 'saved', label: 'Saved Resources', icon: Bookmark, count: 0 },
    { id: 'recent', label: 'Recently Viewed', icon: Clock, count: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* User Header */}
      <section className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-secondary border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="relative">
          <img
            src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
            alt={user.displayName}
            className="w-24 h-24 rounded-3xl border-4 border-primary shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-accent text-primary shadow-lg">
            <User className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">{user.displayName}</h2>
          <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
            <Mail className="w-4 h-4" />
            {user.email}
          </div>
        </div>
        <div className="absolute -right-8 -top-8 opacity-5">
          <User className="w-40 h-40" />
        </div>
      </section>

      {/* Stats/Sections */}
      <section className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            className="flex items-center justify-between p-5 rounded-2xl bg-secondary/50 border border-white/5 hover:border-accent/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary border border-white/10 group-hover:text-accent transition-colors">
                <section.icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white group-hover:text-accent transition-colors">{section.label}</h4>
                <p className="text-xs text-text-secondary">{section.count} items available</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-accent transition-all transform group-hover:translate-x-1" />
          </button>
        ))}

        {/* Admin Access Button */}
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center justify-between p-5 rounded-2xl bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary border border-accent/20 text-accent">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-accent">Admin Dashboard</h4>
              <p className="text-xs text-accent/60">Manage content & resources</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-accent" />
        </button>
      </section>

      {/* Settings/Logout */}
      <section className="space-y-3">
        <button
          onClick={logOut}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold hover:bg-red-500/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          LOG OUT
        </button>
        <p className="text-center text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">Core Concepts v1.0.0</p>
      </section>
    </div>
  );
}
