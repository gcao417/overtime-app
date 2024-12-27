import Form from "@/app/ui/overtime/edit-form";
import Breadcrumbs from "@/app/ui/overtime/breadcrumbs";
import { fetchOvertimeById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();

  const id = params.id;
  const [overtime] = await Promise.all([fetchOvertimeById(id)]);

  if (!overtime) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Overtime", href: "/dashboard/overtime" },
          {
            label: "Edit Overtime",
            href: `/dashboard/overtime/${id}/edit`,
            active: true,
          },
        ]}
      />
      {session?.user?.id === overtime?.user_id &&
      overtime?.status === "pending" ? (
        <Form overtime={overtime} />
      ) : (
        <div>You cannot edit this overtime</div>
      )}
    </main>
  );
}
