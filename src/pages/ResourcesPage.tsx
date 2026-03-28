import { motion } from 'motion/react';
import { FileText, Link as LinkIcon, Download, ExternalLink, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'assignment' | 'link'>('notes');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourcesSnap = await getDocs(collection(db, 'resources'));
        setResources(resourcesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = resources.filter(res => 
    res.type === activeTab && 
    (res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     res.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs = [
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'assignment', label: 'Assignments', icon: FileText },
    { id: 'link', label: 'Links', icon: LinkIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">General Resources</h2>
        <p className="text-text-secondary text-sm">Access additional study materials and important links.</p>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-accent transition-colors" />
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-accent/30 focus:bg-secondary transition-all"
        />
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

      {/* Resources List */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-32 bg-secondary animate-pulse rounded-2xl" />)
        ) : filteredResources.length > 0 ? (
          filteredResources.map((res, index) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-2xl bg-secondary border border-white/5 shadow-lg group hover:border-accent/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h5 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">{res.title}</h5>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-4">{res.description || "No description provided."}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/5 text-accent">
                  <res.icon className="w-6 h-6" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">
                  {res.type === 'link' ? 'Open Link' : 'Download File'}
                </span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary border border-white/10 text-accent text-xs font-bold hover:bg-accent hover:text-primary transition-all"
                >
                  {res.type === 'link' ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  VIEW
                </a>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center bg-secondary/30 rounded-2xl border border-dashed border-white/10">
            <p className="text-text-secondary text-sm">No {activeTab}s found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
