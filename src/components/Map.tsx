"use client";

import { useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Job } from "@/lib/fetchJobs";
import { MdWork, MdBookmark } from "react-icons/md";
import { motion } from "framer-motion";
import { useSavedJobs } from "@/context/SavedJobsContext";
import type { MapRef } from "react-map-gl";

interface JobMapProps {
selectedJob: Job | null;
onSelectJob: (job: Job | null) => void;
showSavedJobs: boolean;
searchQuery: string;
jobs: Job[];}

export default function JobMap({ selectedJob, onSelectJob, showSavedJobs, searchQuery, jobs }: JobMapProps) {
const { savedJobs, isJobSaved } = useSavedJobs();

const mapRef = useRef<MapRef | null>(null);

useEffect(() => {
  if (selectedJob && mapRef.current) {
    const lat = parseFloat(selectedJob.latitude);
    const lng = parseFloat(selectedJob.longitude);
    mapRef.current.flyTo({
      center: [lng, lat],
      speed: 1.0,
      curve: 1.5,
      easing: (t: number) => t * (2 - t),
    });
  }
}, [selectedJob]);

const filterJobs = (jobs: Job[]) => {
  if (!searchQuery.trim()) return jobs;
  
  const query = searchQuery.toLowerCase().trim();
  return jobs.filter(job => 
    job.title.toLowerCase().includes(query) ||
    job.company.toLowerCase().includes(query)
  );
};

const displayJobs = filterJobs(showSavedJobs ? savedJobs : jobs);

return (
  <Map
    ref={mapRef}
    initialViewState={{
      latitude: 38.5449,
      longitude: -121.7405,
      zoom: 14,
    }}
    style={{ width: "100%", height: "100%" }}
    mapStyle="mapbox://styles/mapbox/outdoors-v12"
    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    onClick={() => onSelectJob(null)}
  >
    {displayJobs.map((job) => {
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
            <motion.div 
              className="p-2 rounded-full shadow-lg"
              animate={{ 
                backgroundColor: isSelected 
                  ? (isJobSaved(job.id) ? 'rgb(168, 85, 247)' : 'rgb(244, 96, 68)')
                  : isJobSaved(job.id)
                    ? 'rgb(168, 85, 247)'
                    : 'rgb(255, 255, 255)',
                color: isSelected || isJobSaved(job.id)
                  ? 'rgb(255, 255, 255)'
                  : 'rgb(244, 96, 54)'
              }}
              transition={{ duration: 0.2 }}
            >
              {isJobSaved(job.id) ? (
                <MdBookmark size={isSelected ? 24 : 20} />
              ) : (
                <MdWork size={isSelected ? 24 : 20} />
              )}
            </motion.div>
          </motion.div>
        </Marker>
      );
    })}
  </Map>
);
}
