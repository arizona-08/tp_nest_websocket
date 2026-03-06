export async function useApi(endpoint: string, options: {}){
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    credentials: 'include',
  });
  return response;
}