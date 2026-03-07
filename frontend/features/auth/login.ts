import { useApi } from "../api";
import { LoginDto } from "./dto/login.dto";

export async function loginUser(data: LoginDto){
  const response = await useApi("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  return response;
}