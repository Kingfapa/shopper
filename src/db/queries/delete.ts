"use server";

import { eq } from "drizzle-orm";
import { db } from "../index";
import { postsTable, SelectUser, usersTable } from "../schema";
import { revalidatePath } from "next/cache";

export async function deleteUser(id: SelectUser["id"]) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}

export async function deletePost(id: number) {
  await db.delete(postsTable).where(eq(postsTable.id, id));
  revalidatePath("/");
}
