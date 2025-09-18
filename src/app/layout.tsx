import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import AuthInitializer from "@/components/auth-initializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Super Admin Dashboard",
  description: "Super Admin Dashboard for managing companies and settings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInitializer />
        {children}
        <Toaster 
          toastOptions={{
            style: {
              background: '#007a55',
              color: '#ffffff',
            },
            classNames: {
              success: '!bg-green-500 !text-white',
              error: '!bg-red-500 !text-white',
              warning: '!bg-yellow-500 !text-white',
              info: '!bg-blue-500 !text-white',
            }
          }}
        />
      </body>
    </html>
  );
}
