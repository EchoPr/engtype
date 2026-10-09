import { requireUser } from "@/lib/auth";
import { now } from "@/lib/db";
import { quota } from "@/lib/quota-server";
import { SettingsForm } from "@/components/settings-form";

export const metadata = { title: "Settings", robots: { index: false } };

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="mb-4 font-display text-5xl text-text">Settings</h1>
      <SettingsForm
        bio={user.bio}
        targetLevel={user.target_level}
        quota={{ ...quota.status(user), now: now() }}
        privacy={{
          profile_public: Boolean(user.profile_public),
          public_heatmap: Boolean(user.public_heatmap),
          public_scores: Boolean(user.public_scores),
          public_essays: Boolean(user.public_essays),
        }}
      />
    </div>
  );
}
