"use client";

import { UserField, OvertimeForm } from "@/app/lib/definitions";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateOvertime, State } from "@/app/lib/actions";
import { useActionState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function EditOvertimeForm({
  overtime,
  users,
}: {
  overtime: OvertimeForm;
  users: UserField[];
}) {
  const initialState: State = { message: null, errors: {} };
  const updateOvertimeWithId = updateOvertime.bind(null, overtime.id);
  const [state, formAction] = useActionState(
    updateOvertimeWithId,
    initialState
  );

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  useEffect(() => {
    if (overtime) {
      // Assuming overtime.start_time and overtime.end_time are Date objects or strings that can be converted into Date objects
      const startDate = new Date(overtime.start_time);
      const endDate = new Date(overtime.end_time);

      // Set the date (date part only, without time)
      setSelectedDate(startDate);

      // Extract start time (hours and minutes)
      const startHours = startDate.getHours().toString().padStart(2, "0"); // Format hours (e.g. "08")
      const startMinutes = startDate.getMinutes().toString().padStart(2, "0"); // Format minutes (e.g. "53")
      setStartTime(`${startHours}:${startMinutes}`); // Format time (e.g. "08:53")

      // Extract end time (hours and minutes)
      const endHours = endDate.getHours().toString().padStart(2, "0"); // Format hours (e.g. "08")
      const endMinutes = endDate.getMinutes().toString().padStart(2, "0"); // Format minutes (e.g. "53")
      setEndTime(`${endHours}:${endMinutes}`); // Format time (e.g. "08:53")
    }
  }, [overtime]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-CA")
    : "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a new FormData object from the form element
    const formData = new FormData(event.target as HTMLFormElement);

    // Call formAction (assuming it's already defined)
    formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Date */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose a date
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <Card className="pt-2 overflow-hidden">
                <CardContent className="flex justify-center items-center p-6">
                  <div className="border rounded-md w-full max-w-[350px] flex justify-center items-center">
                    <Calendar
                      mode="single"
                      className="rounded-md"
                      selected={selectedDate}
                      onDayClick={handleDateChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.date &&
              state.errors.date.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Start Time */}
        <div className="mb-4">
          <label
            htmlFor="start-time"
            className="mb-2 block text-sm font-medium"
          >
            Choose a start time
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="start-time"
              name="startTime"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </div>

          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.start_time &&
              state.errors.start_time.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* End Time */}
        <div className="mb-4">
          <label htmlFor="end-time" className="mb-2 block text-sm font-medium">
            Choose an end time
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="end-time"
              name="endTime"
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
            />
          </div>

          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.end_time &&
              state.errors.end_time.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Message */}
        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/overtime"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Overtime</Button>
      </div>

      <input type="hidden" name="date" value={formattedDate} />
    </form>
  );
}
