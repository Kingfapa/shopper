"use server";

import { db } from "../index";
import { InsertPost, InsertUser, postsTable, usersTable } from "../schema";
import { revalidatePath } from "next/cache";

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
  revalidatePath("/");
}
