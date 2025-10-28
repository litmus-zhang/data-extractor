import { clsx, type ClassValue } from "clsx"
import { authClient } from "src/auth/auth-client"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_BASE = process.env.PLASMO_PUBLIC_API_URL || "http://localhost:4000"

export async function loginUser(email: string, password: string) {
  const { data, error } = await authClient.signIn.email({ email, password })
  if (error) throw new Error("Failed to login", { cause: error })
  return data
}
export async function registerUser(email: string, password: string, firstName: string, lastName: string) {
  const name = `${firstName} ${lastName}`;
  const { data, error } = await authClient.signUp.email({
    email,
    password,
    name
  })

  if (error) throw new Error("Failed to register", { cause: error })
  return data
}