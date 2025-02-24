export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  latitude: string;
  longitude: string;
  description: string;
  requirements: string;
}

export async function fetchJobs(): Promise<Job[]> {
  try {
    const response = await fetch("/api/jobs");
    if (!response.ok) throw new Error("Failed to fetch jobs");

    const jobs = await response.json();
    console.log("Fetched jobs:", jobs); 

    return jobs.filter(job => job.latitude !== null && job.longitude !== null);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}
