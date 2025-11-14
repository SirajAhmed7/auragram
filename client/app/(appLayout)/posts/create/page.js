"use client";

import UserDisplay from "@/components/posts/UserDisplay";
import SubmitButton from "@/components/ui/SubmitButton";
import { useUser } from "@/contexts/UserContext";
import { createPostAction } from "@/lib/actions";
import { useActionState } from "react";

function Page() {
  const { user } = useUser();
  // eslint-disable-next-line no-unused-vars
  const [_, formAction] = useActionState(createPostAction, null);

  return (
    <div className="w-full">
      <div className="w-full max-w-3xl mx-auto">
        <div className="w-full bg-white border border-slate-200 p-4 space-y-4 rounded-2xl relative">
          <UserDisplay user={user} />

          <form action={formAction}>
            <label
              htmlFor="content"
              className="text-base font-semibold text-slate-600 mb-1 block"
            >
              What&apos;s on your mind?
            </label>
            <textarea
              name="content"
              placeholder="Write a post..."
              rows={5}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-slate-400"
            />
            <SubmitButton text={"Post"} loadingText={"Posting..."} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
