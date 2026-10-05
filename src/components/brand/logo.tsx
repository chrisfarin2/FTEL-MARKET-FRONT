import { Gamepad2 } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/tailwind/utils';

export const Logo = ({ className, ...props }: ComponentProps<'span'>) => (
  <span
    {...props}
    className={cn(
      'flex items-center gap-2 font-semibold tracking-tight text-primary',
      className
    )}
  >
    <Gamepad2 className="size-5 shrink-0" />
    <span>FTELMarket</span>
  </span>
);
