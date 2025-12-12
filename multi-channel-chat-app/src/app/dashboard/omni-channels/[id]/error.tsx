'use client';

import Button from '@mui/material/Button';

import { RouterLink } from '@/routes/components';

import { DashboardContent } from '@/layouts/dashboard';

import { Iconify } from '@/components/iconify';
import { EmptyContent } from '@/components/empty-content';
import { paths } from '@/routes/path';

// ----------------------------------------------------------------------

export default function Error() {
  return (
    <DashboardContent sx={{ pt: 5 }}>
      <EmptyContent
        filled
        title="Channel not found!"
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.omniChannels.root}
            startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
            sx={{ mt: 3 }}
          >
            Back to list
          </Button>
        }
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    </DashboardContent>
  );
}
