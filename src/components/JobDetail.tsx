"use client";

import { Job } from "@/lib/fetchJobs";
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { useSavedJobs } from "@/context/SavedJobsContext";

interface JobDetailProps {
  job: Job;
  onBack: () => void;
}

export default function JobDetail({ job, onBack }: JobDetailProps) {
  const { toggleSaveJob, isJobSaved } = useSavedJobs();
  const saved = isJobSaved(job.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="space-y-6 p-4"
    >
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
      >
        <IoArrowBack />
        <span>Back</span>
      </button>

      <div className="space-y-4">
        <h2 className="text-3xl font-semibold">{job.title}</h2>
        <div className="space-y-1">
          <p className="text-xl">{job.company}</p>
          <p className="text-[var(--text-secondary)]">{job.location}</p>
        </div>

        <div className="apple-card p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">About the role</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {job.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {job.requirements}
            </p>
          </div>
        </div>

        <motion.button 
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveJob(job);
          }} 
          className={`apple-button w-full ${saved ? 'bg-purple-600' : 'bg-blue-500'}`}
        >
          {saved ? 'Remove Job' : 'Save Job'}
        </motion.button>
      </div>
    </motion.div>
  );
}
