import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BibleReader from "./pages/BibleReader";
import BookView from "./pages/BookView";
import ChapterView from "./pages/ChapterView";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import ReadingHistory from "./pages/ReadingHistory";
import AIExplainer from "./pages/AIExplainer";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/bible"} component={BibleReader} />
      <Route path={"/book/:bookAbreviation"} component={BookView} />
      <Route path={"/book/:bookAbreviation/chapter/:chapter"} component={ChapterView} />
      <Route path={"/search"} component={Search} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/history"} component={ReadingHistory} />
      <Route path={"/ai"} component={AIExplainer} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
