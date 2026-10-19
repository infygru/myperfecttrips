import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "My Perfect Trips",
        short_name: "My Perfect Trips",
        description: "Manchester's trusted UK travel agency — bespoke holiday packages, honeymoon tours, corporate travel, and more.",
        start_url: "/",
        display: "standalone",
        background_color: "#14141a",
        theme_color: "#be9820",
        icons: [
            { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
    };
}
