import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";
import { CartProvider } from "@/components/cart";

export const metadata: Metadata = {
  title: { default: "Sentinel Supply", template: "%s | Sentinel Supply" },
  description: "Purpose-built technology for safer networks and smarter roads.",
  applicationName: "Sentinel Supply",
  appleWebApp: { capable: true, title: "Sentinel", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#14243C", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
