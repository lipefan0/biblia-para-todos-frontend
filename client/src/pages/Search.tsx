import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient } from "../../../server/api-client";
import type { SearchResponse } from "../../../server/api-client";

export default function Search() {
  const [, setLocation] = useLocation();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (e: React.FormEvent, page: number = 1) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setError("");
    setLoading(true);
    setCurrentPage(page);

    try {
      const searchResults = await apiClient.searchVerses(keyword, page);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar versículos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/bible")}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <SearchIcon className="h-8 w-8" />
            Buscar Versículos
          </h1>

          <form onSubmit={(e) => handleSearch(e, 1)} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Digite uma palavra ou frase (ex: amor, Deus amou o mundo)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Buscar
              </Button>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Encontrados {results.totalResults} resultado(s) para "{results.keyword}"
            </div>

            <div className="space-y-4">
              {results.verses.map((verse) => (
                <Card
                  key={verse.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    setLocation(`/book/${verse.bookAbreviation}/chapter/${verse.chapterNumber}`)
                  }
                >
                  <CardHeader>
                    <CardTitle className="text-base">
                      {verse.bookName} {verse.chapterNumber}:{verse.verseNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{verse.text}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      {verse.testament === "AT" ? "Antigo Testamento" : "Novo Testamento"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {results.totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={(e) => handleSearch(e, currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>

                <span className="text-sm text-gray-600">
                  Página {results.currentPage} de {results.totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={(e) => handleSearch(e, currentPage + 1)}
                  disabled={currentPage === results.totalPages || loading}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {!results && !error && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Digite uma palavra ou frase para buscar</p>
          </div>
        )}
      </div>
    </div>
  );
}
