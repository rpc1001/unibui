"use client";

import { useState, useEffect } from "react";
import { fetchJobs, Job } from "@/lib/fetchJobs";

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function loadJobs() {
      const data = await fetchJobs();
      setJobs(data);
    }
    loadJobs();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Job List</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id} className="mb-4 border-b border-gray-700 pb-2">
            <h3 className="font-semibold">{job.title}</h3>
            <p>{job.company}</p>
            <p className="text-sm text-gray-400">{job.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
