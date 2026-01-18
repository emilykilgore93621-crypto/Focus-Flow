import { Sidebar } from "@/components/Sidebar";
import { DailyFocusWidget } from "@/components/DailyFocusWidget";
import { useAuth } from "@/hooks/use-auth";
import { useGoals } from "@/hooks/use-goals";
import { GoalCard } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateGoalForm } from "@/components/CreateGoalForm";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: goals, isLoading: goalsLoading } = useGoals({ isCompleted: 'false' });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter for top 3 goals
  const topGoals = goals?.slice(0, 3) || [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Good morning, {user?.firstName || 'Friend'}!
              </h1>
              <p className="text-muted-foreground mt-1 text-lg">
                Ready to find your flow today?
              </p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-5 w-5" /> New Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                  </DialogHeader>
                  <CreateGoalForm onSuccess={() => setIsCreateOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Daily Focus Column */}
            <div className="lg:col-span-1 space-y-6">
              <DailyFocusWidget />
              
              <div className="bg-secondary/50 rounded-2xl p-6 border border-secondary">
                <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
                  <Sparkles className="h-5 w-5" />
                  <span>Tip of the Day</span>
                </div>
                <p className="text-sm leading-relaxed text-secondary-foreground italic">
                  "Break big tasks into tiny, 10-minute chunks. It's easier to start small than to face a mountain."
                </p>
              </div>
            </div>

            {/* Goals Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Today's Priorities</h2>
                <Link href="/goals">
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {goalsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
                </div>
              ) : topGoals.length > 0 ? (
                <div className="space-y-4">
                  {topGoals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-2xl border border-dashed">
                  <p className="text-muted-foreground mb-4">No pending goals. You're all clear!</p>
                  <Button variant="outline" onClick={() => setIsCreateOpen(true)}>Create a Goal</Button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
