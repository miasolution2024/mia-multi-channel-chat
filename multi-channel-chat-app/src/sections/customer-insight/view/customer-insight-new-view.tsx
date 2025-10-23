'use client';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useSettingsContext } from '@/components/settings';
import { DashboardContent } from '@/layouts/dashboard';
import { paths } from '@/routes/path';
import { CustomerInsightForm } from '@/sections/customer-insight/components/customer-insight-form';
import { Container } from '@mui/material';

export default function CustomerInsightNewView() {
    const settings = useSettingsContext();

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tạo hành vi khách hàng mới"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Hành vi khách hàng', href: paths.dashboard.customerInsight.root },
            { name: 'Tạo mới' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <CustomerInsightForm />
      </Container>
    </DashboardContent>
  )
}
