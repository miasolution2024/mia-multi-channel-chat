'use client';

import { Container, Typography, CircularProgress, Box } from '@mui/material';

import { paths } from '@/routes/path';
import { DashboardContent } from '@/layouts/dashboard';
import { useSettingsContext } from '@/components/settings';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { ServiceForm } from '@/sections/service/components/service-form';
import { useGetServices } from '@/hooks/apis/use-get-services';

// ----------------------------------------------------------------------

type Props = {
  serviceId: string;
};

export function ServiceEditView({ serviceId }: Props) {
  const settings = useSettingsContext();

  const { data, isLoading, error } = useGetServices({
    page: 1,
    limit: 1,
    id: serviceId
  });

  const currentService = data?.[0] || null;


  if (isLoading) {
    return (
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        </Container>
      </DashboardContent>
    );
  }

  if (error || !currentService) {
    return (
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Dịch vụ không tồn tại
          </Typography>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Chỉnh sửa dịch vụ"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Dịch vụ', href: paths.dashboard.service.root },
            { name: 'Chỉnh sửa' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <ServiceForm service={currentService} />
      </Container>
    </DashboardContent>
  );
}