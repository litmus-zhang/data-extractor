import { authClient } from "./auth/auth-client"


import "./style.css"
import { LoginForm } from "./components/login-form"

function IndexPopup() {
  const { data, isPending, error } = authClient.useSession();
  console.log({ data, isPending, error });
  if (isPending) {
    return <div className="flex items-center justify-center h-[500px] w-[400px] flex-col gap-4 p-4">Loading...</div>
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-[500px] w-[400px] flex-col gap-4 p-4">
        Error: {error.message}
      </div>
    )
  }
  if (data) {
    return <div className="flex items-center justify-center h-[500px] w-[400px] flex-col gap-4 p-4">Signed in as {data.user.name}</div>
  }
   return (
      <div className="flex items-center justify-center h-[500px] w-[400px] flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Popup page</h1>
        <LoginForm />
      </div>
    )

}

export default IndexPopup
