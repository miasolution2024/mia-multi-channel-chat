'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

import { paths } from '@/routes/path';
import { DashboardContent } from '@/layouts/dashboard';
import { useSettingsContext } from '@/components/settings';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { toast } from '@/components/snackbar';
import { CustomerInsight } from '@/sections/customer-insight/types';
import {  getCustomerInsights } from '@/actions/customer-insight';
import { CustomerInsightForm } from '@/sections/customer-insight/components/customer-insight-form';


// ----------------------------------------------------------------------

type Props = {
  customerInsightId: string;
};

export function CustomerInsightEditView({ customerInsightId }: Props) {
  const settings = useSettingsContext();
  const [currentCustomerInsight, setCurrentCustomerInsight] = useState<CustomerInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCustomerInsight = async () => {
      try {
        setLoading(true);
        const response = await getCustomerInsights({
          id: customerInsightId,
        });
        
        if (response.data && response.data.length > 0) {
          setCurrentCustomerInsight(response.data[0]);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching hành vi khách hàng:', error);
        toast.error('Không thể tải thông tin hành vi khách hàng');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerInsight();
  }, [customerInsightId]);

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

  if (error || !currentCustomerInsight) {
    return (
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Hành vi khách hàng không tồn tại
          </Typography>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Chỉnh sửa hành vi khách hàng"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Hành vi khách hàng', href: paths.dashboard.customerInsight.root },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <CustomerInsightForm customerInsight={currentCustomerInsight} />
      </Container>
    </DashboardContent>
  );
}