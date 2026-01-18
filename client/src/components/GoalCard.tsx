import { type Goal } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateGoal, useDeleteGoal } from "@/hooks/use-goals";
import { format } from "date-fns";
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateGoalForm } from "./CreateGoalForm";

interface GoalCardProps {
  goal: Goal;
}

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-700 hover:bg-red-200 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200",
  low: "bg-green-100 text-green-700 hover:bg-green-200 border-green-200",
} as const;

export function GoalCard({ goal }: GoalCardProps) {
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const [isEditing, setIsEditing] = useState(false);

  const toggleComplete = () => {
    updateGoal.mutate({ id: goal.id, isCompleted: !goal.isCompleted });
  };

  const priorityColor = PRIORITY_COLORS[goal.priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.medium;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        className="group"
      >
        <Card className={`
          border-l-4 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden
          ${goal.isCompleted ? 'border-l-primary/50 bg-muted/30 opacity-75' : 'border-l-primary bg-card'}
        `}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <button 
                onClick={toggleComplete}
                className="mt-1 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
              >
                {goal.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold text-base leading-tight ${goal.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {goal.title}
                  </h4>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteGoal.mutate(goal.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {goal.description}
                </p>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge variant="outline" className={`capitalize border-0 ${priorityColor}`}>
                    {goal.priority}
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {goal.category}
                  </Badge>
                  {goal.dueDate && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                      <Clock className="h-3 w-3" />
                      {format(new Date(goal.dueDate), "MMM d")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          <CreateGoalForm 
            initialData={goal} 
            onSuccess={() => setIsEditing(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
