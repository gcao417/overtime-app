"use client";

import {
  UserGroupIcon,
  HomeIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Overtimes",
    href: "/dashboard/overtime",
    icon: ClockIcon,
  },
  {
    name: "Approval",
    href: "/dashboard/approval",
    icon: CheckCircleIcon,
  },
  {
    name: "Admin Access",
    href: "/dashboard/admin",
    icon: UserGroupIcon,
  },
];

export default function NavLinks({ type }: { type: string }) {
  const pathname = usePathname();

  const filteredLinks =
    type === "admin"
      ? links
      : links.filter(
          (link) => link.name !== "Approval" && link.name !== "Admin Access"
        );

  return (
    <>
      {filteredLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
