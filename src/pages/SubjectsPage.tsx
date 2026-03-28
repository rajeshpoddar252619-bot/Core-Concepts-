import { motion } from 'motion/react';
import { Book, ArrowRight, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectsSnap = await getDocs(collection(db, 'subjects'));
        setSubjects(subjectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Explore Subjects</h2>
        <p className="text-text-secondary text-sm">Select a subject to view chapters and materials.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-32 bg-secondary animate-pulse rounded-2xl" />)
        ) : subjects.length > 0 ? (
          subjects.map((subject, index) => (
            <motion.a
              key={subject.id}
              href={`/subjects/${subject.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden p-6 rounded-2xl bg-secondary border border-white/5 hover:border-accent/30 transition-all flex items-center justify-between"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', `/subjects/${subject.id}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center border border-white/10 group-hover:bg-accent/10 transition-colors">
                  <Book className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">{subject.name}</h3>
                  <p className="text-xs text-text-secondary">View all chapters & notes</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-text-secondary group-hover:text-accent transition-all transform group-hover:translate-x-1" />
              
              {/* Decorative background element */}
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                <Book className="w-24 h-24" />
              </div>
            </motion.a>
          ))
        ) : (
          <div className="p-12 text-center bg-secondary/50 rounded-3xl border border-dashed border-white/10">
            <Book className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-20" />
            <p className="text-text-secondary text-sm">No subjects found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
