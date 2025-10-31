'use client';

import { Container, Typography, CircularProgress, Box } from '@mui/material';

import { paths } from '@/routes/path';
import { DashboardContent } from '@/layouts/dashboard';
import { useSettingsContext } from '@/components/settings';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useGetCustomerJourneyProcess } from '@/hooks/apis/use-get-customer-journey-process';
import { CustomerJourneyProcessForm } from '../components/customer-journey-process-form';


// ----------------------------------------------------------------------

type Props = {
  customerJourneyProcessId: string;
};

export function CustomerJourneyProcessEditView({ customerJourneyProcessId }: Props) {
  const settings = useSettingsContext();
  const { data, isLoading, error } = useGetCustomerJourneyProcess({
    page: 1,
    limit: 1,
    id: customerJourneyProcessId,
  });
  const currentCustomerJourneyProcess = data?.[0] || null;
  


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

  if (error || !currentCustomerJourneyProcess) {
    return (
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Nhóm hành trình khách hàng không tồn tại
          </Typography>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Chỉnh sửa nhóm hành trình khách hàng"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Nhóm hành trình khách hàng', href: paths.dashboard.customerJourneyProcess.root },
            { name: 'Chỉnh sửa' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <CustomerJourneyProcessForm customerJourneyProcess={currentCustomerJourneyProcess} />
      </Container>
    </DashboardContent>
  );
}