import Pagination from "@/app/ui/overtime/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/overtime/table";
import { CreateOvertime } from "@/app/ui/overtime/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchOvertimePages } from "@/app/lib/data";
import { auth } from "@/auth";

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

  const totalPages = await fetchOvertimePages(query, session?.user?.id!, "");

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Overtime</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search overtimes..." />
        <CreateOvertime />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table
          query={query}
          currentPage={currentPage}
          userID={session?.user?.id!}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
