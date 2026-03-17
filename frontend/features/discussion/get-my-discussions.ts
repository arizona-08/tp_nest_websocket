import { useApi } from "../api";

export async function fetchMyDiscussions(): Promise<any> {
  const response = await useApi("/api/discussions/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  return response
}