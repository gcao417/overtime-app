import {
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { confirmOvertime, declineOvertime } from "@/app/lib/actions";
import Link from "next/link";

export function PendingOvertimes({ select }: { select: boolean }) {
  return select ? (
    <div className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors">
      <ClockIcon className="h-5 md:mr-3" />
      <span className="hidden md:block">Pending Overtimes</span>
    </div>
  ) : (
    <Link
      href="/dashboard/approval/pending"
      className="flex h-10 items-center rounded-lg bg-gray-300 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <ClockIcon className="h-5 md:mr-3" />
      <span className="hidden md:block">Pending Overtimes</span>{" "}
    </Link>
  );
}

export function AllOvertimes({ select }: { select: boolean }) {
  return select ? (
    <div className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors">
      <Squares2X2Icon className="h-5 md:mr-3" />
      <span className="hidden md:block">All Overtimes</span>{" "}
    </div>
  ) : (
    <Link
      href="/dashboard/approval/all"
      className="flex h-10 items-center rounded-lg bg-gray-300 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <Squares2X2Icon className="h-5 md:mr-3" />
      <span className="hidden md:block">All Overtimes</span>{" "}
    </Link>
  );
}

export function ApprovedOvertimes({ select }: { select: boolean }) {
  return select ? (
    <div className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors">
      <CheckIcon className="h-5 md:mr-3" />
      <span className="hidden md:block">Approved Overtimes</span>{" "}
    </div>
  ) : (
    <Link
      href="/dashboard/approval/confirmed"
      className="flex h-10 items-center rounded-lg bg-gray-300 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <CheckIcon className="h-5 md:mr-3" />
      <span className="hidden md:block">Approved Overtimes</span>{" "}
    </Link>
  );
}

export function DeclinedOvertimes({ select }: { select: boolean }) {
  return select ? (
    <div className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors">
      <XMarkIcon className="h-5 md:mr-3" />
      <span className="hidden md:block">Declined Overtimes</span>{" "}
    </div>
  ) : (
    <Link
      href="/dashboard/approval/declined"
      className="flex h-10 items-center rounded-lg bg-gray-300 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <XMarkIcon className="h-5 md:mr-3" />
      <span className="hidden md:block">Declined Overtimes</span>{" "}
    </Link>
  );
}

export function ConfirmOvertime({
  id,
  status,
  approverID,
}: {
  id: string;
  status: string;
  approverID: string;
}) {
  const confirmOvertimeWithId = confirmOvertime.bind(null, id, approverID);
  switch (status) {
    case "confirmed":
      return (
        <div className="rounded-md border p-2 bg-green-100">
          <span className="sr-only">Confirm</span>
          <CheckIcon className="w-5" />
        </div>
      );
    case "declined":
      return (
        <div className="rounded-md border p-2">
          <span className="sr-only">Confirm</span>
          <CheckIcon className="w-5" />
        </div>
      );
    default:
      return (
        <form action={confirmOvertimeWithId}>
          <button className="rounded-md border p-2 hover:bg-green-300">
            <span className="sr-only">Confirm</span>
            <CheckIcon className="w-5" />
          </button>
        </form>
      );
  }
}

export function DeclineOvertime({
  id,
  status,
  approverID,
}: {
  id: string;
  status: string;
  approverID: string;
}) {
  const declineOvertimeWithId = declineOvertime.bind(null, id, approverID);
  switch (status) {
    case "confirmed":
      return (
        <div className="rounded-md border p-2">
          <span className="sr-only">Delete</span>
          <XMarkIcon className="w-5" />
        </div>
      );
    case "declined":
      return (
        <div className="rounded-md border p-2 bg-red-100">
          <span className="sr-only">Delete</span>
          <XMarkIcon className="w-5" />
        </div>
      );
    default:
      return (
        <form action={declineOvertimeWithId}>
          <button className="rounded-md border p-2 hover:bg-red-300">
            <span className="sr-only">Delete</span>
            <XMarkIcon className="w-5" />
          </button>
        </form>
      );
  }
}
