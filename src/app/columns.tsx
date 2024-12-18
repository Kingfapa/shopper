"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getAllPosts, getPostsForLast24Hours } from "@/db/queries/select";
import { GripVertical, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { updatePost } from "@/db/queries/update";
import { cn } from "@/lib/utils";
import { deletePost } from "@/db/queries/delete";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

type cols = Awaited<ReturnType<typeof getAllPosts>>[number];

export const columns: ColumnDef<cols>[] = [
  {
    id: "complete",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={async (value) => {
          let previousValue = row.original.complete;
          try {
            row.toggleSelected(!!value);
            updatePost(row.original.id, {
              title: row.original.title,
              content: row.original.content,
              userId: row.original.userId,
              createdAt: row.original.createdAt,
              updatedAt: row.original.updatedAt,
              complete: !!value,
            });
          } catch (error) {
            console.error("Error updating post", error);
            row.toggleSelected(previousValue);
          }
        }}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div
        className={cn({
          "line-through": row.original.complete,
        })}
      >
        {row.original.title}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 float-right">
              <span className="sr-only">Open menu</span>
              <GripVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(payment.id.toString())
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await deletePost(payment.id);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
