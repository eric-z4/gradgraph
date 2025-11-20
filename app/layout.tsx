import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "GradGraph",
    description: "GradGraph - Visualizing UH-system student degree data.",
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
