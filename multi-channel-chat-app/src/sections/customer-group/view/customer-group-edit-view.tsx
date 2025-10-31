'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

import { paths } from '@/routes/path';
import { DashboardContent } from '@/layouts/dashboard';
import { useSettingsContext } from '@/components/settings';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { toast } from '@/components/snackbar';
import { CustomerGroup } from '@/sections/customer-group/types';
import {  getCustomerGroups } from '@/actions/customer-group';
import { CustomerGroupForm } from '@/sections/customer-group/components/customer-group-form';


// ----------------------------------------------------------------------

type Props = {
  customerGroupId: string;
};

export function CustomerGroupEditView({ customerGroupId }: Props) {
  const settings = useSettingsContext();
  const [currentCustomerGroup, setCurrentCustomerGroup] = useState<CustomerGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCustomerInsight = async () => {
      try {
        setLoading(true);
        const response = await getCustomerGroups({
          id: customerGroupId,
        });
        
        if (response.data && response.data.length > 0) {
          setCurrentCustomerGroup(response.data[0]);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching nhóm khách hàng:', error);
        toast.error('Không thể tải thông tin nhóm khách hàng');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerInsight();
  }, [customerGroupId]);

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

  if (error || !currentCustomerGroup) {
    return (
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Nhóm khách hàng không tồn tại
          </Typography>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Chỉnh sửa nhóm khách hàng"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Nhóm khách hàng', href: paths.dashboard.customerGroup.root },
            { name: 'Chỉnh sửa' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <CustomerGroupForm editData={currentCustomerGroup} />
      </Container>
    </DashboardContent>
  );
}