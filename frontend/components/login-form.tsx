"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { loginSchema, LoginSchema } from "@/validator/login.schema"
import { FormMessage } from "./ui/form"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [useOtp, setUseOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  // ✅ Hook Form setup
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      otp: "",
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const handleSendOtp = async () => {
    const email = form.getValues("email")
    if (!email) {
      alert("Please enter your email or phone first.")
      return
    }
    setOtpSent(true)
    console.log("📨 Sending OTP to:", email)
    // ⚡ Add your API call here
  }

  const onSubmit = async (data: LoginSchema) => {
    console.log("✅ Login data:", data)
    // ⚡ API call for login or OTP verification
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-4">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Sales Analysis Dashboard</h1>
                <p className="text-muted-foreground text-balance">
                  {useOtp ? "Login using OTP" : "Login to your Dashboard"}
                </p>
              </div>

              {/* Email / Phone Field */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type={useOtp ? "text" : "email"}
                  placeholder={useOtp ? "Enter your email or phone" : "m@example.com"}
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
              </Field>

              {/* Password or OTP Field */}
              {!useOtp ? (
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && (
                    <span className="text-red-500 text-sm">{errors.password.message}</span>
                  )}
                </Field>
              ) : otpSent ? (
                <Field>
                  <FieldLabel htmlFor="otp">Enter OTP</FieldLabel>
                  <Input id="otp" type="text" maxLength={6} {...register("otp")} />
                  <FormMessage message={errors.password?.message as string} />
                </Field>
              ) : null}

              {/* Buttons */}
              <Field>
                {!useOtp ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                ) : otpSent ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Verifying..." : "Verify & Login"}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSendOtp}>
                    Send OTP
                  </Button>
                )}
              </Field>

              {/* Toggle between login modes */}
              <FieldDescription className="text-center text-sm">
                {useOtp ? (
                  <>
                    Prefer password login?{" "}
                    <button
                      type="button"
                      className="text-primary underline-offset-2 hover:underline"
                      onClick={() => {
                        setUseOtp(false)
                        setOtpSent(false)
                        form.reset()
                      }}
                    >
                      Use password
                    </button>
                  </>
                ) : (
                  <>
                    Want to login with OTP?{" "}
                    <button
                      type="button"
                      className="text-primary underline-offset-2 hover:underline"
                      onClick={() => setUseOtp(true)}
                    >
                      Use OTP
                    </button>
                  </>
                )}
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Side image */}
          <div className="bg-muted relative flex justify-center items-center md:block">
            <Image
              className="object-contain dark:brightness-[0.2] dark:grayscale"
              src="/login-image.png"
              alt="Login picture"
              width={400}
              height={400}
              priority
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
