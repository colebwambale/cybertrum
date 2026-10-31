import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sentinel Supply",
    short_name: "Sentinel",
    description: "Network security and traffic management equipment.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F5F7FA",
    theme_color: "#14243C",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
