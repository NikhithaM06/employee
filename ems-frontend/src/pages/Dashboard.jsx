import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import StatCard from '../components/StatCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const colorPalette = ['#0ea5e9', '#22c55e', '#fbbf24', '#6366f1', '#ef4444'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeCount: 0,
    pastCount: 0,
    newThisMonth: 0,
    monthlyAggregation: [],
    domainAggregation: [],
  });
  const [clientCount, setClientCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setError('');
      try {
        const [statsResponse, clientsResponse] = await Promise.all([
          fetch('/api/employees/stats'),
          fetch('/api/clients'),
        ]);

        if (!statsResponse.ok) {
          throw new Error('Unable to load employee stats');
        }
        if (!clientsResponse.ok) {
          throw new Error('Unable to load clients');
        }

        const statsData = await statsResponse.json();
        const clientsData = await clientsResponse.json();

        setStats(statsData);
        setClientCount(clientsData.length);
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const cards = useMemo(
    () => [
      {
        title: 'Total Employees',
        value: stats.activeCount.toLocaleString(),
        description: 'All active team members',
      },
      {
        title: 'Past Employees',
        value: stats.pastCount.toLocaleString(),
        description: 'Team members who left',
      },
      {
        title: 'Total Clients',
        value: clientCount.toLocaleString(),
        description: 'Clients currently managed',
      },
      {
        title: 'New This Month',
        value: stats.newThisMonth.toLocaleString(),
        description: 'Employees added this month',
      },
    ],
    [stats, clientCount]
  );

  const headcountData = useMemo(() => {
    // Create a full 12-month array with zero values
    const fullYear = monthLabels.map((month) => ({
      month,
      count: 0,
    }));

    const aggregatedData = stats.monthlyAggregation?.length ? stats.monthlyAggregation : stats.headcountData;

    if (aggregatedData?.length) {
      aggregatedData.forEach((item) => {
        const monthIndex = item._id?.month ? item._id.month - 1 : monthLabels.findIndex((m) => m === item.month);
        if (monthIndex >= 0 && monthIndex < 12) {
          fullYear[monthIndex].count = item.count ?? item.headcount ?? 0;
        }
      });
    }

    return fullYear;
  }, [stats.monthlyAggregation, stats.headcountData]);

  const departmentData = useMemo(
    () =>
      stats.domainAggregation.map((item) => ({
        name: item._id,
        value: item.count,
      })),
    [stats.domainAggregation]
  );

  if (loading) {
    return <Spinner message="Loading dashboard data…" />;
  }

  if (error) {
    return <EmptyState title="Dashboard unavailable" description={error} />;
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Welcome back, Admin</h1>
          </div>
          <p className="max-w-xl text-sm text-slate-600">
            This shows employee performance, department breakdown, and headcount trends for the current year.
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-lg">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Monthly Headcount</h2>
              <p className="mt-1 text-sm text-slate-500">Active employee additions by month.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              2026 Overview
            </span>
          </div>
          {headcountData.length === 0 ? (
            <EmptyState title="No headcount data" description="Add active employees to see monthly trends." />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={headcountData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-lg">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-950">Department Breakdown</h2>
            <p className="mt-1 text-sm text-slate-500">Active team distribution by department.</p>
          </div>
          {departmentData.length === 0 ? (
            <EmptyState title="No department data" description="Hire employees to populate department insights." />
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:items-start">
              <div className="h-72 w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={departmentData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                      {departmentData.map((entry, index) => (
                        <Cell key={entry.name} fill={colorPalette[index % colorPalette.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid w-full gap-3 md:w-1/2">
                {departmentData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-4 w-4 rounded-full" style={{ backgroundColor: colorPalette[index % colorPalette.length] }} />
                      <p className="font-medium text-slate-900">{entry.name}</p>
                    </div>
                    <p className="text-sm text-slate-600">{entry.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
