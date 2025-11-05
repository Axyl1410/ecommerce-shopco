"use client";

import SpinnerbLoader from "@/components/ui/SpinnerbLoader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function TestPage() {
  const fetchGroups = () =>
    axios.get("api/test/query").then((response) => response.data);

  const { isLoading, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: fetchGroups,
    staleTime: 60_000,
  });

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SpinnerbLoader className="w-10 border-2 border-gray-300 border-r-gray-600" />
      </div>
    );

  if (error) return "An error has occurred: " + error;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
}
