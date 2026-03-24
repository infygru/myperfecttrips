import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "My Perfect Trips",
        short_name: "MyPerfectTrips",
        description: "India's trusted travel agency — premium holiday packages, honeymoon tours, corporate MICE, and more.",
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
