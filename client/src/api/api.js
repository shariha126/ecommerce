const API_URL = "http://10.21.153.90:5000/api";

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");

    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();

      throw new Error(
        `Server returned non-JSON response (${response.status}): ${text.slice(
          0,
          100
        )}`
      );
    }

    if (!response.ok) {
      throw new Error(data?.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);

    throw new Error(error.message || "Network error");
  }
};

export default api;