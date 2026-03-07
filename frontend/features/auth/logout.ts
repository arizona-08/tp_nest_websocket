import { useApi } from "../api";

export async function logoutUser(){
  const response = await useApi("/api/auth/logout", {
    method: "DELETE",
    credentials: "include"
  });

  return response;
}