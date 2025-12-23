import { Suspense } from "react"
import CallEndedClient from "@/components/call-ended-client"

export default function CallEndedPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <CallEndedClient />
    </Suspense>
  )
}