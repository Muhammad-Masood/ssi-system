import { CheckCircle2, Clock, HelpCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Request Submitted",
    description: "Your request has been received",
    status: "complete",
    icon: CheckCircle2,
  },
  {
    title: "Document Verification",
    description: "We're reviewing your documents",
    status: "current",
    icon: Clock,
  },
  {
    title: "Credential Issuance",
    description: "Your credentials will be issued upon approval",
    status: "waiting",
    icon: HelpCircle,
  },
]

export function RequestStatus() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Request Status</h3>
        <p className="text-sm text-muted-foreground">Track the status of your credential request</p>
      </div>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.title} className="flex gap-4">
            <div
              className={cn("relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full", {
                "bg-primary text-primary-foreground": step.status === "complete",
                "bg-primary/25 text-primary": step.status === "current",
                "bg-muted text-muted-foreground": step.status === "waiting",
              })}
            >
              <step.icon className="h-4 w-4" />
              {index < steps.length - 1 && (
                <div
                  className={cn("absolute left-1/2 top-8 h-12 w-[2px]", {
                    "bg-primary": step.status === "complete",
                    "bg-muted": step.status !== "complete",
                  })}
                />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="font-medium leading-none">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

