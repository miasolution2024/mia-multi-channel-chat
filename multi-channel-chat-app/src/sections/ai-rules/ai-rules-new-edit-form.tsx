'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  Card,
  Stack,
  Button,
  CardHeader,
} from '@mui/material';

import { paths } from '@/routes/path';
import { useBoolean } from '@/hooks/use-boolean';
import { toast } from '@/components/snackbar';
import { Form, RHFTextField } from '@/components/hook-form';
import { createAiRule, updateAiRule } from '@/actions/ai-rules';

import { AiRule, AiRuleFormData } from './types';

// ----------------------------------------------------------------------

type Props = {
  currentRule?: AiRule;
};

const NewRuleSchema = zod.object({
  content: zod.string().min(1, 'Nội dung là bắt buộc'),
});

export function AiRulesNewEditForm({ currentRule }: Props) {
  const router = useRouter();
  const loadingSave = useBoolean();

  const defaultValues = useMemo(
    () => ({
      content: currentRule?.content || '',
    }),
    [currentRule]
  );

  const methods = useForm<AiRuleFormData>({
    resolver: zodResolver(NewRuleSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      if (currentRule) {
        await updateAiRule(currentRule.id, data);
      } else {
        await createAiRule(data);
      }
      
      reset();
      toast.success(currentRule ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
      router.push(paths.dashboard.aiRules.root);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    } finally {
      loadingSave.onFalse();
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.aiRules.root);
  }, [router]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader
          title={currentRule ? 'Chỉnh sửa quy tắc' : 'Tạo quy tắc mới'}
          subheader="Nhập nội dung quy tắc AI"
        />

        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField
            name="content"
            label="Nội dung quy tắc"
            multiline
            rows={4}
            rows={14}
            placeholder="Nhập nội dung quy tắc AI..."
          />
        </Stack>

        <Stack
          spacing={2}
          direction="row"
          justifyContent="flex-end"
          sx={{ p: 3, pt: 0 }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {currentRule ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}