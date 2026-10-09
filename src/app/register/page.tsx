import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { register } from "../actions";

export default async function RegisterPage() {
  if (await currentUser()) redirect("/write");
  return <AuthForm mode="register" action={register} />;
}
