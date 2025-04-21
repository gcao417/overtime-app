import {
  MyCardWrapper,
  MonthlyCardWrapper,
  YearlyCardWrapper,
} from "@/app/ui/dashboard/cards";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import { CardsSkeleton } from "@/app/ui/skeletons";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div>My Overtime</div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <MyCardWrapper />
        </Suspense>
      </div>
      {session?.user?.role === "admin" ? (
        <>
          <div className="pt-6">Monthly Overtime</div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<CardsSkeleton />}>
              <MonthlyCardWrapper />
            </Suspense>
          </div>
          <div className="pt-6">Yearly Overtime</div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<CardsSkeleton />}>
              <YearlyCardWrapper />
            </Suspense>
          </div>
        </>
      ) : (
        <></>
      )}
      {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div> */}
    </main>
  );
}
