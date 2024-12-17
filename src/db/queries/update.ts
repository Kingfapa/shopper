"use server";

import { revalidatePath } from "next/cache";
import { db } from "..";
import { InsertPost, postsTable } from "../schema";
import { eq } from "drizzle-orm";

export async function updatePost(data: InsertPost) {
  console.log("updatePost", data);
  if (data.id !== undefined) {
    await db.update(postsTable).set(data).where(eq(postsTable.id, data.id));
    revalidatePath("/");
  } else {
    throw new Error("Post ID is undefined");
  }
}
