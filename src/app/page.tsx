"use client";

import { useState, useEffect } from "react";
import JobMap from "@/components/Map";
import JobList from "@/components/JobList";
import JobDetail from "@/components/JobDetail";
import { Job, fetchJobs } from "@/lib/fetchJobs";
import { SavedJobsProvider } from "@/context/SavedJobsContext";
import { AnimatePresence } from "framer-motion";
import { MdBookmark, MdWork } from "react-icons/md";

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showSavedJobs, setShowSavedJobs] = useState(false);
  const [previousView, setPreviousView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      const data = await fetchJobs();
      setJobs(data);
    };

    loadJobs();
  }, []);

  const handleBack = () => {
    setSelectedJob(null);
    if (showSavedJobs !== previousView) {
      setShowSavedJobs(previousView);
    }
  };

  const handleViewChange = (showSaved: boolean) => {
    setShowSavedJobs(showSaved);
    setSelectedJob(null);
    if (showSaved) {
      setSearchQuery("");
    }
  };

  const handleJobSelect = (job: Job | null) => {
    if (job) {
      setPreviousView(showSavedJobs);
    }
    setSelectedJob(job);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && showSavedJobs) {
      setShowSavedJobs(false);
    }
  };

  return (
    <SavedJobsProvider>
      <div className="relative h-screen w-screen">
        <JobMap
          selectedJob={selectedJob}
          onSelectJob={handleJobSelect}
          showSavedJobs={showSavedJobs}
          searchQuery={searchQuery}
          jobs={jobs}
        />

        <div className="absolute top-0 right-0 w-full sm:w-96 h-full bg-[var(--card-background)] backdrop-blur-xl text-[var(--foreground)] overflow-hidden z-10">
          <div className="flex items-center justify-around p-4 border-b border-[var(--text-secondary)]/10">
            <button
              onClick={() => handleViewChange(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                !showSavedJobs ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)]'
              }`}
            >
              <MdWork />
              <span>Jobs</span>
            </button>
            <button
              onClick={() => handleViewChange(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                showSavedJobs ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)]'
              }`}
            >
              <MdBookmark />
              <span>Saved</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {selectedJob ? (
              <JobDetail
                key="detail"
                job={selectedJob}
                onBack={handleBack}
              />
            ) : (
              <JobList
                key={showSavedJobs ? "saved" : "all"}
                onSelectJob={handleJobSelect}
                showSaved={showSavedJobs}
                searchQuery={searchQuery}
                onSearch={handleSearch}
                jobs={jobs}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </SavedJobsProvider>
  );
}