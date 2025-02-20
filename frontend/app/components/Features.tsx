import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield, UserCheck, FileCheck, Network } from "lucide-react"

const features = [
  {
    title: "Decentralized Identity",
    description: "Empower users with control over their digital identities.",
    icon: UserCheck,
  },
  {
    title: "Verifiable Credentials",
    description: "Issue and verify digital credentials securely and efficiently.",
    icon: FileCheck,
  },
  {
    title: "Privacy-Preserving",
    description: "Protect sensitive health information with advanced cryptography.",
    icon: Shield,
  },
  {
    title: "Interoperable",
    description: "Seamlessly integrate with existing healthcare systems.",
    icon: Network,
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white px-[1.3rem]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

