"use client";

import { useState, useEffect } from "react";
import { fetchJobs, Job } from "@/lib/fetchJobs";
import { motion } from "framer-motion";

interface JobListProps {
  onSelectJob: (job: Job) => void;
}

export default function JobList({ onSelectJob }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function loadJobs() {
      const data = await fetchJobs();
      setJobs(data);
    }
    loadJobs();
  }, []);

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">Available Positions</h2>
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            key={job.id}
            onClick={() => onSelectJob(job)}
            className="apple-card p-4 cursor-pointer transform transition-all duration-300 hover:scale-[1.02]"
          >
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-[var(--text-secondary)]">{job.company}</p>
            <div className="flex items-center mt-2 text-sm text-[var(--text-secondary)]">
              <span>{job.location}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
