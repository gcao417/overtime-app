import { ConfirmOvertime, DeclineOvertime } from "@/app/ui/approval/buttons";
import OvertimeStatus from "@/app/ui/overtime/status";
import {
  formatHours,
  formatDateToLocal,
  calculateTimeDifferenceInHours,
} from "@/app/lib/utils";
import { fetchFilteredOvertimes } from "@/app/lib/data";
import { auth } from "@/auth";

export default async function OvertimesTable({
  query,
  currentPage,
  userID,
  status,
}: {
  query: string;
  currentPage: number;
  userID: string;
  status: string;
}) {
  const overtimes = await fetchFilteredOvertimes(
    query,
    currentPage,
    userID,
    status
  );

  const session = await auth();
  const approverID = session?.user?.id;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {overtimes?.map((overtime) => (
              <div
                key={overtime?.id.toString()}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{overtime?.username}</p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>
                        {overtime?.department
                          ? overtime?.department
                          : "Default"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{overtime?.type ? overtime?.type : "Regular"}</p>
                    </div>
                  </div>
                  <OvertimeStatus status={overtime?.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="hidden md:block">
                      {formatDateToLocal(overtime?.creation_timestamp)}
                    </p>
                    <p>{formatDateToLocal(overtime?.start_time)}</p>
                    <p>{formatDateToLocal(overtime?.end_time)}</p>
                    <p>
                      {formatHours(
                        calculateTimeDifferenceInHours(
                          overtime?.start_time,
                          overtime?.end_time
                        )
                      )}
                      <span className="md:hidden"> hour</span>{" "}
                      {/* 'hour' will only be visible on small screens */}
                    </p>
                  </div>
                  <div>
                    <p>{overtime?.approver_username}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ConfirmOvertime
                      id={overtime?.id.toString()}
                      status={overtime?.status}
                    />
                    <DeclineOvertime
                      id={overtime?.id.toString()}
                      status={overtime?.status}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  User
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Department
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Created at
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Type
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Start Time
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  End Time
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Hours
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Approved / Declined by
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {overtimes?.map((overtime) => (
                <tr
                  key={overtime?.id.toString()}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{overtime?.username}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>
                        {overtime?.department
                          ? overtime?.department
                          : "Default"}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(overtime?.creation_timestamp)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{overtime?.type ? overtime?.type : "Regular"}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <OvertimeStatus status={overtime?.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(overtime?.start_time)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(overtime?.end_time)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatHours(
                      calculateTimeDifferenceInHours(
                        overtime?.start_time,
                        overtime?.end_time
                      )
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{overtime?.approver_username}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ConfirmOvertime
                        id={overtime?.id.toString()}
                        status={overtime?.status}
                        approverID={approverID}
                      />
                      <DeclineOvertime
                        id={overtime?.id.toString()}
                        status={overtime?.status}
                        approverID={approverID}
                      />
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
