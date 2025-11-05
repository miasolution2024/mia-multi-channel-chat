import { OmniChannelEditView } from '@/sections/omni-channel/view';
import { Metadata } from 'next';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Chỉnh sửa trang',
};
interface OmniChannelEditPageProps {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: OmniChannelEditPageProps) {
  const { id } = await params;
  return <OmniChannelEditView omniChannelId={id} />;
}