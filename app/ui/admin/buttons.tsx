import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { deleteUser, toggleUserRole } from "@/app/lib/actions";

export function ToggleUserRole({ id, role }: { id: string; role: string }) {
  const toggleUserRoleWithId = toggleUserRole.bind(null, id, role);
  return (
    <form action={toggleUserRoleWithId}>
      <button
        className={`rounded-md border p-2 hover:bg-red-100 flex items-center ${
          role === "user" ? "bg-red-300" : ""
        }`}
      >
        <span className="sr-only">Toggle</span>
        <ArrowPathIcon className="w-5 mr-2" />
        {role === "user" ? (
          <div>Update to Admin</div>
        ) : (
          <div>Update to User</div>
        )}
      </button>
    </form>
  );
}

export function DeleteUser({ id }: { id: string }) {
  const deleteUserWithId = deleteUser.bind(null, id);
  return (
    <form action={deleteUserWithId}>
      <button className="rounded-md border p-2 hover:bg-red-300">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
