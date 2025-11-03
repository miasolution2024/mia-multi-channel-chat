import { ServiceEditView } from '@/sections/service/view/service-edit-view';
import { Metadata } from 'next';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Chỉnh sửa dịch vụ',
};
type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <ServiceEditView serviceId={params.id} />;
}