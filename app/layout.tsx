import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "GradGraph",
    description: "GradGraph - Visualizing the degrees awarded across the University of Hawai‘i",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
