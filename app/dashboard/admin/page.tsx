import Table from "@/app/ui/admin/table";
import { lusitana } from "@/app/ui/fonts";
import { fetchDepartments, fetchUsers } from "@/app/lib/data";
import { auth } from "@/auth";
import UserForm from "@/app/ui/admin/create-user-form";
import DepartmentForm from "@/app/ui/admin/create-department-form";

export default async function Page() {
  const session = await auth();

  const [users] = await Promise.all([fetchUsers()]);

  const otherUsers = users.filter((user) =>
    user?.id !== session?.user?.id ? session?.user?.id : ""
  );

  const [departments] = await Promise.all([fetchDepartments()]);

  return (
    <div className="w-full">
      {session?.user?.role !== "admin" ? (
        <div className="flex w-full items-center justify-between">
          You do not have access to this page.
        </div>
      ) : (
        <div>
          <div className="flex w-full items-center justify-between">
            <h1 className={`${lusitana.className} text-2xl`}>Admin</h1>
          </div>
          <div className="md:mt-8">Create User</div>
          <UserForm />
          <div className="md:mt-8">Departments</div>
          <DepartmentForm departments={departments} />
          <div className="md:mt-8">Edit Users</div>
          <Table otherUsers={otherUsers} departments={departments} />
        </div>
      )}
    </div>
  );
}
