import { useApi } from "../api";

export async function me(){
  const response = await useApi("/api/auth/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  return response;
}