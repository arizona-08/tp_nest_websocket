import { User } from "@/types/user";
import { useApi } from "../api";

export async function searchUsers(query: string): Promise<any> {
  const response = await useApi(`/api/users/search?query=${encodeURIComponent(query)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  })
  return response;
}