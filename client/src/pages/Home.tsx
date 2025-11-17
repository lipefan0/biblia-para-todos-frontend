import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Zap, Lock } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <BookOpen className="h-8 w-8" />
          Bíblia Para Todos
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setLocation("/login")}>
            Login
          </Button>
          <Button onClick={() => setLocation("/register")}>
            Registrar
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Leia a Bíblia Sagrada sem Interrupções
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Acesso completo a todos os livros, capítulos e versículos da Bíblia. 
          Registre-se para salvar seu progresso e usar inteligência artificial para análises teológicas.
        </p>
        <Button
          size="lg"
          onClick={() => setLocation("/bible")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
        >
          Começar a Ler Agora
        </Button>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos Principais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Leitura Completa</h3>
              <p className="text-gray-600">
                Acesso a todos os livros da Bíblia Sagrada com interface limpa e sem distrações.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Busca Avançada</h3>
              <p className="text-gray-600">
                Busque por palavras-chave ou frases completas em toda a Bíblia.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">IA Teológica</h3>
              <p className="text-gray-600">
                Obtenha explicações teológicas e análises de versículos com IA.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Progresso Salvo</h3>
              <p className="text-gray-600">
                Registre-se para salvar seu progresso de leitura e acessar de qualquer lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg mb-8 opacity-90">
            Acesse a Bíblia gratuitamente ou registre-se para desbloquear todos os recursos.
          </p>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/bible")}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Ler Gratuitamente
            </Button>
            <Button
              onClick={() => setLocation("/register")}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Criar Conta
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>&copy; 2025 Bíblia Para Todos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
