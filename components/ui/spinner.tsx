import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("h-full w-auto animate-spin flex items-center justify-center", className)}
      {...props}
    />
  )
}

export { Spinner }
