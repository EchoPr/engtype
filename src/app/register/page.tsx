import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { register } from "../actions";

export const metadata: Metadata = { title: "Create an account", description: "Create a free engtype account: IELTS and TOEFL writing tasks with criterion-by-criterion feedback.", alternates: { canonical: "/register" } };

export default async function RegisterPage() {
  if (await currentUser()) redirect("/write");
  return <AuthForm mode="register" action={register} />;
}
