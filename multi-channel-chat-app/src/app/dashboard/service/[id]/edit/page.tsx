import { ServiceEditView } from '@/sections/service/view/service-edit-view';
import { Metadata } from 'next';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Chỉnh sửa dịch vụ',
};
interface ServiceEditPageProps {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: ServiceEditPageProps) {
  const { id } = await params;
  return <ServiceEditView serviceId={id} />;
}