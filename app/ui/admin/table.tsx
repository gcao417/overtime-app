import { DeleteUser, ToggleUserRole } from "@/app/ui/admin/buttons";

export default function UsersTable({ otherUsers }: { otherUsers: any[] }) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden">
            {otherUsers?.map((user) => (
              <div
                key={user.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      {/* Truncate Name */}
                      <p className="truncate max-w-xs">{user.name}</p>
                    </div>
                    {/* Truncate Email */}
                    <p className="truncate max-w-xs">{user.email}</p>
                    <div className="flex items-center gap-4">
                      {" "}
                      {/* Increased gap */}
                      <p>{user.role}</p>
                      <ToggleUserRole id={user.id} role={user.role} />
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <DeleteUser id={user.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View (Table) */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  User
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Role
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {otherUsers?.map((user) => (
                <tr
                  key={user.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {/* Truncate Name */}
                      <p className="truncate max-w-xs">{user.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* Truncate Email */}
                    <p className="truncate max-w-xs">{user.email}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-4">
                      {" "}
                      {/* Increased gap */}
                      <p>{user.role}</p>
                      <ToggleUserRole id={user.id} role={user.role} />
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <DeleteUser id={user.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
