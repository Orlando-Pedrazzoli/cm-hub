export interface GeminiAnalysis {
  hasViolation: boolean;
  policy: "vi" | "bh" | null;
  policyName: string | null;
  category: string | null;
  severity: "high" | "mid" | "low" | null;
  shouldEscalate: boolean;
  confidence: number;
  reasoning: string;
  suggestedLabel: string | null;
}

export async function analyzeWithGemini(text: string): Promise<GeminiAnalysis> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro na análise");
  }

  return response.json();
}