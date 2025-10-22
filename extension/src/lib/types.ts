import { z } from "zod"

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

const RegisterSchema = z.object({
  firstName: z.string().min(2, { message: "Name should be a string" }),
  lastName: z.string().min(2, { message: "Name should be a string" }),
  confirmPassword: z.string().min(2, {
    message: "Confirm Password should be a string",
  }),
}).merge(LoginSchema)



export { LoginSchema, RegisterSchema }