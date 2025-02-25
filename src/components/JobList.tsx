"use client";

import { useState, useEffect, useRef } from "react";
import { Job } from "@/lib/fetchJobs"; 
import { motion, AnimatePresence } from "framer-motion";
import { useSavedJobs } from "@/context/SavedJobsContext";
import { MdBookmark } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";

interface JobListProps {
  onSelectJob: (job: Job) => void;
  showSaved: boolean;
  searchQuery: string;
  onSearch: (query: string) => void;
  jobs: Job[];
}

export default function JobList({ 
  onSelectJob, 
  showSaved, 
  searchQuery, 
  onSearch, 
  jobs 
}: JobListProps) {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const { savedJobs, isJobSaved } = useSavedJobs();

  const listRef = useRef<HTMLDivElement>(null);

  const scrollPositionKey = showSaved ? "saved" : "available";

  useEffect(() => {
    const filterJobs = () => {
      const data = showSaved ? savedJobs : jobs;
      if (!searchQuery.trim()) return data;

      const query = searchQuery.toLowerCase().trim();
      return data.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query)
      );
    };
    setFilteredJobs(filterJobs());
  }, [showSaved, searchQuery, jobs, savedJobs]);

  useEffect(() => {
    const savedScroll = localStorage.getItem(`jobListScrollPosition-${scrollPositionKey}`);
    if (!listRef.current || !savedScroll) return;

    const restoreScroll = () => {
      listRef.current!.scrollTop = parseInt(savedScroll, 10);
    };

    requestAnimationFrame(restoreScroll);
  }, [scrollPositionKey, filteredJobs]);

  const handleScroll = () => {
    if (listRef.current) {
      const pos = listRef.current.scrollTop;
      localStorage.setItem(`jobListScrollPosition-${scrollPositionKey}`, pos.toString());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: showSaved ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: showSaved ? 10 : -10 }}
      transition={{ duration: 0.15 }}
      className="h-full flex flex-col"
    >
      <h2 className="text-2xl font-semibold p-4">
        {showSaved ? "Saved Positions" : "Available Positions"}
      </h2>
      
      {!showSaved && (
        <div className="px-4 pb-4">
          <div className="relative flex items-center">
            <IoSearchOutline 
              className="absolute left-3 text-[var(--text-secondary)]" 
              size={20} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search jobs or companies..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--background)] rounded-full 
                         border border-[var(--text-secondary)]/20
                         focus:outline-none focus:border-[var(--accent)]
                         text-[var(--foreground)] placeholder-[var(--text-secondary)]"
            />
          </div>
        </div>
      )}

      <div 
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="px-4 pb-20 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map(job => {
              const saved = isJobSaved(job.id);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className={`apple-card p-4 cursor-pointer transform transition-all duration-150 hover:scale-[1.02] relative group
                    ${saved ? 'border-purple-500/20 shadow-[inset_0_0_0_1px_rgba(168,85,247,0.2)]' : ''}`}
                >
                  {saved && (
                    <div className="absolute right-4 top-4 text-purple-500">
                      <MdBookmark />
                    </div>
                  )}
                  <h3 className="font-semibold text-lg pr-8">{job.title}</h3>
                  <p className="text-[var(--text-secondary)]">{job.company}</p>
                  <div className="flex items-center mt-2 text-sm text-[var(--text-secondary)]">
                    <span>{job.location}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredJobs.length === 0 && (
            <p className="text-center text-[var(--text-secondary)]">
              {showSaved ? "No saved jobs yet" : "No jobs found"}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}