import "./globals.css";
import { Inter, Merriweather } from "next/font/google";
import { Providers } from "./providers";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export const metadata = {
  title: "Deuterocanonical-Canonical Bible",
  description: "Study the Word. Teach with Confidence.",
  manifest: "/manifest.json",
  themeColor: "#1e3a5f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <AppHeader />
            <div className="flex flex-1">
              <AppSidebar />
              <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}