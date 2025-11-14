"use client";

import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import SubmitButton from "@/components/ui/SubmitButton";
import { loginAction } from "@/lib/actions";
import Image from "next/image";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";

function LoginPage() {
  const [state, formAction] = useActionState(loginAction, null);
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    if (state?.success) {
      // Update user context with the returned user data
      setUser(state.user);
      // Redirect to home
      router.push("/");
    }
  }, [state, router, setUser]);

  return (
    <div className="w-full h-full min-h-screen flex justify-center p-6">
      <div className="flex flex-col items-center bg-white border border-slate-200 rounded-2xl px-16 py-10">
        <Image
          src={"images/logo.svg"}
          alt="Auragram logo"
          width={160}
          height={160}
        />
        <h1 className="text-3xl font-bold mt-8">Welcome to Auragram</h1>
        <p className="text-xl mt-5">
          Login to your account to continue using Auragram
        </p>
        <p className="text-xl mt-2">
          Or{" "}
          <Link href="/signup" className="text-cyan-700 underline">
            sign up
          </Link>{" "}
          for a new account
        </p>

        <form className="flex flex-col w-md mt-7 space-y-4" action={formAction}>
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <Input label={"Username"} placeholder="johndoe" id="username" />
          <PasswordInput id={"password"} label={"Password"} />

          <SubmitButton text={"Log in"} loadingText={"Logging in..."} />
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
