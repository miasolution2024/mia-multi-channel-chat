'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

import { paths } from '@/routes/path';
import { DashboardContent } from '@/layouts/dashboard';
import { useSettingsContext } from '@/components/settings';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { toast } from '@/components/snackbar';
import { CustomerJourney } from '@/sections/customer-journey/types';
import { getCustomerJourney } from '@/actions/customer-journey';
import { CustomerJourneyForm } from '@/sections/customer-journey/components/customer-journey-form';


// ----------------------------------------------------------------------

type Props = {
  customerJourneyId: string;
};

export function CustomerJourneyEditView({ customerJourneyId }: Props) {
  const settings = useSettingsContext();
  const [currentCustomerJourney, setCurrentCustomerJourney] = useState<CustomerJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCustomerJourney = async () => {
      try {
        setLoading(true);
        const response = await getCustomerJourney(customerJourneyId);
        setCurrentCustomerJourney(response.data);
      } catch (error) {
        console.error('Error fetching customer journey:', error);
        toast.error('Không thể tải thông tin hành trình khách hàng');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerJourney();
  }, [customerJourneyId]);

  if (loading) {
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

  if (error || !currentCustomerJourney) {
    return (
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Hành trình khách hàng không tồn tại
          </Typography>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Chỉnh sửa hành trình khách hàng"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Hành trình khách hàng', href: paths.dashboard.customerJourney.root },
            { name: 'Chỉnh sửa' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <CustomerJourneyForm customerJourney={currentCustomerJourney} />
      </Container>
    </DashboardContent>
  );
}