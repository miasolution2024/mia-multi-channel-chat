'use client';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useSettingsContext } from '@/components/settings';
import { DashboardContent } from '@/layouts/dashboard';
import { paths } from '@/routes/path';
import { Container } from '@mui/material';
import { OmniChannelForm } from './components/omni-channel-form';

export default function OmniChannelNewView() {
  const settings = useSettingsContext();

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tạo trang mới"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Trang', href: paths.dashboard.omniChannel.root },
            { name: 'Tạo mới' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <OmniChannelForm />
      </Container>
    </DashboardContent>
  );
}