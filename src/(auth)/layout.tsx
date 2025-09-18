import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - Super Admin Dashboard",
  description: "Login to Super Admin Dashboard",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {children}
    </div>
  )
}