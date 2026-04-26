import { TRPCError } from '@trpc/server';

import { searchImagesSchema, synthesizeAudioSchema } from '../schemas';
import { proProcedure, router, therapistProcedure } from '../trpc';

const NOT_YET = (lands: string) =>
  new TRPCError({ code: 'METHOD_NOT_SUPPORTED', message: `Lands in ${lands}.` });

export const mediaRouter = router({
  searchImages: therapistProcedure.input(searchImagesSchema).query(async () => {
    throw NOT_YET('PR 15 (Pexels integration)');
  }),

  uploadImage: proProcedure.mutation(async () => {
    throw NOT_YET('PR 15 (R2 image upload)');
  }),

  synthesizeAudio: therapistProcedure.input(synthesizeAudioSchema).mutation(async () => {
    throw NOT_YET('PR 15 (Azure Speech TTS)');
  }),
});
