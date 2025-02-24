"use client";

import { Job } from "@/lib/fetchJobs";

interface JobDetailProps {
  job: Job;
  onBack: () => void;
}

export default function JobDetail({ job, onBack }: JobDetailProps) {
  return (
    <div className="space-y-4">
      <button
        className="text-sm text-gray-300 hover:text-white"
        onClick={onBack}
      >
        &larr; Back to job list
      </button>

      <h2 className="text-2xl font-bold">{job.title}</h2>
      <p className="text-lg text-gray-300">{job.company}</p>
      <p className="text-gray-500">{job.location}</p>

      <hr className="border-gray-700" />

      <p className="text-sm text-gray-200">
      <p className="text-gray-500">{job.description}</p>
      <p className="text-gray-500">{job.requirements}</p>

      </p>

      <button className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition">
        Save Job
      </button>
    </div>
  );
}
