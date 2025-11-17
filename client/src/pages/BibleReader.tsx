import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, BookOpen, LogOut, Zap } from "lucide-react";
import { apiClient } from "../../../server/api-client";
import type { BookResponse } from "../../../server/api-client";

export default function BibleReader() {
  const [, setLocation] = useLocation();
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const booksData = await apiClient.getBooks();
        setBooks(booksData);
        setFilteredBooks(booksData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar livros");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.abreviation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4 w-full">
              Tentar Novamente
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-8 w-8" />
              Bíblia Para Todos
            </h1>
            <div className="space-x-2">
              {localStorage.getItem("authToken") ? (
                <>
                  <Button variant="outline" onClick={() => setLocation("/ai")}>
                    <Zap className="h-4 w-4 mr-2" />
                    IA
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/dashboard")}>
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      window.location.reload();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setLocation("/login")}>
                    Login
                  </Button>
                  <Button onClick={() => setLocation("/register")}>
                    Registrar
                  </Button>
                </>
              )}
            </div>
          </div>
          <p className="text-gray-600">
            Leia a Bíblia Sagrada sem interrupções. Registre-se para salvar seu progresso e usar IA.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar livro (ex: Gênesis, GEN, João)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setLocation("/search")}
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar Versículos
          </Button>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book) => (
            <Card
              key={book.abreviation}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setLocation(`/book/${book.abreviation}`)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{book.name}</CardTitle>
                <CardDescription>{book.abreviation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Testamento:</span> {book.testament === "AT" ? "Antigo" : "Novo"}
                  </p>
                  <p>
                    <span className="font-medium">Capítulos:</span> {book.totalChapters}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum livro encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
