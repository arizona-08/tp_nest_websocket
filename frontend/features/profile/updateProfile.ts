import { useApi } from "../api";
import { UpdateProfileDto } from "./dtos/update-profile.dto";

export async function updateProfile(data: UpdateProfileDto){
  const response = await useApi("/api/profile/update-profile", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  return response;
}