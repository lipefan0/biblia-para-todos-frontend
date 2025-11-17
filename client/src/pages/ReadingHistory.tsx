import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { apiClient } from "../../../server/api-client";
import type { ReadingProgressResponse } from "../../../server/api-client";

export default function ReadingHistory() {
  const [, setLocation] = useLocation();
  const [history, setHistory] = useState<ReadingProgressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          setLocation("/login");
          return;
        }

        apiClient.setToken(token);
        const historyData = await apiClient.getReadingHistory(currentPage);
        setHistory(historyData.content);
        setTotalPages(historyData.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar histórico");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [currentPage, setLocation]);

  const handleDelete = async (progressId: string) => {
    try {
      await apiClient.deleteReadingProgress(progressId);
      setHistory(history.filter((item) => item.id !== progressId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar progresso");
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

          <h1 className="text-3xl font-bold mb-2">Histórico de Leitura</h1>
          <p className="text-gray-600">Todos os versículos que você já leu</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* History List */}
        {history.length > 0 ? (
          <div className="space-y-4 mb-6">
            {history.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        {item.bookName} {item.chapterNumber}:{item.verseNumber}
                      </h3>
                      <p className="text-gray-600 mt-2">
                        Lido em {new Date(item.readAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600">Você ainda não leu nenhum versículo</p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
