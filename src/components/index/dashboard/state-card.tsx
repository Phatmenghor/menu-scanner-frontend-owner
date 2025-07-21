import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Clock } from "lucide-react";

export function StatsCards() {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Active Users",
      value: "2,234",
      change: "+8%",
      changeType: "positive" as const,
      icon: UserCheck,
    },
    {
      title: "Inactive Users",
      value: "234",
      change: "-2%",
      changeType: "negative" as const,
      icon: UserX,
    },
    {
      title: "Pending Users",
      value: "75",
      change: "+15%",
      changeType: "positive" as const,
      icon: Clock,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
