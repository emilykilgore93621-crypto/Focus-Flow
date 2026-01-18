import { Sidebar } from "@/components/Sidebar";
import { useGoals } from "@/hooks/use-goals";
import { GoalCard } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateGoalForm } from "@/components/CreateGoalForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function GoalsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<'true' | 'false'>('false');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: goals, isLoading } = useGoals({ 
    category: categoryFilter === 'all' ? undefined : categoryFilter, 
    isCompleted: statusFilter 
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Goal Center</h1>
              <p className="text-muted-foreground mt-1">Track your progress, one step at a time.</p>
            </div>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-md">
                  <Plus className="mr-2 h-4 w-4" /> Add Goal
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
            <div className="flex-1 flex gap-2 items-center text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">In Progress</SelectItem>
                <SelectItem value="true">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter || 'all'} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="daily">Daily Life</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid */}
          {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals?.map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
              {goals?.length === 0 && (
                <div className="col-span-full text-center py-20 text-muted-foreground bg-card rounded-2xl border border-dashed">
                  No goals found matching these filters.
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
