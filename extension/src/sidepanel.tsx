import { LoginForm } from "./components/login-form";

function SidePanel() {
    return (
        <div className="flex items-center justify-center h-[500px] w-[400px] flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Side Panel</h1>
            <LoginForm />
        </div>
    )
}

export default SidePanel