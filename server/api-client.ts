/**
 * API Client for Kotlin Spring Boot Backend
 * Handles all HTTP requests to the Bible reading API
 */

const API_BASE_URL = process.env.VITE_BACKEND_API_URL || "http://localhost:8080/api";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface BookResponse {
  name: string;
  abbreviation: string;
}

export interface BookDetailsResponse {
  bookName: string;
  bookAbbreviation: string;
  chapters: number[];
}

export interface VerseResponse {
  id: number;
  verseNumber: number;
  text: string;
}

export interface ChapterResponse {
  bookName: string;
  bookAbbrevation: string;
  chapterNumber: number;
  currentPage: number;
  totalPages: number;
  verses: VerseResponse[];
}

export interface SearchResponse {
  keyword: string;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  verses: Array<{
    id: number;
    bookName: string;
    bookAbreviation: string;
    chapterNumber: number;
    verseNumber: number;
    text: string;
    testament: string;
  }>;
}

export interface ReadingProgressResponse {
  id: string;
  verseId: number;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  readAt: string;
}

export interface SubscriptionResponse {
  id: string;
  plan: "FREE" | "AI_PREMIUM";
  active: boolean;
  startDate: string;
  endDate: string | null;
}

export interface AIExplanationResponse {
  explanation: string;
  references?: string[];
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // Auth endpoints
  async register(name: string, email: string, password: string): Promise<UserResponse> {
    return this.request("POST", "/auth/register", { name, email, password });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request("POST", "/auth/login", { email, password });
  }

  // Bible endpoints
  async getBooks(): Promise<BookResponse[]> {
    return this.request("GET", "/bible/books");
  }

  async getBookDetails(bookAbreviation: string): Promise<BookDetailsResponse> {
    return this.request("GET", `/bible/books/${bookAbreviation}/details`);
  }

  async getChapter(bookAbreviation: string, chapter: number, page: number = 1): Promise<ChapterResponse> {
    return this.request("GET", `/bible/${bookAbreviation}/${chapter}?page=${page}`);
  }

  async searchVerses(keyword: string, page: number = 1): Promise<SearchResponse> {
    return this.request("GET", `/bible/search/versiculo?keyword=${encodeURIComponent(keyword)}&page=${page}`);
  }

  // Reading progress endpoints (authenticated)
  async saveReadingProgress(verseId: number): Promise<ReadingProgressResponse> {
    return this.request("POST", "/reading-progress", { verseId });
  }

  async getReadingHistory(page: number = 1): Promise<{
    content: ReadingProgressResponse[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
  }> {
    return this.request("GET", `/reading-progress?page=${page}`);
  }

  async getRecentReadings(limit: number = 10): Promise<ReadingProgressResponse[]> {
    return this.request("GET", `/reading-progress/recent?limit=${limit}`);
  }

  async getReadingStats(): Promise<{ totalVersesRead: number }> {
    return this.request("GET", "/reading-progress/stats");
  }

  async checkVerseRead(verseId: number): Promise<{ isRead: boolean }> {
    return this.request("GET", `/reading-progress/check/${verseId}`);
  }

  async deleteReadingProgress(progressId: string): Promise<{ success: boolean }> {
    return this.request("DELETE", `/reading-progress/${progressId}`);
  }

  // Subscription endpoints (authenticated)
  async getSubscription(): Promise<SubscriptionResponse> {
    return this.request("GET", "/subscription");
  }

  async upgradeSubscription(plan: "AI_PREMIUM"): Promise<SubscriptionResponse> {
    return this.request("POST", "/subscription/upgrade", { plan });
  }

  // AI endpoints (authenticated, AI_PREMIUM only)
  async getChapterExplanation(bookAbreviation: string, chapter: number): Promise<AIExplanationResponse> {
    return this.request("POST", "/bible-ai/chapter-summary", {
      bookAbreviation,
      chapter,
    });
  }

  async getVerseExplanation(verseId: number): Promise<AIExplanationResponse> {
    return this.request("POST", "/bible-ai/verse-explanation", {
      verseId,
    });
  }

  async getMultipleVersesAnalysis(verseIds: number[]): Promise<AIExplanationResponse> {
    return this.request("POST", "/bible-ai/verses-analysis", {
      verseIds,
    });
  }
}

export const apiClient = new ApiClient();
