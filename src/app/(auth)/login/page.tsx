"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/account";
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    const supabase = createClient();
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: String(f.get("name") ?? "") } } });
    if (error) return setError(error.message);
    router.push(next); router.refresh();
  }

  return (
    <form onSubmit={submit} className="card w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-light">{mode === "in" ? "Sign in" : "Create account"}</h1>
      {mode === "up" && <div><label className="label" htmlFor="name">Full name</label><input id="name" name="name" className="input" required /></div>}
      <div><label className="label" htmlFor="email">Business email</label><input id="email" name="email" type="email" className="input" required /></div>
      <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" minLength={8} className="input" required /></div>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <button className="btn btn-primary w-full">{mode === "in" ? "Sign in" : "Create account"}</button>
      <button type="button" className="text-sm text-brand" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "New here? Create an account" : "Have an account? Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return <main className="flex min-h-screen items-center justify-center p-4"><Suspense><LoginForm /></Suspense></main>;
}
