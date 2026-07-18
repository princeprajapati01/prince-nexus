import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Engineer | AI Systems Engineer | AI Innovator",
  description: "Building intelligent systems for Financial Technology, Natural Language Processing, and Document Intelligence.",
  keywords: ["AI Engineer", "Full Stack Developer", "Machine Learning", "NLP", "OCR", "Document Intelligence", "Financial Technology"],
  authors: [{ name: "Prince Prajapati" }],
  creator: "Prince Prajapati",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://princenexus.com",
    title: "PRINCE NEXUS | AI Engineer | AI Systems Engineer | AI Innovator",
    description: "Building intelligent systems for Financial Technology, Natural Language Processing, and Document Intelligence.",
    siteName: "PRINCE NEXUS",
  },
  twitter: {
    card: "summary_large_image",
    title: "PRINCE NEXUS | AI Engineer | AI Systems Engineer | AI Innovator",
    description: "Building intelligent systems for Financial Technology, Natural Language Processing, and Document Intelligence.",
    creator: "@princeprajapati",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
