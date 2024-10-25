"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Download, Play } from "lucide-react";

interface ClusteringControlsProps {
  k: number;
  onKChange: (value: number) => void;
  onAnalyze: () => void;
  onExport: () => void;
  disabled: boolean;
}

export function ClusteringControls({
  k,
  onKChange,
  onAnalyze,
  onExport,
  disabled
}: ClusteringControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clustering Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Number of Clusters (k): {k}</Label>
          <Slider
            min={2}
            max={10}
            step={1}
            value={[k]}
            onValueChange={([value]) => onKChange(value)}
            disabled={disabled}
          />
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={onAnalyze}
            disabled={disabled}
            className="flex-1"
          >
            <Play className="mr-2 h-4 w-4" />
            Analyze
          </Button>
          <Button
            onClick={onExport}
            disabled={disabled}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}