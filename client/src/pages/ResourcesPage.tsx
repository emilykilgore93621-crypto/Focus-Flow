import { Sidebar } from "@/components/Sidebar";
import { useResources } from "@/hooks/use-resources";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, ExternalLink, Tag } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const { data: resources, isLoading } = useResources({ search });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Resource Library</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Curated guides, templates, and strategies to help you navigate school, work, and life.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search resources..." 
              className="pl-10 h-12 rounded-xl text-lg bg-card"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources?.map(resource => (
                <Card key={resource.id} className="flex flex-col h-full hover:shadow-lg transition-shadow border-muted">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 capitalize">
                        {resource.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardTitle className="leading-tight text-xl">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {resource.content.substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-0">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {tag}
                        </span>
                      ))}
                    </div>
                    <Link href={`/resources/${resource.id}`}>
                      <Button className="w-full" variant="secondary">
                        Read More <BookOpen className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
              {resources?.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No resources found. Try a different search term.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
