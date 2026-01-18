import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGoalSchema, type InsertGoal, type Goal } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCreateGoal, useUpdateGoal } from "@/hooks/use-goals";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface CreateGoalFormProps {
  onSuccess?: () => void;
  initialData?: Goal;
}

export function CreateGoalForm({ onSuccess, initialData }: CreateGoalFormProps) {
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();

  // Handle date conversion for input type="date"
  const defaultValues = initialData ? {
    ...initialData,
    dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : undefined,
    // ensure description is string (handle null)
    description: initialData.description || "",
  } : {
    title: "",
    description: "",
    category: "career",
    priority: "medium",
  };

  const form = useForm<any>({
    resolver: zodResolver(insertGoalSchema),
    defaultValues,
  });

  const onSubmit = (data: any) => {
    // Transform date string back to Date object if present
    const payload = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };

    if (initialData) {
      updateGoal.mutate(
        { id: initialData.id, ...payload }, 
        { onSuccess }
      );
    } else {
      createGoal.mutate(payload, { 
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        }
      });
    }
  };

  const isPending = createGoal.isPending || updateGoal.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Update Resume" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="daily">Daily Life</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add details, subtasks, or notes..." 
                  className="resize-none h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Goal" : "Create Goal"}
        </Button>
      </form>
    </Form>
  );
}
