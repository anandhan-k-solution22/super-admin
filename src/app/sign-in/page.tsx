"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import  {useAdminAuthStore}  from "@/app/_stores/admin/authStore"
import Link from "next/link"
import Loading from "../../loading"
import Image from "next/image"

interface LoginFormProps {
  initialEmail?: string;
}

export default function LoginForm({ initialEmail = "" }: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const { signIn, admin, loading, setForgotPasswordEmail, validateAuth, syncAuthState } = useAdminAuthStore();
  const router = useRouter()

  // Update email when initialEmail prop changes
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail)
    }
  }, [initialEmail])

  // Check authentication immediately on mount
  useEffect(() => {
    // Sync auth state to handle cases where admin data exists but no token
    syncAuthState();
    
    // Check localStorage directly for auth token
    const authToken = localStorage.getItem('authToken');
    const adminData = localStorage.getItem('admin-auth-storage');
    
    console.log('Direct auth check:', { 
      authToken: !!authToken, 
      adminData: !!adminData,
      admin: !!admin,
      loading 
    });
  }, [admin, loading, syncAuthState]);



  // Avoid full-screen loader on sign-in to prevent white screen flash

  // Check if user is authenticated and redirect immediately
  if (admin) {
    router.replace('/app-lists');
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setEmailError(null);
    setPasswordError(null);

    const schema = z.object({
      email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    })

    const parsed = schema.safeParse({ email, password })
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors
      if (f.email?.[0]) setEmailError(f.email[0])
      if (f.password?.[0]) setPasswordError(f.password[0])
      setIsLoading(false)
      return
    }
  
    try {
      const response = await signIn({ email, password });
      if(response.success){
        toast.success("Login successfully", {
          style: {
            background: '#007a55',
            color: '#ffffff',
            border: 'none'
          }
        })
        // Redirect to app-lists page after successful login
        router.push("/app-lists");
        setIsLoading(false);
      }
      else{
        toast.error(`${response.error||"Something went wrong, Please try again"}`)
        setError(response.error || "Something went wrong, Please try again")
        setIsLoading(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong. Please try again.")
      } else {
        setError("Something went wrong. Please try again.")
      }
      setIsLoading(false);
    } 
  };
  

  // useEffect(() => {
  //   if (user) {
  //     if (!user.role) {
  //       setError("Invalid email or password")
  //     }
  //     else {
  //       router.push("/")
  //     }
  //   }
  // }, [user, router])

  // const handleSocialLogin = async (provider: "google" ) => {
  //   setError(null)
  //   setIsLoading(true)
  //   const { error } = await supabase.auth.signInWithOAuth({ provider })
  //   if (error) {
  //     setError(error.message)
  //     toast.error("Social login failed. Please try again.")
  //   }
  //   setIsLoading(false)
  // }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
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
              <h1 className="text-2xl font-bold text-black-900">Login to your account</h1>
              <p className="text-sm text-gray-600">Enter your email below to login to your account</p>
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
                />
                {emailError && <p className="text-xs text-red-500">* {emailError}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-black-700 font-medium">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer"
                    onClick={() => setForgotPasswordEmail(email)}
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 focus:border-black focus:ring-black"
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
                  "Login"
                )}
              </Button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-medium text-black hover:text-gray-800">
                Sign up
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