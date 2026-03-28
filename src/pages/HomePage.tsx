import { motion } from 'motion/react';
import { Book, Play, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db, collection, getDocs, query, limit, orderBy } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function HomePage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsSnap = await getDocs(collection(db, 'subjects'));
        setSubjects(subjectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const contentQuery = query(collection(db, 'content'), orderBy('title'), limit(3));
        const contentSnap = await getDocs(contentQuery);
        setRecentContent(contentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickActions = [
    { label: 'Notes', icon: FileText, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Videos', icon: Play, color: 'bg-red-500/20 text-red-400' },
    { label: 'Practice', icon: HelpCircle, color: 'bg-green-500/20 text-green-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-primary border border-white/10 p-6 shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Master Concepts,</h2>
          <h3 className="text-xl font-medium text-accent mb-4">Not Just Exams</h3>
          <p className="text-text-secondary text-sm max-w-[200px]">Structured learning for high-performance students.</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Book className="w-32 h-32 text-accent" />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary border border-white/5 hover:border-accent/30 transition-all group"
          >
            <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", action.color)}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-text-secondary group-hover:text-text-primary">{action.label}</span>
          </button>
        ))}
      </section>

      {/* Featured Subjects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold">Featured Subjects</h4>
          <a href="/subjects" className="text-accent text-sm flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            [1, 2].map(i => <div key={i} className="h-24 bg-secondary animate-pulse rounded-2xl" />)
          ) : subjects.length > 0 ? (
            subjects.slice(0, 3).map((subject) => (
              <a
                key={subject.id}
                href={`/subjects/${subject.id}`}
                className="flex items-center justify-between p-5 rounded-2xl bg-secondary border border-white/5 hover:border-accent/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center border border-white/10">
                    <Book className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">{subject.name}</h5>
                    <p className="text-xs text-text-secondary">Explore chapters & notes</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
              </a>
            ))
          ) : (
            <div className="p-8 text-center bg-secondary/50 rounded-2xl border border-dashed border-white/10">
              <p className="text-text-secondary text-sm">No subjects added yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Uploads */}
      <section>
        <h4 className="text-lg font-bold mb-4">Recent Uploads</h4>
        <div className="space-y-3">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-16 bg-secondary animate-pulse rounded-xl" />)
          ) : recentContent.length > 0 ? (
            recentContent.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-white/5"
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  item.type === 'video' ? "bg-red-500/10 text-red-400" : 
                  item.type === 'notes' ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"
                )}>
                  {item.type === 'video' ? <Play className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="text-sm font-medium text-white truncate">{item.title}</h6>
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider">{item.type}</p>
                </div>
                <button className="text-accent text-xs font-bold">VIEW</button>
              </div>
            ))
          ) : (
            <p className="text-text-secondary text-sm text-center py-4">No recent uploads.</p>
          )}
        </div>
      </section>
    </div>
  );
}
