import { useDailyFocus, useUpsertDailyFocus } from "@/hooks/use-daily-focus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sun, Battery, Smile, Frown, Meh, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MOODS = [
  { value: "great", icon: Smile, label: "Great" },
  { value: "okay", icon: Meh, label: "Okay" },
  { value: "overwhelmed", icon: Frown, label: "Overwhelmed" },
];

export function DailyFocusWidget() {
  const { data: dailyFocus, isLoading } = useDailyFocus();
  const upsertFocus = useUpsertDailyFocus();
  
  const [notes, setNotes] = useState("");
  const [energy, setEnergy] = useState<number>(3);
  const [mood, setMood] = useState<string | null>(null);

  useEffect(() => {
    if (dailyFocus) {
      setNotes(dailyFocus.notes || "");
      setEnergy(dailyFocus.energyLevel || 3);
      setMood(dailyFocus.mood || null);
    }
  }, [dailyFocus]);

  const handleSave = () => {
    upsertFocus.mutate({
      notes,
      energyLevel: energy,
      mood: mood || undefined,
    });
  };

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-primary text-xl">
          <Sun className="h-6 w-6 text-yellow-500 fill-yellow-500" />
          Daily Check-in
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">How are you feeling?</label>
          <div className="flex gap-2">
            {MOODS.map((m) => {
              const Icon = m.icon;
              const isSelected = mood === m.value;
              return (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`
                    flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border transition-all
                    ${isSelected 
                      ? "bg-primary text-primary-foreground border-primary shadow-md" 
                      : "bg-background hover:bg-muted border-border"
                    }
                  `}
                >
                  <Icon className={`h-6 w-6 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy Level */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Battery className="h-4 w-4" /> Energy Level
            </label>
            <span className="text-sm font-bold text-primary">{energy}/5</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={energy} 
            onChange={(e) => setEnergy(parseInt(e.target.value))}
            className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Today's Focus</label>
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What is the ONE thing you want to accomplish?"
            className="bg-background/80 min-h-[80px]"
          />
        </div>

        <Button 
          onClick={handleSave} 
          disabled={upsertFocus.isPending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
        >
          {upsertFocus.isPending ? "Saving..." : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Focus
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
