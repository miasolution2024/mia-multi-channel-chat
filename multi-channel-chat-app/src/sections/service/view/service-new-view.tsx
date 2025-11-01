'use client';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useSettingsContext } from '@/components/settings';
import { DashboardContent } from '@/layouts/dashboard';
import { paths } from '@/routes/path';
import { ServiceForm } from '@/sections/service/components/service-form';
import { Container } from '@mui/material';

export default function ServiceNewView() {
  const settings = useSettingsContext();

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tạo dịch vụ mới"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Dịch vụ', href: paths.dashboard.service.root },
            { name: 'Tạo mới' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <ServiceForm />
      </Container>
    </DashboardContent>
  );
}