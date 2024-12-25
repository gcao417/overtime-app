import Pagination from "@/app/ui/overtime/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/approval/table";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchOvertimePages } from "@/app/lib/data";
import { auth } from "@/auth";
import {
  AllOvertimes,
  ApprovedOvertimes,
  DeclinedOvertimes,
  PendingOvertimes,
} from "@/app/ui/approval/buttons";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await auth();

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const status = "";

  const totalPages = await fetchOvertimePages(query, "AllUserTimes", status);

  return (
    <div className="w-full">
      {session?.user?.role !== "admin" ? (
        <div className="flex w-full items-center justify-between">
          You do not have access to this page.
        </div>
      ) : (
        <div>
          <div className="flex w-full items-center justify-between">
            <h1 className={`${lusitana.className} text-2xl`}>Approval</h1>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <Search placeholder="Search overtimes..." />
          </div>
          <div className="flex space-x-4 mt-2">
            <PendingOvertimes select={false} />
            <AllOvertimes select={true} />
            <ApprovedOvertimes select={false} />
            <DeclinedOvertimes select={false} />
          </div>
          <Suspense
            key={query + currentPage}
            fallback={<InvoicesTableSkeleton />}
          >
            <Table
              query={query}
              currentPage={currentPage}
              userID="AllUserTimes"
              status={status}
            />
          </Suspense>
          <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      )}
    </div>
  );
}
