import { OmniChannelNewView } from '@/sections/omni-channel/view';
import { Metadata } from 'next';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Tạo trang mới',
};

export default function OmniChannelNewPage() {
  return <OmniChannelNewView />;
}