import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronLeft, BookOpen } from "lucide-react";
import { apiClient } from "../../../server/api-client";
import type { BookDetailsResponse } from "../../../server/api-client";

export default function BookView() {
  const [match, params] = useRoute("/book/:bookAbreviation");
  const [, setLocation] = useLocation();
  const [book, setBook] = useState<BookDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bookAbreviation = params?.bookAbreviation as string;

  useEffect(() => {
    const loadBook = async () => {
      if (!bookAbreviation) return;

      try {
        setLoading(true);
        const bookData = await apiClient.getBookDetails(bookAbreviation);
        setBook(bookData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar livro");
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [bookAbreviation]);

  if (!match) {
    return <div>Livro não encontrado</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error || "Livro não encontrado"}</p>
            <Button onClick={() => setLocation("/bible")} className="mt-4 w-full">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4">
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

          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            {book.bookName}
          </h1>
          <p className="text-gray-600">
            {book.chapters.length} capítulos
          </p>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {book.chapters.map((chapterNumber) => (
            <Button
              key={chapterNumber}
              variant="outline"
              onClick={() => setLocation(`/book/${bookAbreviation}/chapter/${chapterNumber}`)}
              className="h-auto py-4 flex flex-col items-center gap-1"
            >
              <span className="font-bold text-lg">{chapterNumber}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
