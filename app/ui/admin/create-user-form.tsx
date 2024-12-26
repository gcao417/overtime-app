"use client";

import { Button } from "@/app/ui/button";
import { createUser, UserFormState } from "@/app/lib/actions";
import { useActionState } from "react";
import { useState } from "react";
import {
  UserIcon,
  AtSymbolIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function CreateUserForm() {
  const initialState: UserFormState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createUser, initialState);

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as const,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Username */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Username
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              value={formValues.name}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter your username"
              aria-describedby="name-error"
            />
          </div>
          {state?.errors?.name && (
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <AtSymbolIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter your email"
              aria-describedby="email-error"
            />
          </div>
          {state?.errors?.email && (
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter your password"
              aria-describedby="password-error"
            />
          </div>
          {state?.errors?.password && (
            <div id="password-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.password.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Role */}
        <div className="mb-4">
          <label htmlFor="role" className="mb-2 block text-sm font-medium">
            Role
          </label>
          <div className="relative">
            <ShieldCheckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              id="role"
              name="role"
              value={formValues.role}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="role-error"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {state?.errors?.role && (
            <div id="role-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.role.map((error: string) => (
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
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button type="submit">Create User</Button>
      </div>
    </form>
  );
}
