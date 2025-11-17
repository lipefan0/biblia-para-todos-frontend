import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { apiClient } from "./api-client";
import { z } from "zod";

export const appRouter = router({
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
    getBooks: publicProcedure.query(async () => {
      return apiClient.getBooks();
    }),

    getBookDetails: publicProcedure
      .input(z.object({ bookAbreviation: z.string() }))
      .query(async ({ input }) => {
        return apiClient.getBookDetails(input.bookAbreviation);
      }),

    getChapter: publicProcedure
      .input(z.object({ bookAbreviation: z.string(), chapter: z.number(), page: z.number().optional() }))
      .query(async ({ input }) => {
        return apiClient.getChapter(input.bookAbreviation, input.chapter, input.page || 1);
      }),

    searchVerses: publicProcedure
      .input(z.object({ keyword: z.string(), page: z.number().optional() }))
      .query(async ({ input }) => {
        return apiClient.searchVerses(input.keyword, input.page || 1);
      }),
  }),

  readingProgress: router({
    saveProgress: protectedProcedure
      .input(z.object({ verseId: z.number() }))
      .mutation(async ({ input }) => {
        return apiClient.saveReadingProgress(input.verseId);
      }),

    getHistory: protectedProcedure
      .input(z.object({ page: z.number().optional() }))
      .query(async ({ input }) => {
        return apiClient.getReadingHistory(input.page || 1);
      }),

    getStats: protectedProcedure.query(async () => {
      return apiClient.getReadingStats();
    }),

    checkVerseRead: protectedProcedure
      .input(z.object({ verseId: z.number() }))
      .query(async ({ input }) => {
        return apiClient.checkVerseRead(input.verseId);
      }),

    deleteProgress: protectedProcedure
      .input(z.object({ progressId: z.string() }))
      .mutation(async ({ input }) => {
        return apiClient.deleteReadingProgress(input.progressId);
      }),
  }),

  subscription: router({
    getSubscription: protectedProcedure.query(async () => {
      return apiClient.getSubscription();
    }),

    upgradeSubscription: protectedProcedure
      .input(z.object({ plan: z.enum(["AI_PREMIUM"]) }))
      .mutation(async ({ input }) => {
        return apiClient.upgradeSubscription(input.plan);
      }),
  }),

  ai: router({
    summarizeChapter: protectedProcedure
      .input(z.object({ bookAbbreviation: z.string(), chapterNumber: z.number() }))
      .mutation(async ({ input }) => {
        return apiClient.summarizeChapter(input.bookAbbreviation, input.chapterNumber);
      }),

    explainVerse: protectedProcedure
      .input(z.object({ bookAbbreviation: z.string(), chapterNumber: z.number(), verseNumber: z.number() }))
      .mutation(async ({ input }) => {
        return apiClient.explainVerse(input.bookAbbreviation, input.chapterNumber, input.verseNumber);
      }),

    explainVerses: protectedProcedure
      .input(z.object({ bookAbbreviation: z.string(), chapterNumber: z.number(), verseNumbers: z.array(z.number()) }))
      .mutation(async ({ input }) => {
        return apiClient.explainVerses(input.bookAbbreviation, input.chapterNumber, input.verseNumbers);
      }),
  })
});

export type AppRouter = typeof appRouter;
