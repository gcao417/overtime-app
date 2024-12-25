import Form from "@/app/ui/overtime/edit-form";
import Breadcrumbs from "@/app/ui/overtime/breadcrumbs";
import { fetchOvertimeById, fetchUsers } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [overtime, users] = await Promise.all([
    fetchOvertimeById(id),
    fetchUsers(),
  ]);

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
      <Form overtime={overtime} users={users} />
    </main>
  );
}
