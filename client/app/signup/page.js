"use client";

import { useActionState, useEffect } from "react";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { signupAction } from "@/lib/actions";
import Image from "next/image";
import SubmitButton from "@/components/ui/SubmitButton";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";

function SignupPage() {
  const [state, formAction] = useActionState(signupAction, null);
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
          Sign in to your account to start using Auragram
        </p>
        <p className="text-xl mt-2">
          Or{" "}
          <Link href="/login" className="text-cyan-700 underline">
            log in
          </Link>{" "}
          with an existing account
        </p>

        <form className="flex flex-col w-md mt-7 space-y-4" action={formAction}>
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <Input label={"Username"} placeholder="johndoe" id="username" />
          <Input label={"Full name"} placeholder="John Doe" id="fullName" />
          <Input
            label={"Email"}
            type="email"
            placeholder="johndoe@example.com"
            id="email"
          />
          <PasswordInput id={"password"} label={"Password"} />
          <PasswordInput id={"passwordConfirm"} label={"Confirm password"} />

          <SubmitButton text={"Sign up"} loadingText={"Signing up..."} />
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
