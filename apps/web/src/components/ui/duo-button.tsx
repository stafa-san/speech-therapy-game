'use client';

// Duolingo-style chunky button: solid color, white text, bottom-shadow that
// "presses down" on click. Uppercase tracking-wide for the kid-game feel.
//
// Use the standard shadcn <Button> for therapist surfaces and admin UI;
// this component is for marketing CTAs, the family player, and any place
// the user is meant to *enjoy* tapping.

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const duoButtonVariants = cva(
  [
    'relative inline-flex select-none items-center justify-center gap-2',
    'rounded-2xl font-extrabold uppercase tracking-wide text-white',
    'transition-all duration-100 ease-out',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/60',
    'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-y-0',
    'active:translate-y-1 active:shadow-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-brand-500 shadow-duo-brand hover:bg-brand-400 active:bg-brand-600',
        coral:
          'bg-coral-500 shadow-duo-coral hover:bg-coral-300 hover:text-coral-700 active:bg-coral-700',
        sunshine:
          'bg-sunshine-500 text-coral-700 shadow-duo-sunshine hover:bg-sunshine-300 active:bg-sunshine-700 active:text-white',
        sky: 'bg-sky-soft-500 shadow-duo-sky hover:bg-sky-soft-300 active:bg-sky-soft-700',
        grape: 'bg-grape-500 shadow-duo-grape hover:bg-grape-300 active:bg-grape-700',
        ghost: 'bg-white text-brand-700 shadow-duo-neutral hover:bg-brand-50 active:bg-brand-100',
      },
      size: {
        sm: 'h-10 px-4 text-xs',
        md: 'h-12 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
        xl: 'h-16 px-10 text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface DuoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof duoButtonVariants> {
  asChild?: boolean;
}

export const DuoButton = forwardRef<HTMLButtonElement, DuoButtonProps>(function DuoButton(
  { className, variant, size, asChild, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp ref={ref} className={cn(duoButtonVariants({ variant, size }), className)} {...props} />
  );
});
