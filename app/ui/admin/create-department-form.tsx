"use client";

import { Button } from "@/app/ui/button";
import { createDepartment, DepartmentFormState } from "@/app/lib/actions";
import { useActionState, useEffect, useState } from "react";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { DeleteDepartment } from "./buttons";

type Department = {
  id: string;
  name: string;
};

export default function CreateDepartmentForm({
  departments,
}: {
  departments: Department[];
}) {
  const initialState: DepartmentFormState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createDepartment, initialState);
  const [departmentName, setDepartmentName] = useState("");

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <form action={formAction}>
        {/* Department Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Department Name
          </label>
          <div className="relative">
            <BuildingOffice2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter department name"
              aria-describedby="name-error"
            />
          </div>
          {state?.errors?.name && (
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>

        {state?.message && (
          <div aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Button type="submit">Create Department</Button>
        </div>
      </form>

      {/* Existing Departments */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Existing Departments
        </h2>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {departments.length > 0 ? (
            departments.map((dept) => (
              <li key={dept.id} className="flex items-center gap-2">
                <span>{dept.name}</span>
                <DeleteDepartment id={dept.id} />
              </li>
            ))
          ) : (
            <li>No departments found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
