const apiBase = "https://challenges.gg/api";

export async function fetchApiPath<T>(
   path: string,
   method: "GET" | "POST" = "GET",
): Promise<T | null> {
   return fetchApi(`${apiBase}${path}`, method);
}

export async function fetchApi<T>(
   url: string,
   method: "GET" | "POST" = "GET",
): Promise<T | null> {
   try {
      const request = await fetch(url, {
         method,
         headers: {
            // "Content-Type": "application/json",
         },
      });

      if (await !request.ok) return null;
      const response = (await request.json()) as T;

      return response;
   } catch (err) {
      console.error("Failed to fetch API path", err);
      return null;
   }
}
