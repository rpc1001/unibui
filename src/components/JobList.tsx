"use client";

import { useState, useEffect, useRef } from "react";
import { fetchJobs, Job } from "@/lib/fetchJobs";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedJobs } from "@/context/SavedJobsContext";
import { MdBookmark } from "react-icons/md";

interface JobListProps {
  onSelectJob: (job: Job) => void;
  showSaved: boolean;
}

export default function JobList({ onSelectJob, showSaved }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { savedJobs, isJobSaved } = useSavedJobs();
  const listRef = useRef<HTMLDivElement>(null);
  
  // initialize scroll positions from localStorage
  const [scrollPositions, setScrollPositions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jobListScrollPositions');
      return saved ? JSON.parse(saved) : { saved: 0, available: 0 };
    }
    return { saved: 0, available: 0 };
  });

  useEffect(() => {
    async function loadJobs() {
      const data = await fetchJobs();
      setJobs(data);
    }
    loadJobs();
  }, []);

  const handleScroll = () => {
    if (listRef.current) {
      const newPositions = {
        ...scrollPositions,
        [showSaved ? 'saved' : 'available']: listRef.current.scrollTop
      };
      setScrollPositions(newPositions);
      localStorage.setItem('jobListScrollPositions', JSON.stringify(newPositions));
    }
  };

  // restore scroll position when view changes or component mounts
  useEffect(() => {
    const list = listRef.current;
    if (list) {
      requestAnimationFrame(() => {
        list.scrollTop = scrollPositions[showSaved ? 'saved' : 'available'];
      });
    }
  }, [showSaved, jobs.length, savedJobs.length]);

  const displayJobs = showSaved ? savedJobs : jobs;

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
      <div 
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="px-4 pb-20 space-y-4">
          <AnimatePresence mode="popLayout">
            {displayJobs.map((job) => {
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
          {showSaved && savedJobs.length === 0 && (
            <p className="text-center text-[var(--text-secondary)]">No saved jobs yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
