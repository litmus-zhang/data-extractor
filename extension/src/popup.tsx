import { CountButton } from "./features/count-button"
import { authClient } from "./auth/auth-client"


import "./style.css"

function IndexPopup() {
  // const { data, isPending, error } = authClient.useSession();
  // if (isPending) {
  //   return <>Loading...</>
  // }
  // if (error) {
  //   return <>Error: {error.message}</>
  // }
  // if (data) {
  //   return <>Signed in as {data.user.name}</>
  // }
  return (
    <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-16 plasmo-w-40">
      <CountButton />
    </div>
  )
}

export default IndexPopup
