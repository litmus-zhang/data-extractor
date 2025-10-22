import { Button } from "src/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "src/components/ui/card"
import { Input } from "src/components/ui/input"
import { Label } from "src/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "src/components/ui/tabs"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"

export function AuthLogin() {
    return (
        <Tabs defaultValue="account" className="w-[350px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Login</TabsTrigger>
                <TabsTrigger value="password">Signup</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
                <SignupForm />
            </TabsContent>
        </Tabs>
    )
}
