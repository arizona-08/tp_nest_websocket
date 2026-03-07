import { useApi } from "../api";
import { ChangePasswordDto } from "./dtos/change-password.dto";

export async function changePassword(data: ChangePasswordDto) {
  const response = await useApi("/api/profile/update-password", {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  return response;
}