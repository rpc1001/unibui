"use client";

import { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchJobs, Job } from "@/lib/fetchJobs";

export default function JobMap() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

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
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      {jobs.map((job) => {
        const lat = parseFloat(job.latitude);
        const lng = parseFloat(job.longitude);
        return (
          <Marker
            key={job.id}
            latitude={lat}
            longitude={lng}
            anchor="bottom" 
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedJob(job);
            }}
          >
            <div className="cursor-pointer text-xl">📍</div>
          </Marker>
        );
      })}

      {selectedJob && (
        <Popup
          latitude={parseFloat(selectedJob.latitude)}
          longitude={parseFloat(selectedJob.longitude)}
          onClose={() => setSelectedJob(null)}
          closeOnClick={false}
          anchor="top"
        >
          <div className="p-2">
            <h3 className="font-bold">{selectedJob.title}</h3>
            <p>{selectedJob.company}</p>
            <p>{selectedJob.location}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
