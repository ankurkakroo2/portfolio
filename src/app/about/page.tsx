import type { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About - Ankur Kakroo",
  description:
    "Ankur Kakroo is a Director of Engineering with expertise in platform engineering, product development, and team building. Over a decade of experience building scalable systems and leading high-performing teams.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ankurkakroo.in/about",
    title: "About - Ankur Kakroo",
    description:
      "Ankur Kakroo is a Director of Engineering with expertise in platform engineering, product development, and team building. Over a decade of experience building scalable systems and leading high-performing teams.",
    siteName: "Ankur Kakroo",
  },
  twitter: {
    card: "summary_large_image",
    title: "About - Ankur Kakroo",
    description:
      "Ankur Kakroo is a Director of Engineering with expertise in platform engineering, product development, and team building. Over a decade of experience building scalable systems and leading high-performing teams.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
