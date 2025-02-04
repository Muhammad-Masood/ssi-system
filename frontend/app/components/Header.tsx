import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SSI Health
        </Link>
        <div className="space-x-4">
          <Link href="#features" className="text-gray-600 hover:text-blue-600">
            Features
          </Link>
          <Link href="#about" className="text-gray-600 hover:text-blue-600">
            About
          </Link>
          <Button variant="outline">Login</Button>
          <Button>Get Started</Button>
        </div>
      </nav>
    </header>
  )
}

