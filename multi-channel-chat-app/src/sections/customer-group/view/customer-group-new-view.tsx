'use client';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useSettingsContext } from '@/components/settings';
import { DashboardContent } from '@/layouts/dashboard';
import { paths } from '@/routes/path';
import { CustomerGroupForm } from '@/sections/customer-group/components/customer-group-form';
import { Container } from '@mui/material';

export default function CustomerGroupNewView() {
    const settings = useSettingsContext();

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tạo nhóm khách hàng mới"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Nhóm khách hàng', href: paths.dashboard.customerGroup.root },
            { name: 'Tạo mới' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <CustomerGroupForm />
      </Container>
    </DashboardContent>
  )
}
