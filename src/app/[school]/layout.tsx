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
  const school = SCHOOLS.find((s) => s.id === params.school);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header schoolName={school?.name || 'School'} schoolId={params.school} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
