import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { apiClient } from "../../../server/api-client";
import type { ChapterResponse } from "../../../server/api-client";

export default function ChapterView() {
  const [match, params] = useRoute("/book/:bookAbreviation/chapter/:chapter");
  const [, setLocation] = useLocation();
  const [chapter, setChapter] = useState<ChapterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bookAbreviation = params?.bookAbreviation as string;
  const chapterNumber = parseInt(params?.chapter as string, 10);

  useEffect(() => {
    const loadChapter = async () => {
      if (!bookAbreviation || !chapterNumber) return;

      try {
        setLoading(true);
        const chapterData = await apiClient.getChapter(bookAbreviation, chapterNumber);
        setChapter(chapterData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar capítulo");
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
  }, [bookAbreviation, chapterNumber]);

  if (!match) {
    return <div>Capítulo não encontrado</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error || "Capítulo não encontrado"}</p>
            <Button onClick={() => setLocation("/bible")} className="mt-4 w-full">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePrevChapter = () => {
    if (chapterNumber > 1) {
      setLocation(`/book/${bookAbreviation}/chapter/${chapterNumber - 1}`);
    }
  };

  const handleNextChapter = () => {
    setLocation(`/book/${bookAbreviation}/chapter/${chapterNumber + 1}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation(`/book/${bookAbreviation}`)}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <h1 className="text-3xl font-bold mb-2">
            {chapter.bookName} {chapter.chapterNumber}
          </h1>
          <p className="text-gray-600">
            {chapter.testament === "AT" ? "Antigo Testamento" : "Novo Testamento"} • {chapter.totalVerses} versículos
          </p>
        </div>

        {/* Content */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-6 text-lg leading-relaxed">
              {chapter.verses.map((verse) => (
                <div key={verse.id} className="flex gap-4">
                  <span className="font-bold text-gray-500 flex-shrink-0 min-w-12">
                    {verse.verseNumber}
                  </span>
                  <p className="text-gray-800">{verse.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevChapter}
            disabled={chapterNumber === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Capítulo Anterior
          </Button>

          <span className="text-sm text-gray-600">
            Página {chapter.currentPage} de {chapter.totalPages}
          </span>

          <Button variant="outline" onClick={handleNextChapter}>
            Próximo Capítulo
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
