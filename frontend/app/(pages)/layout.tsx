// app/(pages)/layout.tsx
import AppHeader from "@/components/Core/AppHeader";
import SideBarPlayer from "@/components/Core/SideBarPlayer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        <div className="min-h-[100dvh] pb-[calc(160px+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </div>
        <SideBarPlayer />
      </body>
    </html>
  );
}
