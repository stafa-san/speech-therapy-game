import { z } from 'zod';

// ===== Shared primitives =====

export const cuidSchema = z.string().min(20).max(40);
export const positionSchema = z.enum(['initial', 'medial', 'final', 'mixed']);
export const localeSchema = z.enum(['en', 'es']);

// ===== WordList =====

export const wordListFiltersSchema = z.object({
  phonemeId: z.number().int().positive().optional(),
  position: positionSchema.optional(),
  difficulty: z.number().int().min(1).max(3).optional(),
  /** When true (Pro-only), include the therapist's own custom lists in the result. */
  owned: z.boolean().optional(),
});

export const wordListIdSchema = z.object({ id: cuidSchema });

export const createWordListSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  phonemeId: z.number().int().positive(),
  position: positionSchema,
  difficultyTier: z.number().int().min(1).max(3),
  locale: localeSchema.default('es'),
});

export const updateWordListSchema = createWordListSchema.partial().extend({ id: cuidSchema });

// ===== Word =====

export const addWordSchema = z.object({
  wordListId: cuidSchema,
  text: z.string().min(1).max(80),
  textEn: z.string().max(80).optional(),
  ipa: z.string().max(80).optional(),
  position: positionSchema,
  imageUrl: z.string().url().optional(),
  audioUrl: z.string().url().optional(),
  dialectNotes: z.string().max(200).optional(),
});

export const updateWordSchema = z.object({
  id: cuidSchema,
  text: z.string().min(1).max(80).optional(),
  textEn: z.string().max(80).optional(),
  ipa: z.string().max(80).optional(),
  position: positionSchema.optional(),
  imageUrl: z.string().url().optional(),
  audioUrl: z.string().url().optional(),
  dialectNotes: z.string().max(200).optional(),
});

// ===== Assignment =====

export const createAssignmentSchema = z.object({
  wordListId: cuidSchema,
  gameId: z.number().int().positive(),
  studentLabel: z.string().min(1).max(80).optional(),
  expiresAt: z.coerce.date().optional(),
});

export const tokenSchema = z.object({
  /** URL-safe random token. randomBytes(16).toString('base64url') = 22 chars. */
  token: z
    .string()
    .min(20)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/, 'Invalid token format.'),
});

export const sessionUpdateSchema = tokenSchema.extend({
  sessionId: cuidSchema,
  trialsCompleted: z.number().int().min(0).max(50),
  completed: z.boolean(),
});

// ===== Therapist =====

export const updateLocaleSchema = z.object({ locale: localeSchema });

// ===== Media =====

export const searchImagesSchema = z.object({
  query: z.string().min(1).max(80),
});

export const synthesizeAudioSchema = z.object({
  text: z.string().min(1).max(120),
  voice: z
    .enum(['es-MX-DaliaNeural', 'es-US-PalomaNeural', 'es-ES-ElviraNeural'])
    .default('es-MX-DaliaNeural'),
});
