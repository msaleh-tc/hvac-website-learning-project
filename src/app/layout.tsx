import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ComfortAir Pro | Residential & Commercial HVAC Services",
  description:
    "Professional heating and cooling maintenance, repair, and installation services for residential and commercial properties. 24/7 emergency service available.",
  keywords: [
    "HVAC", "heating", "cooling", "air conditioning", "furnace",
    "maintenance", "repair", "installation", "residential", "commercial",
  ],
  openGraph: {
    title: "ComfortAir Pro | HVAC Services",
    description: "Professional heating and cooling services. 24/7 emergency support.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
