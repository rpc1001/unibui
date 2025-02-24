"use client";

import { useState } from "react";
import JobMap from "@/components/Map";
import JobList from "@/components/JobList";
import JobDetail from "@/components/JobDetail";
import { Job } from "@/lib/fetchJobs";

export default function HomePage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className="relative h-screen w-screen">
      <JobMap
        selectedJob={selectedJob}
        onSelectJob={(job) => setSelectedJob(job)}
      />

      {/* If a job is selected, show <JobDetail>, otherwise show <JobList>. */}
      <div className="absolute top-0 right-0 w-full sm:w-96 h-full bg-neutral-900 bg-opacity-90 backdrop-blur-lg text-white p-4 overflow-y-auto z-10">
        {selectedJob ? (
          <JobDetail
            job={selectedJob}
            onBack={() => setSelectedJob(null)}
          />
        ) : (
          <JobList onSelectJob={setSelectedJob} />
        )}
      </div>
    </div>
  );
}
