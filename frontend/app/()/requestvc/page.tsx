import { RequestForm } from "@/app/components/request-form";
import { Steps } from "@/app/components/steps";


export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Request Verifiable Credentials</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Complete the form below to request your verifiable credentials
          </p>
        </div>
        <Steps />
        <RequestForm />
      </div>
    </div>
  )
}

