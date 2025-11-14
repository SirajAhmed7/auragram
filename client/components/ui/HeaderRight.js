"use client";

import { useUser } from "@/contexts/UserContext";
import { LogIn } from "lucide-react";
import { Plus } from "lucide-react";
import Link from "next/link";

function HeaderRight() {
  const { isAuthenticated } = useUser();

  return (
    <div className="flex justify-end gap-4">
      {isAuthenticated ? (
        <Link
          href="/create"
          className="flex gap-3 items-center text-white font-medium rounded-full bg-linear-to-br from-cyan-700 to-teal-500 px-4 py-1.5"
        >
          <Plus size={24} className="text-white" />
          <span>Create</span>
        </Link>
      ) : (
        <>
          <Link
            href="/login"
            className="flex gap-3 items-center font-medium rounded-full bg-slate-200 px-6 py-2"
          >
            <span>Log in</span>
          </Link>

          <Link
            href="/signup"
            className="flex gap-3 items-center text-white font-medium rounded-full bg-linear-to-br from-cyan-700 to-teal-500 px-4 py-1.5"
          >
            <LogIn size={24} className="text-white" />
            <span>Sign up</span>
          </Link>
        </>
      )}
    </div>
  );
}

export default HeaderRight;
