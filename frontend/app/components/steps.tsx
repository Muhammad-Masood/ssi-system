import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, FileText, Send, UserCheck } from "lucide-react"

const steps = [
  {
    title: "Enter Your DID",
    description: "Provide your Decentralized Identifier",
    icon: UserCheck,
  },
  {
    title: "Select Credential Type",
    description: "Choose the type of credential you need",
    icon: FileText,
  },
  {
    title: "Upload Documents",
    description: "Submit supporting documentation",
    icon: FileCheck,
  },
  {
    title: "Submit Request",
    description: "Review and submit your application",
    icon: Send,
  },
]

export function Steps() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How It Works</CardTitle>
        <CardDescription>Follow these steps to request your verifiable credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-medium">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="absolute left-[50%] top-6 hidden h-[2px] w-full bg-muted md:block" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

