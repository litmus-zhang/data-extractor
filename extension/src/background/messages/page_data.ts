import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const insight = await fetch(`${process.env.PLASMO_PUBLIC_API_URL}/api/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
    })
    const data = await insight.json()
    res.send({
        data
    })
}

export default handler