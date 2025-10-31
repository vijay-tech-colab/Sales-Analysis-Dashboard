import { AlertCircle } from "lucide-react"

export function FormMessage({ message }: { message?: string }) {
  if (!message) return null

  return (
    <p className="flex items-center gap-1 text-sm text-destructive mt-1">
      <AlertCircle className="h-4 w-4" />
      {message}
    </p>
  )
}
