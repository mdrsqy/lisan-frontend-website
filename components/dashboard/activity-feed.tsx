// frontend/components/dashboard/activity-feed.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ActivityItem {
  name: string;
  action: string;
  lesson: string;
  time: string; // ISO Date string
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

// Helper untuk format waktu (sesuai desain: "X min ago" atau "X hours ago")
const timeSince = (dateString: string) => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(dateString).getTime()) / 1000
  );
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent User Activity</CardTitle>
        <Separator className="bg-sidebar-border mt-2" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 transition-colors hover:bg-sidebar-border"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-accent">
                  {activity.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.action}{" "}
                  <span className="text-card-foreground font-medium">
                    ({activity.lesson})
                  </span>
                </p>
              </div>
              <div className="text-xs text-right text-muted ml-4 shrink-0">
                {timeSince(activity.time)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
