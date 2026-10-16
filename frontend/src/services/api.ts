const API_URL = "http://localhost:5139/api";

export async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

    let response: Response;
    try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
    } catch {
    throw new Error("Kunde inte nå servern. Försök igen senare.");
    }

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

  if (response.status === 404) return "Det du letar efter finns inte.";
  
  return `Något gick fel (${response.status})`;
}