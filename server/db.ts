import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, readingProgress, subscriptions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getReadingProgress(userId: number, page: number = 1, limit: number = 20) {
  const db = await getDb();
  if (!db) return null;

  const offset = (page - 1) * limit;
  const result = await db
    .select()
    .from(readingProgress)
    .where(eq(readingProgress.userId, userId))
    .orderBy(desc(readingProgress.readAt))
    .limit(limit)
    .offset(offset);

  return result;
}

export async function getReadingStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(readingProgress)
    .where(eq(readingProgress.userId, userId));

  return {
    totalVersesRead: result.length,
  };
}

export async function checkVerseRead(userId: number, verseId: bigint) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(readingProgress)
    .where(
      and(
        eq(readingProgress.userId, userId),
        eq(readingProgress.verseId, verseId)
      )
    )
    .limit(1);

  return result.length > 0;
}

export async function saveReadingProgress(
  userId: number,
  verseId: bigint,
  bookName: string,
  bookAbreviation: string,
  chapterNumber: number,
  verseNumber: number
) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(readingProgress).values({
    userId,
    verseId,
    bookName,
    bookAbreviation,
    chapterNumber,
    verseNumber,
  });

  return result;
}

export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createUserSubscription(userId: number, plan: "FREE" | "AI_PREMIUM" = "FREE") {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(subscriptions).values({
    userId,
    plan,
  });

  return result;
}

// TODO: add more feature queries here as your schema grows.
