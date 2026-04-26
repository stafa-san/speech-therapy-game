'use client';

// Rive-backed reward animation. Until a real reward-celebrate.riv asset
// lands, fall through to the placeholder. The wrapper module is the
// public contract; swapping this is a single-file change per asset.

import { RewardPlaceholder } from './placeholder';
import type { RiveRewardProps } from './index';

export function RiveRewardImpl(props: RiveRewardProps) {
  return <RewardPlaceholder {...props} />;
}
