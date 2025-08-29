import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agencia 1 - Especialistas en Regalos Publicitarios y Merchandising",
  description: "Agencia 1 - Transformamos ideas en experiencias memorables con productos promocionales innovadores, displays creativos y soluciones personalizadas.",
  keywords: ["Agencia 1", "regalos publicitarios", "merchandising", "productos promocionales", "personalización", "displays creativos"],
  authors: [{ name: "Agencia 1 Team" }],
  openGraph: {
    title: "Agencia 1 - Regalos Publicitarios y Merchandising",
    description: "Especialistas en crear estrategias de marca impactantes a través de productos promocionales innovadores",
    url: "https://agencia1.cl",
    siteName: "Agencia 1",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agencia 1 - Regalos Publicitarios y Merchandising",
    description: "Transformamos ideas en experiencias memorables",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
