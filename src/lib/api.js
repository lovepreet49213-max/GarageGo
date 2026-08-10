const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api";

function getToken() {
  return localStorage.getItem("garagego_token");
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const opts = { method, headers: { ...headers } };

  const token = getToken();
  if (token) opts.headers.Authorization = `Bearer ${token}`;

  if (body !== undefined) {
    if (body instanceof FormData) {
      opts.body = body;
    } else {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    }
  }

  const res = await fetch(`${API_URL}${path}`, opts);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || data.error || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
  upload: (path, formData, opts) =>
    request(path, { ...opts, method: "POST", body: formData }),
};

export function formatPrice(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
export function sendEmail(formData) {
  return api.post("/send-email", formData);
}