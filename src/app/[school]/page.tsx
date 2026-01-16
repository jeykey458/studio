import { SCHOOLS } from '@/lib/constants';
import DashboardClient from '@/components/dashboard-client';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return SCHOOLS.map((school) => ({
    school: school.id,
  }));
}

export default async function SchoolDashboardPage({ params }: { params: { school: string } }) {
  const { school: schoolId } = params;
  const school = SCHOOLS.find((s) => s.id === schoolId);

  if (!school) {
    notFound();
  }

  return <DashboardClient school={school} />;
}
