import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileText, Play, HelpCircle, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db, collection, getDocs, query, where, doc, getDoc } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function ChapterDetailPage() {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'video' | 'practice'>('notes');

  useEffect(() => {
    const fetchData = async () => {
      if (!chapterId) return;
      try {
        const chapterSnap = await getDoc(doc(db, 'chapters', chapterId));
        setChapter(chapterSnap.data());

        const contentQuery = query(collection(db, 'content'), where('chapterId', '==', chapterId));
        const contentSnap = await getDocs(contentQuery);
        setContent(contentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching chapter detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chapterId]);

  const filteredContent = content.filter(item => item.type === activeTab);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-secondary animate-pulse rounded-lg" />
        <div className="h-24 bg-secondary animate-pulse rounded-2xl" />
        <div className="h-12 bg-secondary animate-pulse rounded-xl" />
        <div className="space-y-3">
          {[1, 2].map(i => <div key={i} className="h-32 bg-secondary animate-pulse rounded-xl" />)}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'video', label: 'Videos', icon: Play },
    { id: 'practice', label: 'Practice', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Back to Chapters</span>
      </button>

      <div className="p-6 rounded-2xl bg-secondary border border-white/5 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">{chapter?.title}</h2>
        <p className="text-text-secondary text-xs uppercase tracking-widest font-medium">Chapter Overview</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-secondary/50 border border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
              activeTab === tab.id 
                ? "bg-accent text-primary shadow-lg" 
                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.length > 0 ? (
          filteredContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-2xl bg-secondary border border-white/5 shadow-lg group hover:border-accent/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h5 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">{item.title}</h5>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-4">{item.description || "No description provided."}</p>
                </div>
                <div className={cn(
                  "p-3 rounded-xl",
                  item.type === 'video' ? "bg-red-500/10 text-red-400" : 
                  item.type === 'notes' ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"
                )}>
                  <item.icon className="w-6 h-6" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">
                  {item.type === 'video' ? 'Watch Now' : item.type === 'notes' ? 'Download PDF' : 'Start Practice'}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary border border-white/10 text-accent text-xs font-bold hover:bg-accent hover:text-primary transition-all"
                >
                  {item.type === 'notes' ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                  OPEN
                </a>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center bg-secondary/30 rounded-2xl border border-dashed border-white/10">
            <p className="text-text-secondary text-sm">No {activeTab} available for this chapter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
