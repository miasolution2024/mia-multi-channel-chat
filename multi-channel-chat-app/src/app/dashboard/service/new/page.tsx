import { Metadata } from 'next';
import ServiceNewView from '@/sections/service/view/service-new-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Tạo dịch vụ mới',
};

export default function ServiceNewPage() {
  return <ServiceNewView />;
}