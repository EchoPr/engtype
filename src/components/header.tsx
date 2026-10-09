import Link from "next/link";
import { KeyboardIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { currentUser } from "@/lib/auth";
import { logout } from "@/app/actions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "./theme-toggle";

function NavIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Link href={href} aria-label={label} className="p-2 text-sub transition-all hover:-translate-y-0.5 hover:text-text active:scale-90" />}>
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export async function Header() {
  const user = await currentUser();
  return (
    <header className="flex items-center justify-between py-8">
      <Link href="/" className="group flex items-center gap-3">
        <KeyboardIcon className="size-7 text-main transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
        <div className="leading-none">
          <div className="font-mono text-[10px] text-sub transition-colors group-hover:text-text">english writing</div>
          <div className="font-display text-3xl tracking-tight text-text">
            eng<span className="italic">type</span>
          </div>
        </div>
      </Link>
      {user ? (
        <nav className="flex items-center gap-1">
          <NavIcon href="/write" label="write">
            <KeyboardIcon className="size-5" />
          </NavIcon>
          <NavIcon href="/profile" label="profile">
            <UserIcon className="size-5" />
          </NavIcon>
          <NavIcon href="/settings" label="settings">
            <SettingsIcon className="size-5" />
          </NavIcon>
          <ThemeToggle />
          <span className="mx-2 text-sm italic text-sub">{user.username}</span>
          <form action={logout}>
            <button type="submit" aria-label="log out" className="p-2 text-sub transition-colors hover:text-text active:scale-90">
              <LogOutIcon className="size-4" />
            </button>
          </form>
        </nav>
      ) : (
        <nav className="flex items-center gap-4 text-sm text-sub">
          <ThemeToggle />
          <Link href="/login" className="hover:text-text">
            login
          </Link>
          <Link href="/register" className="hover:text-text">
            register
          </Link>
        </nav>
      )}
    </header>
  );
}
