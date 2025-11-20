import { ThemeProvider } from "@/components/theme-provider";
// import { ChatWidget } from "@/components/chat-widget"; // Uncomment after adding OPENAI_API_KEY to .env.local
import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ankur Kakroo - Director of Engineering",
  description: "Director of Engineering with expertise in platform engineering, product development, and team building. Building scalable systems and leading high-performing teams.",
  keywords: ["Ankur Kakroo", "Director of Engineering", "Platform Engineering", "Product Development", "Team Leadership", "Software Engineering"],
  authors: [{ name: "Ankur Kakroo" }],
  creator: "Ankur Kakroo",
  metadataBase: new URL('https://ankurkakroo.in'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ankurkakroo.in",
    title: "Ankur Kakroo - Director of Engineering",
    description: "Director of Engineering with expertise in platform engineering, product development, and team building.",
    siteName: "Ankur Kakroo",
    images: [
      {
        url: "/profile.jpg",
        width: 800,
        height: 800,
        alt: "Ankur Kakroo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Ankur Kakroo - Director of Engineering",
    description: "Director of Engineering with expertise in platform engineering, product development, and team building.",
    images: ["/profile.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
        className={`${instrumentSerif.variable} ${geist.variable} antialiased bg-white dark:bg-black text-black dark:text-white transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="portfolio-theme"
        >
          {children}
          {/* Uncomment after adding OPENAI_API_KEY to .env.local */}
          {/* <ChatWidget /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
