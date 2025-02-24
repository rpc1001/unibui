"use client";

import { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchJobs, Job } from "@/lib/fetchJobs";
import { MdWork } from "react-icons/md";
import { motion } from "framer-motion";

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
            <motion.div
              animate={{
                scale: isSelected ? 1.2 : 1,
                y: isSelected ? -10 : 0
              }}
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className={`
                p-2 rounded-full shadow-lg
                ${isSelected ? 'bg-orange-400 text-white' : 'bg-white text-orange-400'}
              `}>
                <MdWork size={isSelected ? 24 : 20} />
              </div>
            </motion.div>
          </Marker>
        );
      })}
    </Map>
  );
}
