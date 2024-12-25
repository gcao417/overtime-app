import { CreateOvertimeForm } from "@/app/ui/overtime/create-form";
import Breadcrumbs from "@/app/ui/overtime/breadcrumbs";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CreateOvertimePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Overtime", href: "/dashboard/overtime" },
          {
            label: "Add Overtime",
            href: "/dashboard/overtime/create",
            active: true,
          },
        ]}
      />
      <CreateOvertimeForm userId={session.user.id!} />
    </main>
  );
}
