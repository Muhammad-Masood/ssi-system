import { Button } from "@/components/ui/button";
import Image from "next/image";
import ssi from "@/public/ssi.jpg";

export default function Hero() {
  return (
    <section className="bg-blue-50 py-20 px-[1.3rem]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Self Sovereign Identity for Healthcare
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Empower patients and healthcare providers with secure, decentralized
            identity management and verifiable credentials.
          </p>
          <div className="space-x-4">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <Image
            src={ssi}
            alt="Healthcare professionals using digital identities"
            width={400}
            height={400}
            className="w-full h-auto pl-8"
          />
        </div>
      </div>
    </section>
  );
}
