import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronLeft, Zap, AlertCircle } from "lucide-react";
import { apiClient } from "../../../server/api-client";
import type { SubscriptionResponse, AIExplanationResponse } from "../../../server/api-client";

export default function AIExplainer() {
  const [, setLocation] = useLocation();
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [bookAbreviation, setBookAbreviation] = useState("");
  const [chapter, setChapter] = useState("");
  const [verseId, setVerseId] = useState("");
  const [explanation, setExplanation] = useState<AIExplanationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"chapter" | "verse">("chapter");

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setLocation("/login");
          return;
        }

        apiClient.setToken(token);
        const sub = await apiClient.getSubscription();
        setSubscription(sub);

        if (sub.plan !== "AI_PREMIUM") {
          setError("Você precisa ter o plano AI_PREMIUM para usar este recurso");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar assinatura");
      }
    };

    loadSubscription();
  }, [setLocation]);

  const handleGetExplanation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setExplanation(null);

    if (subscription?.plan !== "AI_PREMIUM") {
      setError("Você precisa ter o plano AI_PREMIUM para usar este recurso");
      return;
    }

    setLoading(true);

    try {
      let result: AIExplanationResponse;

      if (mode === "chapter") {
        if (!bookAbreviation || !chapter) {
          setError("Por favor, preencha o livro e o capítulo");
          return;
        }
        const res = await apiClient.summarizeChapter(bookAbreviation, parseInt(chapter));
        result = { explanation: res.summary, references: [] };
      } else {
        if (!verseId) {
          setError("Por favor, preencha o ID do versículo");
          return;
        }
        const res = await apiClient.explainVerse(bookAbreviation, parseInt(chapter), parseInt(verseId));
        result = { explanation: res.explanation, references: [] };
      }

      setExplanation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao obter explicação");
    } finally {
      setLoading(false);
    }
  };

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (subscription.plan !== "AI_PREMIUM") {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                Acesso Restrito
              </CardTitle>
            </CardHeader>
            <CardContent className="text-yellow-700">
              <p className="mb-4">
                Este recurso está disponível apenas para usuários com o plano AI_PREMIUM.
              </p>
              <Button onClick={() => setLocation("/dashboard")}>
                Fazer Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Zap className="h-8 w-8 text-purple-600" />
            Explicador Teológico com IA
          </h1>
          <p className="text-gray-600">
            Obtenha análises teológicas detalhadas de capítulos ou versículos específicos
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Mode Selection */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={mode === "chapter" ? "default" : "outline"}
            onClick={() => setMode("chapter")}
          >
            Explicar Capítulo
          </Button>
          <Button
            variant={mode === "verse" ? "default" : "outline"}
            onClick={() => setMode("verse")}
          >
            Explicar Versículo
          </Button>
        </div>

        {/* Input Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {mode === "chapter" ? "Explicar Capítulo" : "Explicar Versículo"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGetExplanation} className="space-y-4">
              {mode === "chapter" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Abreviação do Livro</label>
                    <Input
                      placeholder="Ex: GEN, JO, ROM"
                      value={bookAbreviation}
                      onChange={(e) => setBookAbreviation(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Número do Capítulo</label>
                    <Input
                      type="number"
                      placeholder="Ex: 1, 3, 21"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">ID do Versículo</label>
                  <Input
                    type="number"
                    placeholder="Ex: 123, 456"
                    value={verseId}
                    onChange={(e) => setVerseId(e.target.value)}
                    required
                  />
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Gerando explicação..." : "Obter Explicação"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Explanation Result */}
        {explanation && (
          <Card>
            <CardHeader>
              <CardTitle>Análise Teológica</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-gray-800">{explanation.explanation}</p>
              </div>

              {explanation.references && explanation.references.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Referências</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {explanation.references.map((ref, idx) => (
                      <li key={idx}>{ref}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
