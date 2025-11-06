'use client';

import { Container, Typography, CircularProgress, Box } from '@mui/material';

import { paths } from '@/routes/path';
import { DashboardContent } from '@/layouts/dashboard';
import { useSettingsContext } from '@/components/settings';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { useGetOmniChannels } from '@/hooks/apis/use-get-omni-channels';
import { OmniChannelForm } from './components/omni-channel-form';

// ----------------------------------------------------------------------

type Props = {
  omniChannelId: string;
};

export function OmniChannelEditView({ omniChannelId }: Props) {
  const settings = useSettingsContext();

  const { data, isLoading, error } = useGetOmniChannels({
    page: 1,
    limit: 1,
    id: omniChannelId
  });

  const currentOmniChannel = data?.[0] || null;


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

  if (error || !currentOmniChannel) {
    return (
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Kênh omni không tồn tại
          </Typography>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Chỉnh sửa trang"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Trang', href: paths.dashboard.omniChannel.root },
            { name: 'Chỉnh sửa' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <OmniChannelForm omniChannel={currentOmniChannel} />
      </Container>
    </DashboardContent>
  );
}