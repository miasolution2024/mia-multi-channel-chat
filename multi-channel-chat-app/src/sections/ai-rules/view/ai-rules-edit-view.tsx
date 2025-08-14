'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

import { paths } from '@/routes/path';
import { DashboardContent } from '@/layouts/dashboard';
import { useSettingsContext } from '@/components/settings';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { toast } from '@/components/snackbar';
import { getAiRule } from '@/actions/ai-rules';

import { AiRulesNewEditForm } from '../ai-rules-new-edit-form';
import { AiRule } from '../types';

// ----------------------------------------------------------------------

type Props = {
  ruleId: string;
};

export function AiRulesEditView({ ruleId }: Props) {
  const settings = useSettingsContext();
  const [currentRule, setCurrentRule] = useState<AiRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRule = async () => {
      try {
        setLoading(true);
        const response = await getAiRule(ruleId);
        setCurrentRule(response.data);
      } catch (error) {
        console.error('Error fetching AI rule:', error);
        toast.error('Không thể tải thông tin quy tắc AI');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRule();
  }, [ruleId]);

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

  if (error || !currentRule) {
    return (
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Quy tắc AI không tồn tại
          </Typography>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Chỉnh sửa quy tắc"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Quy tắc AI', href: paths.dashboard.aiRules.root },
            { name: currentRule.content.substring(0, 30) + '...' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <AiRulesNewEditForm currentRule={currentRule} />
      </Container>
    </DashboardContent>
  );
}