import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Yörük",
        short_name: "Yörük",
        description: "Yörük, seyahat planlamanızı kolaylaştıran, ülke bilgileri ve pasaport türlerine göre öneriler sunan bir uygulamadır.",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}