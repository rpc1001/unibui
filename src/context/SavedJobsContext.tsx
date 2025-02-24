"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Job } from "@/lib/fetchJobs";

interface SavedJobsContextType {
  savedJobs: Job[];
  toggleSaveJob: (job: Job) => void;
  isJobSaved: (jobId: string) => boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedJobs");
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  const toggleSaveJob = (job: Job) => {
    setSavedJobs(prev => {
      const isAlreadySaved = prev.some(j => j.id === job.id);
      const newSavedJobs = isAlreadySaved
        ? prev.filter(j => j.id !== job.id)
        : [...prev, job];
      
      localStorage.setItem("savedJobs", JSON.stringify(newSavedJobs));
      return newSavedJobs;
    });
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.some(job => job.id === jobId);
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, toggleSaveJob, isJobSaved }}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error("useSavedJobs must be used within a SavedJobsProvider");
  }
  return context;
}; 