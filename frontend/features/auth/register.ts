import { useApi } from "../api";
import { RegisterDto } from "./dto/register.dto";

export async function registerUser(data: RegisterDto){
  const response = await useApi("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return response;
}