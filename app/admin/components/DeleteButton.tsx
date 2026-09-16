"use client";

import { useState } from "react";
import { deletePost } from "../posts/actions";

type DeleteButtonProps = {
  postId: number;
};

export default function DeleteButton({
  postId,
}: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <form action={deletePost}>
          <input
            type="hidden"
            name="id"
            value={postId}
          />

          <button
            type="submit"
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Confirm
          </button>
        </form>

        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          className="text-sm font-medium text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className="text-sm font-medium text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}