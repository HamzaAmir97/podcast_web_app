import type { Metadata } from "next";
import { Lexend ,Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Podcaster",
  description: "Podcast app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${lexend.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
