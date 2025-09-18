"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import { useAdminAuthStore } from "@/app/_stores/admin/authStore"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const router = useRouter()
  const { forgotPassword, admin, loading, forgotPasswordEmail, clearForgotPasswordEmail } = useAdminAuthStore()

  // Set email from Zustand state when component mounts
  useEffect(() => {
    if (forgotPasswordEmail) {
      setEmail(forgotPasswordEmail);
    }
  }, [forgotPasswordEmail]);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && admin) {
      router.replace('/dashboard');
    }
  }, [admin, loading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setEmailError(null)
    setIsLoading(true)

    const schema = z.object({
      email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
    })
    const parsed = schema.safeParse({ email })
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors
      if (f.email?.[0]) setEmailError(f.email[0])
      setIsLoading(false)
      return
    }

    const response = await forgotPassword({ email })
    if (!response.success) {
      setError(response.error || "Something went wrong")
    } else {
      setError(null)
      toast.success("Password reset link sent", {
        description: "Check your email for the reset link",
      })
      clearForgotPasswordEmail()
      // Don't redirect immediately, let user see the success message
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Forgot Password Form with proper alignment */}
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
          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6")}>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-black-900">Forgot your password?</h1>
              <p className="text-sm text-gray-600">
                Enter your email address and we&apos;ll send you a link to reset your password
              </p>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-black-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="border-gray-300 focus:border-black focus:ring-black"
                  onFocus={() => {
                    if (message || error) {
                      setMessage(null)
                      setError(null)
                    }
                  }}
                />
              </div>
              {emailError && <p className="text-xs text-red-500">* {emailError}</p>}
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 transition-colors duration-200" 
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              {message && <p className="text-sm text-green-500">{message}</p>}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="text-center text-sm text-black-600">
              Remember your password?{" "}
              <Link href="/" className="underline underline-offset-4 cursor-pointer">
                Login
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