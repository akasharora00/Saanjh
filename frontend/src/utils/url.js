export const getAssetUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const cleanPath = url.replace(/\\/g, "/").replace(/^\//, "");

  let serverUrl = import.meta.env.VITE_SERVER_URL;
  if (!serverUrl && import.meta.env.VITE_API_BASE_URL) {
    serverUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");
  }
  if (!serverUrl) {
    serverUrl = "http://localhost:5000";
  }
  return `${serverUrl.replace(/\/$/, "")}/${cleanPath}`;
};
