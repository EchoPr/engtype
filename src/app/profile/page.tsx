import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { userStats } from "@/lib/stats";
import { ProfileView } from "@/components/profile-view";

export default async function ProfilePage() {
  const user = await requireUser();
  const stats = userStats(user.id);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-4 text-xs text-sub">
        <span>private view</span>
        {user.profile_public ? (
          <Link href={`/u/${user.username}`} className="hover:text-main">
            see public profile →
          </Link>
        ) : (
          <Link href="/settings" className="hover:text-main">
            profile is hidden · settings →
          </Link>
        )}
      </div>
      <ProfileView
        username={user.username}
        bio={user.bio}
        joined={user.created_at}
        stats={stats}
        show={{ heatmap: true, scores: true, errors: true, essays: true }}
        isOwner
      />
    </div>
  );
}
