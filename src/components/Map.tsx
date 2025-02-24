"use client";

import { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchJobs, Job } from "@/lib/fetchJobs";
import { MdWork } from "react-icons/md";

interface JobMapProps {
  selectedJob: Job | null;
  onSelectJob: (job: Job) => void;
}

export default function JobMap({ selectedJob, onSelectJob }: JobMapProps) {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function loadJobs() {
      const data = await fetchJobs();
      setJobs(data);
    }
    loadJobs();
  }, []);

  return (
    <Map
      initialViewState={{
        latitude: 38.5449,
        longitude: -121.7405,
        zoom: 12,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      {jobs.map((job) => {
        const lat = parseFloat(job.latitude);
        const lng = parseFloat(job.longitude);
        const isSelected = selectedJob?.id === job.id;

        return (
          <Marker
            key={job.id}
            latitude={lat}
            longitude={lng}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onSelectJob(job);
            }}
          >
            <MdWork
              size={isSelected ? 32 : 24}
              className={`
                cursor-pointer
                transition-transform duration-200
                ${isSelected ? "text-orange-300 scale-110" : "text-orange-500 hover:scale-110"}
              `}
            />
          </Marker>
        );
      })}
    </Map>
  );
}
