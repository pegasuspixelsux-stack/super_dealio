import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Storefront } from "@/components/Storefront";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { type } = await searchParams;
  const initialType = typeof type === "string" ? type : "";

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* key resets the filters when a category link changes ?type= */}
        <Storefront key={initialType} initialType={initialType} />
      </main>
      <Footer />
    </>
  );
}
