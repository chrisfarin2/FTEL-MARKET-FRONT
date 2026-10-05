import { Meta } from '@storybook/react-vite';

import { Logo } from '@/components/brand/logo';

export default {
  title: 'Brand/Logo',
} satisfies Meta<typeof Logo>;

export const Default = () => {
  return <Logo />;
};

export const Color = () => {
  return <Logo className="text-neutral-400" />;
};
