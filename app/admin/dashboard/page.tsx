// DashboardWrapper.tsx (Server Component)
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Admin Dashboard - Home",
  description: "Halaman utama Admin Dashboard",
};

export default function DashboardPage() {
  return <DashboardClient />;
}