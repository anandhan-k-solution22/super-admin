"use client"

import { useState } from "react"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAdminAuthStore } from "@/app/_stores/admin/authStore"
import Link from "next/link"
import Image from "next/image"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    usercode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usercodeError, setUsercodeError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAdminAuthStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'email' ? e.target.value.toLowerCase() : e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setUsercodeError(null)
    setEmailError(null)
    setPasswordError(null)

    const schema = z.object({
      usercode: z.string().trim().min(1, "User name is required"),
      email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
      password: z.string().min(8, "Password must be at least 8 characters")
    })

    const parsed = schema.safeParse({
      usercode: formData.usercode,
      email: formData.email,
      password: formData.password
    })

    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors
      if (f.usercode?.[0]) setUsercodeError(f.usercode[0])
      if (f.email?.[0]) setEmailError(f.email[0])
      if (f.password?.[0]) setPasswordError(f.password[0])
      setIsLoading(false)
      return
    }

    const result = await signUp({
      ...formData,
      email: formData.email.toLowerCase()
    })
    
    if (result.success) {
      setSuccess(true)
      toast.success("Account created successfully!")
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        usercode: ''
      })
    } else {
      setError(result.error || 'Sign up failed')
      toast.error(result.error || 'Sign up failed')
    }
    
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Logo/Brand at the top */}
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Acme Inc.</span>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-1">
          {/* Left side - Success Message */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-16 xl:px-20">
            <div className="mx-auto w-full max-w-xs text-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h1>
                <p className="text-sm text-gray-600">
                  Your account has been created successfully. You can now sign in.
                </p>
              </div>
              <Button
                onClick={() => window.location.href = '/sign-in'}
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 transition-colors duration-200"
              >
                Go to Sign In
              </Button>
            </div>
          </div>

          {/* Right side - Image */}
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
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Sign Up Form */}
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
          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6")}>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="text-sm text-gray-600">
                Enter your information to create your account
              </p>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="usercode" className="text-gray-700 font-medium">User name</Label>
                <Input
                  id="usercode"
                  name="usercode"
                  type="text"
                  required
                  value={formData.usercode}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-black focus:ring-black"
                  placeholder="John Doe"
                />
                {usercodeError && <p className="text-xs text-red-500">* {usercodeError}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-black focus:ring-black"
                  placeholder="m@example.com"
                />
                {emailError && <p className="text-xs text-red-500">* {emailError}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="border-gray-300 focus:border-black focus:ring-black"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="w-10 border-gray-300 hover:border-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
                {passwordError && <p className="text-xs text-red-500">* {passwordError}</p>}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 transition-colors duration-200 disabled:opacity-80" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </span>
                ) : (
                  "Sign Up"
                )}
              </Button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/" className="font-medium text-black hover:text-gray-800">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
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
