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

export async function getDiscussion(discussionId: string): Promise<any> {
  const response = await useApi(`/api/discussions/${discussionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  return response
}