"use client";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Text</CardTitle>
        <CardDescription>
          Enter your text. Each sentence ending with a period (.) will be treated as a separate segment for clustering.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter text to analyze. Each sentence should end with a period. For example:
This is the first sentence to analyze. This is another sentence with different content. A third sentence about something else. The fourth sentence completes the example."
          className="min-h-[200px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}