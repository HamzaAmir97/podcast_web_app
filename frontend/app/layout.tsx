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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lexend.variable}`}
    >
      {/* خلي body ثابت، ولو حابب تمنع تحذيرات لأي اختلاف طفيف استخدم suppressHydrationWarning */}
      <body className="antialiased" suppressHydrationWarning>
        {/* AppHeader ... الخ */}
        <div className="min-h-[100dvh] pb-[calc(160px+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </div>
      </body>
    </html>
  );
}
