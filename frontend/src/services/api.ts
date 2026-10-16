const API_URL = "http://localhost:5139/api";

export async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (body.message) return body.message;
    if (body.errors) return Object.values(body.errors).flat()[0] as string;
  } catch {
    // svaret var inte JSON
  }
  return `Något gick fel (${response.status})`;
}