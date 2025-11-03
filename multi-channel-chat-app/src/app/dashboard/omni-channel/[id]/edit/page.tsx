import { OmniChannelEditView } from '@/sections/omni-channel/view';
import { Metadata } from 'next';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Chỉnh sửa trang',
};
type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <OmniChannelEditView omniChannelId={params.id} />;
}