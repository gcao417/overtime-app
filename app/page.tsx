import CTSLogo from "@/app/ui/cts-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex shrink-0 items-end rounded-lg bg-red-500 p-4 md:h-36">
        <CTSLogo />
      </div>
      <div className="flex flex-col justify-center gap-6 rounded-lg px-6 py-10 md:w-dvw">
        <Link
          href="/login"
          className="flex items-center gap-5 self-start rounded-lg bg-red-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-400 md:text-base"
        >
          <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
        </Link>
      </div>
    </main>
  );
}
