import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { parse } from "csv-parse/sync";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "jobs.csv");
    const fileData = await fs.readFile(filePath, "utf8");

    const records = parse(fileData, {
      columns: (header: string[]) => header.map((h: string) => h.trim()), 
      skip_empty_lines: true,
    }).map((job: Record<string, string>, index: number) => ({
      id: `job-${index}`,
      title: job["Job Title"]?.trim() || "Unknown Title",  
      company: job["Company Name"]?.trim() || "Unknown Company",
      location: job["Location"]?.trim() || "Unknown Location",
      latitude: job["Latitude"] ? String(job["Latitude"]).trim() : "0",
      longitude: job["Longitude"] ? String(job["Longitude"]).trim() : "0",
      description: job["Job Description"]?.trim() || "",
      requirements: job["Requirements"]?.trim() || "",
    }));


    return NextResponse.json(records);
  } catch (error) {
    console.error("Error loading jobs:", error);
    return NextResponse.json({ error: "Failed to load jobs" }, { status: 500 });
  }
}
