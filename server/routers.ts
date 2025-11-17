import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { apiClient } from "./api-client";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  bible: router({
    books: publicProcedure.query(async () => {
      return apiClient.getBooks();
    }),

    bookDetails: publicProcedure
      .input(z.object({ bookAbreviation: z.string() }))
      .query(async ({ input }) => {
        return apiClient.getBookDetails(input.bookAbreviation);
      }),

    chapter: publicProcedure
      .input(z.object({ bookAbreviation: z.string(), chapter: z.number(), page: z.number().optional() }))
      .query(async ({ input }) => {
        return apiClient.getChapter(input.bookAbreviation, input.chapter, input.page);
      }),

    search: publicProcedure
      .input(z.object({ keyword: z.string(), page: z.number().optional() }))
      .query(async ({ input }) => {
        return apiClient.searchVerses(input.keyword, input.page);
      }),
  }),

  readingProgress: router({
    save: protectedProcedure
      .input(z.object({ verseId: z.number() }))
      .mutation(async ({ input }) => {
        return apiClient.saveReadingProgress(input.verseId);
      }),

    history: protectedProcedure
      .input(z.object({ page: z.number().optional() }))
      .query(async ({ input }) => {
        return apiClient.getReadingHistory(input.page);
      }),

    recent: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return apiClient.getRecentReadings(input.limit);
      }),

    stats: protectedProcedure.query(async () => {
      return apiClient.getReadingStats();
    }),

    check: protectedProcedure
      .input(z.object({ verseId: z.number() }))
      .query(async ({ input }) => {
        return apiClient.checkVerseRead(input.verseId);
      }),

    delete: protectedProcedure
      .input(z.object({ progressId: z.string() }))
      .mutation(async ({ input }) => {
        return apiClient.deleteReadingProgress(input.progressId);
      }),
  }),

  subscription: router({
    get: protectedProcedure.query(async () => {
      return apiClient.getSubscription();
    }),

    upgrade: protectedProcedure
      .input(z.object({ plan: z.enum(["AI_PREMIUM"]) }))
      .mutation(async ({ input }) => {
        return apiClient.upgradeSubscription(input.plan);
      }),
  }),

  ai: router({
    chapterExplanation: protectedProcedure
      .input(z.object({ bookAbreviation: z.string(), chapter: z.number() }))
      .mutation(async ({ input }) => {
        return apiClient.getChapterExplanation(input.bookAbreviation, input.chapter);
      }),

    verseExplanation: protectedProcedure
      .input(z.object({ verseId: z.number() }))
      .mutation(async ({ input }) => {
        return apiClient.getVerseExplanation(input.verseId);
      }),

    multipleVersesAnalysis: protectedProcedure
      .input(z.object({ verseIds: z.array(z.number()) }))
      .mutation(async ({ input }) => {
        return apiClient.getMultipleVersesAnalysis(input.verseIds);
      }),
  })
});

export type AppRouter = typeof appRouter;
