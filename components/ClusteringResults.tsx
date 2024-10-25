"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { TextCluster, ClusteringMetrics } from "@/lib/textAnalysis";

interface ClusteringResultsProps {
  clusters: TextCluster[];
  metrics: ClusteringMetrics;
}

export function ClusteringResults({ clusters, metrics }: ClusteringResultsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Clustering Results</CardTitle>
        <div className="flex space-x-2">
          <Badge variant="outline">
            Silhouette Score: {metrics.silhouetteScore.toFixed(3)}
          </Badge>
          <Badge variant="outline">
            Inertia: {metrics.inertia.toFixed(3)}
          </Badge>
          <Badge variant="outline">
            Iterations: {metrics.iterationCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {clusters.map((cluster, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Cluster {idx + 1}
                <Badge className="ml-2" variant="secondary">
                  {cluster.texts.length} texts
                </Badge>
              </h3>
              <div className="space-y-2">
                {cluster.texts.map((text, textIdx) => (
                  <div
                    key={textIdx}
                    className="p-3 bg-muted rounded-md text-sm"
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}