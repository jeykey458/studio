import HistoryDashboard from "@/components/history-dashboard";
import { SCHOOLS, MOCK_HISTORY } from "@/lib/constants";
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return SCHOOLS.map((school) => ({
      school: school.id,
    }));
  }

export default function HistoryPage({ params }: { params: { school: string } }) {
    const school = SCHOOLS.find((s) => s.id === params.school);

    if (!school) {
        notFound();
    }
    
    // In a real app, you would fetch history for the specific school
    const historyData = MOCK_HISTORY;

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">Flood History</h1>
                <p className="text-muted-foreground">Analytics on past flood events at {school.name}.</p>
            </div>
            <HistoryDashboard history={historyData} />
        </div>
    );
}
