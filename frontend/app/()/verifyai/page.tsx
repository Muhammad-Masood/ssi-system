import { MedicalLicenseVerification } from "@/app/components/MedicalLicenseVerification";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 md:text-4xl">
          Medical License AI Verification Portal
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Upload and verify medical licenses with our secure verification system
        </p>
        <MedicalLicenseVerification />
      </div>
    </main>
  );
}
