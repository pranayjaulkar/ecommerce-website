import { UserButton, auth } from "@clerk/nextjs";
import StoreSwitcher from "@/components/Navbar/StoreSwitcher";
import MainNav from "@/components/Navbar/MainNav";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
export default async function Navbar() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
