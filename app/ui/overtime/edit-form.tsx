"use client";

import { OvertimeForm } from "@/app/lib/definitions";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateOvertime, State } from "@/app/lib/actions";
import { useActionState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function EditOvertimeForm({
  overtime,
}: {
  overtime: OvertimeForm;
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
  const [overtimeType, setOvertimeType] = useState<string>("Regular");

  useEffect(() => {
    if (overtime) {
      const startDate = new Date(overtime.start_time);
      const endDate = new Date(overtime.end_time);

      setSelectedDate(startDate);

      const startHours = startDate.getHours().toString().padStart(2, "0");
      const startMinutes = startDate.getMinutes().toString().padStart(2, "0");
      setStartTime(`${startHours}:${startMinutes}`);

      const endHours = endDate.getHours().toString().padStart(2, "0");
      const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
      setEndTime(`${endHours}:${endMinutes}`);

      setOvertimeType(overtime?.type || "Regular");
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

  const handleOvertimeTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setOvertimeType(e.target.value);
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-CA")
    : "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields remain unchanged */}
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
            {state.errors?.startTime &&
              state.errors.startTime.map((error: string) => (
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
            {state.errors?.endTime &&
              state.errors.endTime.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Overtime Type */}
        <div className="mb-4">
          <label
            htmlFor="overtime-type"
            className="mb-2 block text-sm font-medium"
          >
            Overtime Type
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="overtime-type"
              name="overtimeType"
              value={overtimeType}
              onChange={handleOvertimeTypeChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Regular">Regular</option>
              <option value="Weekend">Weekend</option>
              <option value="Public Holiday">Public Holiday</option>
            </select>
          </div>

          {state.errors?.overtimeType && (
            <p className="mt-2 text-sm text-red-500">
              {state.errors.overtimeType[0]}
            </p>
          )}
        </div>

        {/* Message */}
        <div aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
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
