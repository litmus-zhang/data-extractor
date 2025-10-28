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

const PromptResponseSchema = {
  "type": "object",
  "properties": {
    "comparable_sales": {
      "type": "array",
      "maxItems": 3,
      "items": {
        "type": "string"
      }
    },
    "rental_estimates": {
      "type": "string",
    }
  },
  "required": ["comparable_sales", "rental_estimates"],
  "additionalProperties": false
}

export { LoginSchema, RegisterSchema, PromptResponseSchema }