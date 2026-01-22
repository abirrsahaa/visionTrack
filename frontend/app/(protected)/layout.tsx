import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { prisma } from "@/lib/prisma";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // 1. Fast Check: Clerk Metadata
  const onboardingCompleted = user.publicMetadata?.onboardingCompleted;

  if (!onboardingCompleted) {
    // 2. Deep Check: Database Source of Truth
    // This handles the race condition where Clerk metadata hasn't propagated yet
    // but the DB write in server action was successful.
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail) {
      const dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true }
      });

      if (!dbUser) {
        redirect("/onboarding");
      }
      // If dbUser exists, they are onboarded. Allow access.
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
