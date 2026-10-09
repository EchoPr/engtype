import { notFound } from "next/navigation";
import { LockIcon } from "lucide-react";
import { currentUser, userByName } from "@/lib/auth";
import { userStats } from "@/lib/stats";
import { ProfileView } from "@/components/profile-view";

export default async function PublicProfile({ params }: PageProps<"/u/[username]">) {
  const { username } = await params;
  const user = userByName(decodeURIComponent(username));
  if (!user) notFound();
  const viewer = await currentUser();

  if (!user.profile_public) {
    return (
      <div className="mt-24 flex flex-col items-center gap-3 text-sub">
        <LockIcon className="size-6" />
        <p>{user.username}&apos;s profile is private</p>
      </div>
    );
  }

  // the public view never includes the mistakes breakdown
  const stats = userStats(user.id, { publicOnly: true });
  return (
    <div className="flex flex-col gap-4">
      {viewer?.id === user.id && <p className="text-right text-xs text-sub">this is how others see your profile</p>}
      <ProfileView
        username={user.username}
        bio={user.bio}
        joined={user.created_at}
        stats={stats}
        show={{ heatmap: Boolean(user.public_heatmap), scores: Boolean(user.public_scores), errors: false, essays: true }}
        isOwner={false}
      />
    </div>
  );
}
