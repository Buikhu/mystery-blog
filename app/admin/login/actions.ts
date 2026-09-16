"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createAdminSession } from "@/lib/auth";

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password")?.toString();

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!password) {
    throw new Error("Password is required.");
  }

  if (!passwordHash) {
    throw new Error(
      "ADMIN_PASSWORD_HASH is not configured."
    );
  }

  const isValid = await bcrypt.compare(
    password,
    passwordHash
  );

  if (!isValid) {
    throw new Error("Invalid password.");
  }

  await createAdminSession();

  redirect("/admin");
}