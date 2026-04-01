import { useApi } from "../api";

export async function createPrivateDiscussion(userId: string): Promise<any> {
  const response = await useApi("/api/discussions/create-private", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ userId })
  });
  return response;
}

export async function createGroupDiscussion(name: string, userIds: string[], historyMode: "all" | "from_join"): Promise<any> {
  const response = await useApi("/api/discussions/create-group", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ name, userIds, historyMode })
  });
  return response;
}