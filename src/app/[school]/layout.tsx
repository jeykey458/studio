import Header from '@/components/header';
import { SCHOOLS } from '@/lib/constants';

export async function generateStaticParams() {
  return SCHOOLS.map((school) => ({
    school: school.id,
  }));
}

export default function SchoolLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { school: string };
}) {
  const schoolId = params.school;
  const school = SCHOOLS.find((s) => s.id === schoolId);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header schoolName={school?.name || 'School'} schoolId={schoolId} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
