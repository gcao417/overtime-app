import {
  CheckIcon,
  ClockIcon,
  XMarkIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { fetchCardData } from "@/app/lib/data";
import { auth } from "@/auth";

const iconMap = {
  all: Squares2X2Icon,
  pending: ClockIcon,
  confirmed: CheckIcon,
  declined: XMarkIcon,
};

export default async function CardWrapper() {
  const session = await auth();
  const userID = session?.user?.id ? session?.user?.id : "";

  const {
    numberOfOvertimes,
    numberOfPendingOvertimes,
    numberOfConfirmedOvertimes,
    numberOfDeclinedOvertimes,
  } = await fetchCardData(userID);

  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card title="Number of Overtimes" value={numberOfOvertimes} type="all" />
      <Card
        title="Pending Overtimes"
        value={numberOfPendingOvertimes}
        type="pending"
      />
      <Card
        title="Confirmed Overtimes"
        value={numberOfConfirmedOvertimes}
        type="confirmed"
      />
      <Card
        title="Declined Overtimes"
        value={numberOfDeclinedOvertimes}
        type="declined"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "all" | "pending" | "confirmed" | "declined";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
