// app/page.tsx
import { fetchJobs, Job } from "../lib/fetchJobs";

export const dynamic = "force-static"; 
// or use "force-dynamic" to allow revalidation, etc.

export default async function Page() {
  const jobs: Job[] = await fetchJobs();

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id} className="border p-4 mb-4 rounded-md">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-300">{job.company}</p>
            <p className="text-gray-300">{job.description}</p>
            <p className="text-gray-300">{job.requirements}</p>
            <p className="text-gray-400">{job.location}</p>
            <p className="text-gray-400">{job.latitude}</p>
            <p className="text-gray-400">{job.longitude}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
