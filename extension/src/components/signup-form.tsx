import { cn, registerUser } from "src/lib/utils"
import { RegisterSchema } from "src/lib/types"
import { Button } from "src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card"
import { Input } from "src/components/ui/input"
import { Label } from "src/components/ui/label"
import { useForm } from "react-hook-form"
import { z } from "zod"

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { register, handleSubmit, setError } = useForm<z.infer<typeof RegisterSchema>>({})

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    const { email, password, confirmPassword, firstName, lastName } = data
    if (password !== confirmPassword) {
      console.log("Passwords do not match")
      setError("confirmPassword", {
        message: "Passwords do not match"
      })
      return
    }
    const res = await registerUser(email, password, firstName, lastName)
    console.log(res)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Signup</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex gap-2 items-center">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Firstname</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Lastname</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                  />
                </div>


              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm Password</Label>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Signup
              </Button>
              <Button variant="outline" className="w-full">
                Signup with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
