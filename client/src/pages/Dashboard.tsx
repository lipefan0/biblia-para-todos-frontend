import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, BookOpen, TrendingUp, Zap } from "lucide-react";
import { apiClient } from "../../../server/api-client";
import type { SubscriptionResponse } from "../../../server/api-client";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [stats, setStats] = useState<{ totalVersesRead: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          setLocation("/login");
          return;
        }

        apiClient.setToken(token);

        const [subData, statsData] = await Promise.all([
          apiClient.getSubscription(),
          apiClient.getReadingStats(),
        ]);

        setSubscription(subData);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    apiClient.clearToken();
    setLocation("/");
  };

  const handleUpgrade = async () => {
    try {
      const upgraded = await apiClient.upgradeSubscription("AI_PREMIUM");
      setSubscription(upgraded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upgrade");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Meu Dashboard
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Verses Read */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Versículos Lidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalVersesRead || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Total de versículos lidos</p>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {subscription?.plan === "AI_PREMIUM" ? "Premium" : "Gratuito"}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {subscription?.active ? "Ativo" : "Inativo"}
              </p>
            </CardContent>
          </Card>

          {/* AI Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                IA Teológica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {subscription?.plan === "AI_PREMIUM" ? "✓" : "✗"}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {subscription?.plan === "AI_PREMIUM"
                  ? "Desbloqueado"
                  : "Faça upgrade para usar"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Continuar Leitura</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Volte para onde parou e continue sua jornada pela Bíblia.
              </p>
              <Button onClick={() => setLocation("/bible")} className="w-full">
                Ir para Bíblia
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Leitura</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Veja todos os versículos que você já leu.
              </p>
              <Button onClick={() => setLocation("/history")} className="w-full">
                Ver Histórico
              </Button>
            </CardContent>
          </Card>

          {subscription?.plan === "FREE" && (
            <Card className="md:col-span-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Desbloqueie IA Teológica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Faça upgrade para o plano AI_PREMIUM e obtenha explicações teológicas detalhadas,
                  resumos de capítulos e análises contextuais com inteligência artificial.
                </p>
                <Button onClick={handleUpgrade} className="w-full bg-purple-600 hover:bg-purple-700">
                  Fazer Upgrade Agora
                </Button>
              </CardContent>
            </Card>
          )}

          {subscription?.plan === "AI_PREMIUM" && (
            <Card className="md:col-span-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  IA Teológica Ativa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Você tem acesso a todas as funcionalidades de IA. Clique em qualquer versículo
                  para obter uma explicação teológica detalhada.
                </p>
                <Button onClick={() => setLocation("/bible")} className="w-full">
                  Usar IA na Bíblia
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
