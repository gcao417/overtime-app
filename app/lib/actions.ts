"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";

const FormSchema = z.object({
  userId: z.string({
    invalid_type_error: "User ID is required.",
  }),
  date: z.string({
    invalid_type_error: "Please select a date.",
  }),
  startTime: z.string({
    invalid_type_error: "Please select a start time.",
  }),
  endTime: z.string({
    invalid_type_error: "Please select an end time.",
  }),
});

const UserFormSchema = z.object({
  name: z.string().min(2, "Username must be 2 or more characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be 6 or more characters long"),
  role: z.enum(["user", "admin"]),
});

export type UserFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
  message?: string | null;
};

export type State = {
  errors?: {
    userId?: string[];
    date?: string[];
    startTime?: string[];
    endTime?: string[];
  };
  message?: string | null;
};

export async function createOvertime(prevState: State, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    userId: formData.get("userId") ? formData.get("userId") : 0,
    date: formData.get("date") ? formData.get("date") : 0,
    startTime: formData.get("startTime") ? formData.get("startTime") : 0,
    endTime: formData.get("endTime") ? formData.get("endTime") : 0,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Overtime.",
    };
  }

  const { userId, date, startTime, endTime } = validatedFields.data;

  const startMinutes =
    parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
  const endMinutes =
    parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

  if (startMinutes > endMinutes || startMinutes == endMinutes) {
    return {
      message: "End Time Must Be Greater Than Start Time.",
    };
  }

  const startDateTime = `${date} ${startTime}`;
  const endDateTime = `${date} ${endTime}`;

  try {
    await sql`
    INSERT INTO overtime (user_id, start_time, end_time)
    VALUES (${userId}, ${startDateTime}, ${endDateTime})
    `;
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to Create Overtime.",
    };
  }

  revalidatePath("/dashboard/overtime");
  redirect("/dashboard/overtime");
}

const UpdateOvertime = z.object({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export async function updateOvertime(
  id: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = UpdateOvertime.safeParse({
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Overtime.",
    };
  }

  const { date, startTime, endTime } = validatedFields.data;

  const startMinutes =
    parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
  const endMinutes =
    parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

  if (startMinutes >= endMinutes) {
    return {
      message: "End Time Must Be Greater Than Start Time.",
    };
  }

  const startDateTime = `${date} ${startTime}`;
  const endDateTime = `${date} ${endTime}`;

  try {
    await sql`
      UPDATE overtime
      SET start_time = ${startDateTime}, end_time = ${endDateTime}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Error updating overtime:", error);
    return {
      message: "Database Error: Failed to Update Overtime.",
    };
  }

  revalidatePath("/dashboard/overtime");
  redirect("/dashboard/overtime");
}

export async function deleteOvertime(id: string) {
  try {
    await sql`DELETE FROM overtime WHERE id = ${id}`;
    revalidatePath("/dashboard/overtime");
    return { message: "Deleted Overtime." };
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to Delete Overtime.",
    };
  }
}

export async function confirmOvertime(id: string) {
  try {
    await sql`UPDATE overtime SET status = 'confirmed' WHERE id = ${id}`;
    revalidatePath("/dashboard/approval");
    return { message: "Confirmed Overtime." };
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to Confirm Overtime.",
    };
  }
}

export async function declineOvertime(id: string) {
  try {
    await sql`UPDATE overtime SET status = 'declined' WHERE id = ${id}`;
    revalidatePath("/dashboard/approval");
    return { message: "Declined Overtime." };
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to Decline Overtime.",
    };
  }
}

export async function createUser(
  prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const validatedFields = UserFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }

  const { name, email, password, role } = validatedFields.data;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await sql`
    INSERT INTO users (id, name, email, password, role)
    VALUES (gen_random_uuid(), ${name}, ${email}, ${hashedPassword}, ${role});
    `;
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error?.code === "23505") {
      return {
        errors: {
          email: ["This email is already taken. Please choose another one."],
        },
      };
    }
    return {
      message: "Database Error: Failed to Create User.",
    };
  }

  revalidatePath("/dashboard/admin");
  // redirect("/dashboard/admin");

  return { message: "Success" };
}

export async function toggleUserRole(id: string, role: string) {
  try {
    if (role === "user") {
      await sql`UPDATE users
    SET role = 'admin'
    WHERE id = ${id}`;
    } else {
      await sql`UPDATE users
      SET role = 'user'
      WHERE id = ${id}`;
    }

    revalidatePath("/dashboard/admin");
    return { message: "Updated User Role." };
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to Update User Role.",
    };
  }
}

export async function deleteUser(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath("/dashboard/admin");
    return { message: "Deleted User." };
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to Delete User.",
    };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
