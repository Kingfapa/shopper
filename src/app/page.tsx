import { Button } from "@/components/ui/button";
import { createPost, createUser } from "@/db/queries/insert";
import { getAllPosts } from "@/db/queries/select";
import Image from "next/image";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Home() {
  const allPosts = await getAllPosts();
  async function addPost() {
    "use server";
    await createPost({
      title: "Hello, World!",
      content: "Welcome to your new blog.",
      userId: 1,
    });
  }
  async function addUser() {
    "use server";
    await createUser({
      name: "John Doe",
      age: 30,
      email: "addepadde@gmail.com ",
    });
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Welcome to your new blog!</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={addPost}>
            Add Post
          </Button>
          <Button variant="outline" onClick={addUser}>
            Add User
          </Button>
        </div>
        <DataTable columns={columns} data={allPosts} />
      </main>
    </div>
  );
}
