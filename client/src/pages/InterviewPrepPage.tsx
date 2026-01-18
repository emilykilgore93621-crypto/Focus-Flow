import { Sidebar } from "@/components/Sidebar";
import { useResources } from "@/hooks/use-resources";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MessageCircle, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function InterviewPrepPage() {
  const { data: questions, isLoading } = useResources({ type: 'interview_question' });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-3xl border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary text-primary-foreground rounded-xl">
                <Briefcase className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">Interview Prep Center</h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Interviews can be stressful, especially for ADHD minds. Use these common questions to practice your STAR method answers (Situation, Task, Action, Result).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard icon={MessageCircle} value={questions?.length || 0} label="Practice Questions" />
            <StatsCard icon={Star} value="STAR" label="Recommended Method" />
          </div>

          <h2 className="text-2xl font-bold mt-8">Question Bank</h2>
          
          {isLoading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
             </div>
          ) : (
            <Card className="border-none shadow-sm bg-transparent">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="space-y-4">
                  {questions?.map((q) => (
                    <AccordionItem key={q.id} value={`item-${q.id}`} className="bg-card border rounded-xl px-4">
                      <AccordionTrigger className="text-lg font-medium hover:no-underline hover:text-primary py-4">
                        {q.title}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 whitespace-pre-line leading-relaxed">
                        {q.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  {questions?.length === 0 && (
                     <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed">
                       No interview questions available yet. Check back soon!
                     </div>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
}

function StatsCard({ icon: Icon, value, label }: { icon: any, value: string | number, label: string }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 bg-muted rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
