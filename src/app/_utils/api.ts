import { supabase } from "@/utils/supabase";

const getHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("認証が必要です");
  }
  return {
    "Content-Type": "application/json",
    Authorization: session?.access_token,
  };
};

const api = {
  async get(endpoint: string) {
    const headers = await getHeaders();
    const response = await fetch(endpoint, {
      method: "GET",
      headers,
    });
    if (!response.ok) throw new Error("API request failed");
    return response.json();
  },

  async post(endpoint: string, body: any) {
    const headers = await getHeaders();
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("API request failed");
    return response;
  },

  async put(endpoint: string, body: any) {
    const headers = await getHeaders();
    const response = await fetch(endpoint, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("API request failed");
    return response;
  },

  async delete(endpoint: string) {
    const headers = await getHeaders();
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error("API request failed");
    return response;
  },
};

export default api;
