import { Sidebar } from "@/components/Sidebar";
import { useResource } from "@/hooks/use-resources";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ResourceDetail() {
  const [, params] = useRoute("/resources/:id");
  const [, setLocation] = useLocation();
  const id = params ? parseInt(params.id) : 0;
  
  const { data: resource, isLoading, error } = useResource(id);

  if (error || (!resource && !isLoading)) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-12 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
          <Button onClick={() => setLocation("/resources")}>Back to Library</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" onClick={() => setLocation("/resources")} className="mb-6 pl-0 hover:pl-2 transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
          </Button>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          ) : resource && (
            <article className="prose prose-slate lg:prose-lg max-w-none">
              <div className="flex gap-2 mb-4">
                <Badge>{resource.category}</Badge>
                <Badge variant="outline" className="capitalize">{resource.type.replace('_', ' ')}</Badge>
              </div>
              
              <h1 className="text-4xl font-bold font-display tracking-tight text-foreground mb-4">
                {resource.title}
              </h1>

              <div className="flex items-center gap-6 text-sm text-muted-foreground border-b pb-8 mb-8">
                {resource.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(resource.createdAt), "MMMM d, yyyy")}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  5 min read
                </div>
              </div>

              <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                {resource.content}
              </div>

              {resource.tags && resource.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Related Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                        <Tag className="h-3 w-3 mr-2" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
