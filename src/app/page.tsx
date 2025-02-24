import JobMap from "@/components/Map";
import JobList from "@/components/JobList";

export default function HomePage() {
  return (
    <div className="flex">
      <div className="w-2/3 h-screen">
        <JobMap />
      </div>
      <div className="w-1/3 h-screen overflow-y-auto bg-gray-900 p-4">
        <JobList />
      </div>
    </div>
  );
}
