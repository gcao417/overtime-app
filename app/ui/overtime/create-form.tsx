"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createOvertime, State } from "@/app/lib/actions";
import { useActionState } from "react";
import Link from "next/link";
import { useState } from "react";

export function CreateOvertimeForm({ userId }: { userId: string }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createOvertime, initialState);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [overtimeType, setOvertimeType] = useState<string>("Regular");

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
    setOvertimeType(e.target.value); // Update overtime type state
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-CA")
    : "";

  const handleSubmit = (formData: FormData) => {
    formData.append("userId", userId);
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="max-w-md mt-8">
      <div className="space-y-4">
        <div>
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

          {state.errors?.date && (
            <p className="text-sm text-red-500">{state.errors.date[0]}</p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              name="startTime"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              // required
            />

            {state.errors?.startTime && (
              <p className="text-sm text-red-500">
                {state.errors.startTime[0]}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              name="endTime"
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              // required
            />

            {state.errors?.endTime && (
              <p className="text-sm text-red-500">{state.errors.endTime[0]}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="overtime-type">Overtime Type</Label>
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

          {state.errors?.overtimeType && (
            <p className="text-sm text-red-500">
              {state.errors.overtimeType[0]}
            </p>
          )}
        </div>

        {state.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/overtime"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Add Overtime</Button>
        </div>
      </div>

      <input type="hidden" name="date" value={formattedDate} />
    </form>
  );
}
