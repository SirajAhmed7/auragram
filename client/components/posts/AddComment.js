"use client";

import { addCommentAction } from "@/lib/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
// import { useActionState } from "react";

function AddComment({ postId, avatar, fullName }) {
  const [state, formAction] = useActionState(
    addCommentAction.bind(null, postId),
    postId
  );
  // const formAction = addCommentAction.bind(null, postId);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      // Update user context with the returned user data
      // Redirect to home
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="flex items-center gap-4 z-10 relative">
      <Image
        src={avatar || "/images/default-avatar.jpg"}
        alt={fullName}
        width={32}
        height={32}
        className="rounded-full"
      />

      <form className="basis-full" action={formAction}>
        <input
          type="text"
          id="content"
          name="content"
          placeholder="Add a comment..."
          className="px-3 py-2 placeholder:text-slate-400 border-b border-slate-200 w-full outline-none focus:border-slate-500 active:border-slate-500"
        />
      </form>
    </div>
  );
}

export default AddComment;
