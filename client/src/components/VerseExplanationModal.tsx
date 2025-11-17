import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X, Zap } from "lucide-react";
import { apiClient } from "../../../server/api-client";

interface VerseExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookAbbreviation: string;
  chapterNumber: number;
  verseNumber: number;
  verseText: string;
}

export default function VerseExplanationModal({
  isOpen,
  onClose,
  bookAbbreviation,
  chapterNumber,
  verseNumber,
  verseText,
}: VerseExplanationModalProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExplain = async () => {
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Você precisa estar autenticado para usar a IA");
        return;
      }

      apiClient.setToken(token);
      const result = await apiClient.explainVerse(bookAbbreviation, chapterNumber, verseNumber);
      setExplanation(result.explanation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao obter explicação");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Explicação Teológica
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Verse Reference */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">
              {bookAbbreviation} {chapterNumber}:{verseNumber}
            </p>
            <p className="text-gray-800 italic">{verseText}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Explanation */}
          {explanation ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Análise Teológica:</h4>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {explanation}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Clique no botão abaixo para obter uma explicação teológica deste versículo
              </p>
              <Button
                onClick={handleExplain}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Gerando explicação..." : "Explicar com IA"}
              </Button>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
