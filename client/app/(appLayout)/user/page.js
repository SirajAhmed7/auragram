"use client";

import LogoutButton from "@/components/LogoutButton";
import UserDisplay from "@/components/posts/UserDisplay";
import { useUser } from "@/contexts/UserContext";

function Page() {
  const { user } = useUser();

  return (
    <div className="w-full">
      <div className="w-full max-w-3xl mx-auto">
        <div className="w-full bg-white border border-slate-200 p-4 space-y-4 rounded-2xl relative">
          <UserDisplay user={user} />

          <LogoutButton
            className={
              "w-full px-5 py-2 bg-slate-200 rounded-full cursor-pointer"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
