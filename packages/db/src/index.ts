// Public API for @habla/db. Consumers do:
//   import { prisma, Prisma, Position } from '@habla/db';

export { prisma } from './client';
export { Prisma } from '@prisma/client';
export { Locale, PlanTier, Position, SubscriptionStatus } from '@prisma/client';
export type {
  Therapist,
  Phoneme,
  WordList,
  Word,
  Game,
  Assignment,
  AssignmentSession,
  Subscription,
  AuditLog,
  WebhookEvent,
} from '@prisma/client';
