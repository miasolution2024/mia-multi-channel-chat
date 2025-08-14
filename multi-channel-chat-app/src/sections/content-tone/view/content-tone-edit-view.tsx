'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from '@/routes/path';
import { useSettingsContext } from '@/components/settings';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { ContentToneNewEditForm } from '../content-tone-new-edit-form';
import { getContentTone } from '@/actions/content-tone';
import { ContentTone } from '../types';

// ----------------------------------------------------------------------

type Props = {
  toneId: string;
};

export function ContentToneEditView({ toneId }: Props) {
  const router = useRouter();
  const settings = useSettingsContext();
  
  const [loading, setLoading] = useState(true);
  const [currentTone, setCurrentTone] = useState<ContentTone | null>(null);

  useEffect(() => {
    const fetchTone = async () => {
      try {
        setLoading(true);
        const data = await getContentTone(toneId);
        setCurrentTone(data.data || null);
      } catch (error) {
        console.error(`Error fetching content tone with ID ${toneId}:`, error);
        setCurrentTone(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTone();
  }, [toneId]);

  const handleGoBack = () => {
    router.push(paths.dashboard.contentTone.root);
  };

  if (loading) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography>Đang tải...</Typography>
        </Box>
      </Container>
    );
  }

  if (!currentTone) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography>Không tìm thấy văn phong AI</Typography>
          <Button onClick={handleGoBack} sx={{ mt: 2 }}>
            Quay lại
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Chỉnh sửa văn phong AI"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Văn phong AI',
            href: paths.dashboard.contentTone.root,
          },
          { name: currentTone.tone_description.substring(0, 30) + '...' },
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
        <ContentToneNewEditForm currentTone={currentTone} />
      </Box>
    </Container>
  );
}