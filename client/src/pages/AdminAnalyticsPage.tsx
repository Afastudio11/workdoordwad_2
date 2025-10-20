import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DynamicHeader from "@/components/DynamicHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, MousePointer, Send, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AnalyticsOverview {
  totalViews: number;
  totalClicks: number;
  totalApplies: number;
  topJobs: Array<{
    jobId: string;
    jobTitle: string;
    views: number;
    clicks: number;
  }>;
}

interface TopJob {
  jobId: string;
  jobTitle: string;
  views: number;
  clicks: number;
  applies: number;
}

const COLORS = ['#000000', '#404040', '#666666', '#808080', '#999999', '#b3b3b3'];

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>("7");

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(timeRange));
  
  const { data: overview, isLoading: overviewLoading } = useQuery<AnalyticsOverview>({
    queryKey: ["/api/admin/analytics/overview", { startDate: startDate.toISOString() }],
  });

  const { data: topJobs, isLoading: topJobsLoading } = useQuery<TopJob[]>({
    queryKey: ["/api/admin/analytics/top-jobs", { limit: 10 }],
  });

  const conversionRate = overview && overview.totalViews > 0 
    ? ((overview.totalApplies / overview.totalViews) * 100).toFixed(2)
    : "0";

  const clickThroughRate = overview && overview.totalViews > 0
    ? ((overview.totalClicks / overview.totalViews) * 100).toFixed(2)
    : "0";

  const statsCards = [
    {
      title: "Total Views",
      value: overview?.totalViews?.toLocaleString() || "0",
      icon: Eye,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-900",
    },
    {
      title: "Total Clicks",
      value: overview?.totalClicks?.toLocaleString() || "0",
      icon: MousePointer,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-900",
    },
    {
      title: "Total Applications",
      value: overview?.totalApplies?.toLocaleString() || "0",
      icon: Send,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-900",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-900",
    },
  ];

  const topJobsBarData = topJobs?.slice(0, 5).map(job => ({
    name: job.jobTitle.length > 20 ? job.jobTitle.substring(0, 20) + "..." : job.jobTitle,
    views: job.views,
    clicks: job.clicks,
    applies: job.applies,
  })) || [];

  const activityPieData = [
    { name: "Views", value: overview?.totalViews || 0 },
    { name: "Clicks", value: overview?.totalClicks || 0 },
    { name: "Applications", value: overview?.totalApplies || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DynamicHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="page-title">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor performa lowongan pekerjaan dan aktivitas pengguna
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]" data-testid="select-time-range">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {overviewLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} data-testid={`card-stat-${index}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-full ${stat.bgColor}`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Performing Jobs</CardTitle>
                  <CardDescription>Lowongan dengan views, clicks, dan applications terbanyak</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topJobsBarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#3b82f6" name="Views" />
                      <Bar dataKey="clicks" fill="#8b5cf6" name="Clicks" />
                      <Bar dataKey="applies" fill="#10b981" name="Applications" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity Distribution</CardTitle>
                  <CardDescription>Distribusi aktivitas pengguna</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={activityPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {activityPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top 10 Jobs by Performance</CardTitle>
                <CardDescription>Daftar lowongan pekerjaan dengan performa terbaik</CardDescription>
              </CardHeader>
              <CardContent>
                {topJobsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading...</p>
                  </div>
                ) : !topJobs || topJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Belum ada data tersedia</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            #
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Job Title
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Views
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Clicks
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Applications
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            CTR
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                            Conversion
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {topJobs.map((job, index) => {
                          const ctr = job.views > 0 ? ((job.clicks / job.views) * 100).toFixed(1) : "0";
                          const conversion = job.views > 0 ? ((job.applies / job.views) * 100).toFixed(1) : "0";
                          
                          return (
                            <tr
                              key={job.jobId}
                              className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                              data-testid={`row-job-${index}`}
                            >
                              <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                {index + 1}
                              </td>
                              <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                                {job.jobTitle}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                                {job.views.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                                {job.clicks.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                                {job.applies.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                                {ctr}%
                              </td>
                              <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                                {conversion}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
