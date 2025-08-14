'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { paths } from '@/routes/path';
import { useSettingsContext } from '@/components/settings';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { ContentToneNewEditForm } from '../content-tone-new-edit-form';

// ----------------------------------------------------------------------

export function ContentToneNewView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Thêm mới văn phong AI"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Văn phong AI',
            href: paths.dashboard.contentTone.root,
          },
          { name: 'Thêm mới' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <ContentToneNewEditForm />
      </Box>
    </Container>
  );
}