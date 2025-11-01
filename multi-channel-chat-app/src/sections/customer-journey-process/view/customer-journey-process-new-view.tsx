'use client';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useSettingsContext } from '@/components/settings';
import { DashboardContent } from '@/layouts/dashboard';
import { paths } from '@/routes/path';
import { CustomerJourneyProcessForm } from '@/sections/customer-journey-process/components/customer-journey-process-form';
import { Container } from '@mui/material';

export default function CustomerJourneyProcessNewView() {
    const settings = useSettingsContext();

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tạo hành trình khách hàng mới"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Hành trình khách hàng', href: paths.dashboard.customerJourneyProcess.root },
            { name: 'Tạo mới' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <CustomerJourneyProcessForm />
      </Container>
    </DashboardContent>
  )
}   
