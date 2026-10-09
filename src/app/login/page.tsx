import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";
import { login } from "../actions";

export default async function LoginPage() {
  if (await currentUser()) redirect("/write");
  return <AuthForm mode="login" action={login} />;
}
