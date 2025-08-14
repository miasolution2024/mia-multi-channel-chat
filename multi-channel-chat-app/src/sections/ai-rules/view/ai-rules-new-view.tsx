'use client';

import { Container } from '@mui/material';

import { paths } from '@/routes/path';
import { DashboardContent } from '@/layouts/dashboard';
import { useSettingsContext } from '@/components/settings';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import { AiRulesNewEditForm } from '../ai-rules-new-edit-form';

// ----------------------------------------------------------------------

export function AiRulesNewView() {
  const settings = useSettingsContext();

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tạo quy tắc mới"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Quy tắc AI', href: paths.dashboard.aiRules.root },
            { name: 'Tạo mới' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <AiRulesNewEditForm />
      </Container>
    </DashboardContent>
  );
}