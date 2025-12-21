import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Texto é obrigatório" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key não configurada no servidor" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analisa o seguinte texto para moderação de conteúdo. Identifica se há:
1. Violence and Incitement (V&I): ameaças, incitamento à violência, declarações de intenção violenta
2. Bullying and Harassment (B&H): ataques pessoais, assédio, termos depreciativos

Para cada violação encontrada, indica:
- Tipo de violação (V&I ou B&H)
- Categoria específica
- Severidade (high, mid, low)
- Se deve ser escalado (ESCALATE) - só para ameaças credíveis com target + intent + timing/armament/location
- Explicação breve

Se não houver violação, indica "Sem violação detectada".

Responde APENAS em formato JSON válido, sem markdown:
{
  "hasViolation": boolean,
  "policy": "vi" | "bh" | null,
  "policyName": string | null,
  "category": string | null,
  "severity": "high" | "mid" | "low" | null,
  "shouldEscalate": boolean,
  "confidence": number (0-100),
  "reasoning": string,
  "suggestedLabel": string | null
}

Texto para análise:
"""
${text}
"""`;

    const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
});

    const responseText = response.text;

    const jsonMatch = responseText?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ 
        error: "Resposta inválida da IA",
        raw: responseText 
      }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json(analysis);

  } catch (error: unknown) {
    console.error("Erro na análise:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}