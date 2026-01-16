
import HistoryDashboard from "@/components/history-dashboard";
import { SCHOOLS, MOCK_HISTORY } from "@/lib/constants";
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
    return SCHOOLS.map((school) => ({
      school: school.id,
    }));
  }

export default async function HistoryPage({ params }: { params: { school: string } }) {
    const schoolId = params.school;
    const school = SCHOOLS.find((s) => s.id === schoolId);

    if (!school) {
        notFound();
    }
    
    // In a real app, you would fetch history for the specific school
    const historyData = MOCK_HISTORY;

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/${schoolId}`}>
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Dashboard</span>
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-headline">Flood History</h1>
                    <p className="text-muted-foreground">Analytics on past flood events at {school.name}.</p>
                </div>
            </div>
            <HistoryDashboard history={historyData} />
        </div>
    );
}
