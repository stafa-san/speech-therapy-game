'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { RewardPlaceholder } from './placeholder';

export interface RiveRewardProps {
  /** 0..1 — scales the celebration size. */
  intensity?: number;
  ariaLabel?: string;
  className?: string;
  forcePlaceholder?: boolean;
  onComplete?: () => void;
}

const RiveRewardImpl = dynamic(() => import('./impl').then((m) => m.RiveRewardImpl), {
  ssr: false,
  loading: () => <RewardPlaceholder />,
});

export function RiveReward(props: RiveRewardProps) {
  if (props.forcePlaceholder) return <RewardPlaceholder {...props} />;

  return (
    <Suspense fallback={<RewardPlaceholder {...props} />}>
      <RiveRewardImpl {...props} />
    </Suspense>
  );
}
