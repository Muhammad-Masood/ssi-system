import { getSession } from "@/auth";
import { setupUserWallet } from "../server";
import { Header } from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import { NextResponse } from "next/server";

// export async function middleware(request: Request) {
//   const url = new URL(request.url);
//   const searchParams = url.searchParams;
//   return NextResponse.rewrite(
//     new URL(`/?tab=${searchParams.get("tab")}`, request.url)
//   );
// }

export default async function Home({
  searchParams,
}: {
  searchParams: { tab: string };
}) {
  const tab = searchParams.tab || "default";
  const session = await getSession();
  if (session) setupUserWallet(tab);

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
