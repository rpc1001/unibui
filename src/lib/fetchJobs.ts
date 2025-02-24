import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  requirements: string;
}

export async function fetchJobs(): Promise<Job[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "jobs.csv");
    const fileData = fs.readFileSync(filePath, "utf8");

    const records: { 
      "Job Title": string; 
      "Company Name": string; 
      "Location": string; 
      "Latitude": string; 
      "Longitude": string; 
      "Job Description": string; 
      "Requirements": string;
    }[] = parse(fileData, {
      columns: true, 
      skip_empty_lines: true,
      trim: true,
    });


    // map records into Job objects
    const jobs: Job[] = records.map((row, index) => ({
      id: `job-${index + 1}`,
      title: row["Job Title"] || "",
      company: row["Company Name"] || "",
      location: row["Location"] || "",
      latitude: parseFloat(row["Latitude"]) || 0,
      longitude: parseFloat(row["Longitude"]) || 0,
      description: row["Job Description"] || "",
      requirements: row["Requirements"] || "",
    }));

    return jobs;
  } catch (error) {
    console.error("Error reading jobs.csv:", error);
    return [];
  }
}
