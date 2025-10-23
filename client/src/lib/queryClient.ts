import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  method: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Detect FormData and send it without JSON serialization
  const isFormData = data instanceof FormData;
  
  const res = await fetch(url, {
    method,
    headers: isFormData ? {} : (data ? { "Content-Type": "application/json" } : {}),
    body: isFormData ? data as FormData : (data ? JSON.stringify(data) : undefined),
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Build URL from query key
    // If queryKey has an object as last element, treat it as query params
    // Otherwise, join all elements as path segments
    let url: string;
    let queryParams: Record<string, any> | null = null;
    
    // Check if the last element is a plain object (not array, not null)
    const lastElement = queryKey[queryKey.length - 1];
    const isLastElementParamsObject = 
      queryKey.length > 1 &&
      typeof lastElement === 'object' && 
      lastElement !== null && 
      !Array.isArray(lastElement);
    
    if (isLastElementParamsObject) {
      // Last element is query params, rest are path segments
      const pathSegments = queryKey.slice(0, -1);
      url = pathSegments.join("/") as string;
      queryParams = lastElement as Record<string, any>;
    } else {
      // All elements are path segments
      url = queryKey.join("/") as string;
    }
    
    // Append query parameters if any
    if (queryParams) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      }
      const queryString = params.toString();
      if (queryString) {
        url += '?' + queryString;
      }
    }
    
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
