import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { login } from "../actions";

export const metadata: Metadata = { title: "Sign in", description: "Sign in to engtype to continue your IELTS and TOEFL writing practice.", robots: { index: false } };

export default async function LoginPage() {
  if (await currentUser()) redirect("/write");
  return <AuthForm mode="login" action={login} />;
}
