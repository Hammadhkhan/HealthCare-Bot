import axios from "axios";

let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken");

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

api.interceptors.request.use(async (config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && refreshToken) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
          { refresh_token: refreshToken }
        );
        accessToken = res.data.access_token;
        localStorage.setItem("accessToken", accessToken);

        err.config.headers.Authorization = `Bearer ${accessToken}`;
        return axios(err.config);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;