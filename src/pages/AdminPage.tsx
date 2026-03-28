import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, LayoutDashboard, Plus, Trash2, Edit2, FileText, Play, HelpCircle, Link as LinkIcon, Save, X, ChevronRight, Book, ArrowLeft } from 'lucide-react';
import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, orderBy } from '../lib/firebase';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subjects' | 'chapters' | 'content' | 'resources'>('dashboard');

  // Data states
  const [subjects, setSubjects] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newSubject, setNewSubject] = useState({ name: '' });
  const [newChapter, setNewChapter] = useState({ subjectId: '', title: '', order: 0 });
  const [newContent, setNewContent] = useState({ chapterId: '', subjectId: '', type: 'notes', title: '', url: '', description: '' });
  const [newResource, setNewResource] = useState({ type: 'notes', title: '', url: '', description: '' });

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const subjectsSnap = await getDocs(collection(db, 'subjects'));
      setSubjects(subjectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const chaptersSnap = await getDocs(collection(db, 'chapters'));
      setChapters(chaptersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const contentSnap = await getDocs(collection(db, 'content'));
      setContent(contentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const resourcesSnap = await getDocs(collection(db, 'resources'));
      setResources(resourcesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast.error("Error fetching admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '9980') {
      setIsLoggedIn(true);
      toast.success("Welcome, Admin!");
    } else {
      toast.error("Invalid password");
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'subjects'), newSubject);
      toast.success("Subject added successfully");
      setNewSubject({ name: '' });
      fetchData();
    } catch (error) {
      toast.error("Error adding subject");
    }
  };

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'chapters'), newChapter);
      toast.success("Chapter added successfully");
      setNewChapter({ subjectId: '', title: '', order: 0 });
      fetchData();
    } catch (error) {
      toast.error("Error adding chapter");
    }
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'content'), newContent);
      toast.success("Content added successfully");
      setNewContent({ chapterId: '', subjectId: '', type: 'notes', title: '', url: '', description: '' });
      fetchData();
    } catch (error) {
      toast.error("Error adding content");
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'resources'), newResource);
      toast.success("Resource added successfully");
      setNewResource({ type: 'notes', title: '', url: '', description: '' });
      fetchData();
    } catch (error) {
      toast.error("Error adding resource");
    }
  };

  const handleDelete = async (coll: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, coll, id));
      toast.success("Item deleted");
      fetchData();
    } catch (error) {
      toast.error("Error deleting item");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm p-8 rounded-3xl bg-secondary border border-white/5 shadow-2xl space-y-8"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">Admin Access</h2>
              <p className="text-text-secondary text-sm">Enter password to manage content.</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all"
            />
            <button
              type="submit"
              className="w-full bg-accent text-primary font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              LOGIN
            </button>
          </form>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center justify-center gap-2 text-text-secondary text-xs font-bold hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO APP
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-secondary border-b md:border-r border-white/5 p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">Admin</h1>
        </div>
        <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'subjects', label: 'Subjects', icon: Book },
            { id: 'chapters', label: 'Chapters', icon: Book },
            { id: 'content', label: 'Content', icon: Play },
            { id: 'resources', label: 'Resources', icon: FileText },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                activeTab === item.id ? "bg-accent text-primary shadow-lg" : "text-text-secondary hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Subjects', count: subjects.length, icon: Book, color: 'text-blue-400' },
                  { label: 'Chapters', count: chapters.length, icon: Book, color: 'text-purple-400' },
                  { label: 'Materials', count: content.length, icon: Play, color: 'text-red-400' },
                  { label: 'Resources', count: resources.length, icon: FileText, color: 'text-green-400' },
                ].map((stat) => (
                  <div key={stat.label} className="p-6 rounded-3xl bg-secondary border border-white/5 shadow-xl space-y-4">
                    <div className={cn("p-3 rounded-xl bg-primary border border-white/10 w-fit", stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                      <h3 className="text-3xl font-bold text-white">{stat.count}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'subjects' && (
            <motion.div key="subjects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white tracking-tight">Manage Subjects</h2>
              </div>
              
              <form onSubmit={handleAddSubject} className="p-6 rounded-3xl bg-secondary border border-white/5 shadow-xl flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Subject Name (e.g. Physics)"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="flex-1 bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50"
                  required
                />
                <button type="submit" className="bg-accent text-primary font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> ADD SUBJECT
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((sub) => (
                  <div key={sub.id} className="p-5 rounded-2xl bg-secondary border border-white/5 flex items-center justify-between group hover:border-accent/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center border border-white/10">
                        <Book className="w-5 h-5 text-accent" />
                      </div>
                      <h4 className="font-bold text-white">{sub.name}</h4>
                    </div>
                    <button onClick={() => handleDelete('subjects', sub.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'chapters' && (
            <motion.div key="chapters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">Manage Chapters</h2>
              
              <form onSubmit={handleAddChapter} className="p-6 rounded-3xl bg-secondary border border-white/5 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newChapter.subjectId}
                  onChange={(e) => setNewChapter({ ...newChapter, subjectId: e.target.value })}
                  className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="Chapter Title"
                  value={newChapter.title}
                  onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                  className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50"
                  required
                />
                <button type="submit" className="bg-accent text-primary font-bold py-3 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> ADD CHAPTER
                </button>
              </form>

              <div className="space-y-3">
                {chapters.map((ch) => (
                  <div key={ch.id} className="p-4 rounded-xl bg-secondary border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white">{ch.title}</h4>
                      <p className="text-xs text-text-secondary">{subjects.find(s => s.id === ch.subjectId)?.name}</p>
                    </div>
                    <button onClick={() => handleDelete('chapters', ch.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">Manage Content</h2>
              
              <form onSubmit={handleAddContent} className="p-6 rounded-3xl bg-secondary border border-white/5 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={newContent.subjectId}
                  onChange={(e) => setNewContent({ ...newContent, subjectId: e.target.value })}
                  className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select
                  value={newContent.chapterId}
                  onChange={(e) => setNewContent({ ...newContent, chapterId: e.target.value })}
                  className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50"
                  required
                >
                  <option value="">Select Chapter</option>
                  {chapters.filter(c => c.subjectId === newContent.subjectId).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                  className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50"
                  required
                >
                  <option value="notes">Notes (PDF)</option>
                  <option value="video">Video (YouTube)</option>
                  <option value="practice">Practice Questions</option>
                </select>
                <input
                  type="text"
                  placeholder="Material Title"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50"
                  required
                />
                <input
                  type="url"
                  placeholder="URL (Link to file or video)"
                  value={newContent.url}
                  onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
                  className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 md:col-span-2"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newContent.description}
                  onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                  className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 md:col-span-2 h-24"
                />
                <button type="submit" className="bg-accent text-primary font-bold py-3 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2 md:col-span-2">
                  <Plus className="w-5 h-5" /> ADD MATERIAL
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-secondary border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        item.type === 'video' ? "bg-red-500/10 text-red-400" : 
                        item.type === 'notes' ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"
                      )}>
                        {item.type === 'video' ? <Play className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm truncate max-w-[150px]">{item.title}</h4>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest">{item.type}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete('content', item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div key="resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">Manage Resources</h2>
              
              <form onSubmit={handleAddResource} className="p-6 rounded-3xl bg-secondary border border-white/5 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({ ...newResource, type: e.target.value as any })}
                  className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50"
                  required
                >
                  <option value="notes">Notes</option>
                  <option value="assignment">Assignment</option>
                  <option value="link">Important Link</option>
                </select>
                <input
                  type="text"
                  placeholder="Resource Title"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50"
                  required
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                  className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 md:col-span-2"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  className="bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 md:col-span-2 h-24"
                />
                <button type="submit" className="bg-accent text-primary font-bold py-3 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2 md:col-span-2">
                  <Plus className="w-5 h-5" /> ADD RESOURCE
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((res) => (
                  <div key={res.id} className="p-4 rounded-xl bg-secondary border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">
                        {res.type === 'link' ? <LinkIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{res.title}</h4>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest">{res.type}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete('resources', res.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
