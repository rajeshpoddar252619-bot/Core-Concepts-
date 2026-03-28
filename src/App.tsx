import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';
import { Home, BookOpen, FileText, User, Search, Settings, Shield } from 'lucide-react';
import { auth, db, onAuthStateChanged, doc, getDoc, setDoc } from './lib/firebase';
import { cn } from './lib/utils';
import { Link } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import ChapterDetailPage from './pages/ChapterDetailPage';
import ResourcesPage from './pages/ResourcesPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

// Components
const TopBar = () => (
  <header className="sticky top-0 z-50 bg-primary/80 backdrop-blur-md border-b border-secondary px-4 py-3 flex items-center justify-between">
    <Link to="/" className="text-xl font-bold text-accent tracking-tight">Core Concepts</Link>
    <div className="flex items-center gap-2">
      <Link to="/admin" className="p-2 hover:bg-secondary rounded-full transition-colors group">
        <Shield className="w-5 h-5 text-text-secondary group-hover:text-accent" />
      </Link>
      <button className="p-2 hover:bg-secondary rounded-full transition-colors">
        <Search className="w-5 h-5 text-text-secondary" />
      </button>
    </div>
  </header>
);

const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/subjects', icon: BookOpen, label: 'Subjects' },
    { path: '/resources', icon: FileText, label: 'Resources' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-secondary/90 backdrop-blur-lg border-t border-white/10 px-6 py-3 pb-6 flex justify-between items-center">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <motion.a
            key={item.path}
            href={item.path}
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', item.path);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"
            )}
            whileTap={{ scale: 0.9 }}
          >
            <item.icon className={cn("w-6 h-6", isActive && "fill-accent/20")} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </motion.a>
        );
      })}
    </nav>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return <>{children}</>;

  return (
    <div className="min-h-screen pb-24">
      <TopBar />
      <main className="max-w-xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            role: 'student',
            savedResources: [],
            recentlyViewed: []
          });
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
          <Route path="/chapters/:chapterId" element={<ChapterDetailPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <Toaster position="top-center" theme="dark" richColors />
    </Router>
  );
}
