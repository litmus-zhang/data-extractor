import { Intro } from "@/components/intro";
import "@/styles/style.css";
import { Button } from "./ui/button";
import { PropertyDetails } from "./PropertyDetails";
import { useState } from "react";
import { FolderArchive } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "./ui/empty";

export function App() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  console.log({ data })
  const analyzePage = () => {
    console.log("analyse page")
  }

  return (
    <div className="flex justify-center items-center w-full h-full rounded-xl">
      <Intro />
    </div>
  );
}
