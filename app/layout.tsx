
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Mystery Archive | Unsolved Historical Mysteries",
    template: "%s | Mystery Archive",
  },

  description:
    "Explore unsolved historical mysteries, strange events, unexplained disappearances, and bizarre figures from the past.",

  keywords: [
    "unsolved historical mysteries",
    "historical mysteries",
    "unexplained disappearances",
    "strange historical events",
    "bizarre historical figures",
    "unexplained history",
    "mystery history",
  ],

  authors: [
    {
      name: "Mystery Archive",
    },
  ],

  creator: "Mystery Archive",

  publisher: "Mystery Archive",

  applicationName: "Mystery Archive",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Mystery Archive",

    title:
      "Mystery Archive | Unsolved Historical Mysteries",

    description:
      "Explore unsolved historical mysteries, strange events, unexplained disappearances, and bizarre figures from the past.",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Mystery Archive - Unsolved Historical Mysteries",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Mystery Archive | Unsolved Historical Mysteries",

    description:
      "Explore unsolved historical mysteries, strange events, unexplained disappearances, and bizarre figures from the past.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f5f1e8] text-[#172033]">
        <div className="flex min-h-screen flex-col">

          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />

        </div>
      </body>
    </html>
  );
}
