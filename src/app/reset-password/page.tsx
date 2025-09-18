"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import { useAdminAuthStore } from "@/app/_stores/admin/authStore"
import { createClient } from '@/lib/supabase/client'
import Image from "next/image"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { admin, loading } = useAdminAuthStore()

  // Supabase will redirect to this page with a `code` query param for recovery
  const code = searchParams.get('code')

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && admin) {
      router.replace('/app-lists');
    }
  }, [admin, loading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setPasswordError(null)
    setConfirmError(null)

    // Validate passwords
    const schema = z.object({
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string()
    }).refine((val) => val.password === val.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
    const parsed = schema.safeParse({ password, confirmPassword })
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors
      if (f.password?.[0]) setPasswordError(f.password[0])
      if (f.confirmPassword?.[0]) setConfirmError(f.confirmPassword[0])
      return
    }

    // With Supabase Auth flow, we don't need custom token/email in query

    setIsLoading(true)

    try {
      const supabase = createClient()

      // If arriving from email with a recovery code, exchange it for a session
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession({ code })
        if (exchangeError) {
          setError("Invalid or expired reset link. Please request a new one.")
          return
        }
      }

      // Update password via Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({ password })
      if (authError) {
        setError(authError.message || "Failed to update password. Please try again.")
        return
      }

      // Also sync your custom users table so your login (which reads users table) matches
      const { data: authUserData } = await supabase.auth.getUser()
      const authEmail = authUserData?.user?.email
      if (authEmail) {
        await supabase
          .from('users')
          .update({ user_password: password })
          .eq('user_email', authEmail)
      }
      
      toast.success("Password reset successfully", {
        description: "You can now login with your new password",
      })
      
      // Redirect to sign-in page
      router.push("/sign-in")
    } catch (error) {
      setError("Invalid or expired reset link. Please request a new one.")
    }

    setIsLoading(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Reset Password Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-16 xl:px-20 relative">
        {/* Logo/Brand at the top */}
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Acme Inc.</span>
          </div>
        </div>

        {/* Bottom left icon */}
        <div className="absolute bottom-6 left-6 z-10">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xs">
          <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6")}>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-black-900">Reset your password</h1>
              <p className="text-sm text-gray-600">
                Enter your new password below
              </p>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-black-700 font-medium">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
              {passwordError && <p className="text-xs text-red-500">* {passwordError}</p>}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-black-700 font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
                {confirmError && <p className="text-xs text-red-500">* {confirmError}</p>}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 transition-colors duration-200" 
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="text-center text-sm text-black-600">
              Remember your password?{" "}
              <Link href="/sign-in" className="underline underline-offset-4 cursor-pointer">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image (hidden on mobile/tablet, 50% on desktop) */}
      <div className="hidden lg:block w-1/2 relative">
        <Image
          src="/background.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
