import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Book, ChevronRight, FileText, Play, HelpCircle, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db, collection, getDocs, query, where, doc, getDoc } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function SubjectDetailPage() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!subjectId) return;
      try {
        const subjectSnap = await getDoc(doc(db, 'subjects', subjectId));
        setSubject(subjectSnap.data());

        const chaptersQuery = query(collection(db, 'chapters'), where('subjectId', '==', subjectId));
        const chaptersSnap = await getDocs(chaptersQuery);
        setChapters(chaptersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching subject detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-secondary animate-pulse rounded-lg" />
        <div className="h-48 bg-secondary animate-pulse rounded-2xl" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-secondary animate-pulse rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Back to Subjects</span>
      </button>

      <div className="p-8 rounded-3xl bg-gradient-to-br from-secondary to-primary border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">{subject?.name}</h2>
          <p className="text-text-secondary text-sm max-w-[250px]">Master the fundamentals with structured chapters and materials.</p>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-10">
          <Book className="w-40 h-40 text-accent" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-bold text-white px-1">Chapters</h4>
        {chapters.length > 0 ? (
          chapters.map((chapter, index) => (
            <motion.a
              key={chapter.id}
              href={`/chapters/${chapter.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center justify-between p-5 rounded-2xl bg-secondary/50 border border-white/5 hover:border-accent/30 hover:bg-secondary transition-all"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', `/chapters/${chapter.id}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center border border-white/10 group-hover:text-accent transition-colors">
                  <span className="text-sm font-bold text-accent">{index + 1}</span>
                </div>
                <div>
                  <h5 className="font-bold text-white group-hover:text-accent transition-colors">{chapter.title}</h5>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-text-secondary uppercase tracking-widest">
                      <FileText className="w-3 h-3" /> Notes
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-text-secondary uppercase tracking-widest">
                      <Play className="w-3 h-3" /> Videos
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-accent transition-all transform group-hover:translate-x-1" />
            </motion.a>
          ))
        ) : (
          <div className="p-12 text-center bg-secondary/30 rounded-2xl border border-dashed border-white/10">
            <p className="text-text-secondary text-sm">No chapters added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
