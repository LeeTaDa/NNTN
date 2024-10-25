"use client";

import { useState } from "react";
import { TextInput } from "@/components/TextInput";
import { ClusteringControls } from "@/components/ClusteringControls";
import { ClusteringResults } from "@/components/ClusteringResults";
import { kMeansClustering, TextCluster, ClusteringMetrics } from "@/lib/textAnalysis";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [text, setText] = useState("");
  const [k, setK] = useState(3);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [clusters, setClusters] = useState<TextCluster[]>([]);
  const [metrics, setMetrics] = useState<ClusteringMetrics | null>(null);
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Split by periods and filter out empty segments
      const texts = text
        .split(".")
        .map(t => t.trim())
        .filter(t => t.length > 0);

      if (texts.length < k) {
        toast({
          title: "Error",
          description: `Please enter at least ${k} sentences (currently have ${texts.length}). Each sentence should end with a period.`,
          variant: "destructive",
        });
        return;
      }

      const result = kMeansClustering(texts, k);
      setClusters(result.clusters);
      setMetrics(result.metrics);
      
      toast({
        title: "Analysis Complete",
        description: `Successfully clustered ${texts.length} sentences into ${k} groups`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (!clusters.length) return;

    const results = {
      clusters: clusters.map((cluster, idx) => ({
        id: idx + 1,
        texts: cluster.texts,
        similarity: cluster.similarity,
      })),
      metrics,
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clustering-results.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Results have been downloaded as JSON",
    });
  };

  return (
    <main className="container mx-auto py-8 space-y-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Text Analysis with K-means Clustering
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TextInput
            value={text}
            onChange={setText}
          />
        </div>
        
        <div>
          <ClusteringControls
            k={k}
            onKChange={setK}
            onAnalyze={handleAnalyze}
            onExport={handleExport}
            disabled={isAnalyzing}
          />
        </div>
      </div>

      {metrics && (
        <ClusteringResults
          clusters={clusters}
          metrics={metrics}
        />
      )}
    </main>
  );
}