import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';

import { paths } from '@/routes/path';
import { toast } from '@/components/snackbar';
import { Form, Field } from '@/components/hook-form';
import { Content } from './view/content-assistant-list-view';

// ----------------------------------------------------------------------

const ContentSchema = zod.object({
  topic: zod.string().min(1, { message: 'Chủ đề là bắt buộc!' }),
  contentType: zod.string().min(1, { message: 'Loại bài viết là bắt buộc!' }),
  mainSeoKeyword: zod.string().min(1, { message: 'Từ khoá SEO chính là bắt buộc!' }),
  secondarySeoKeywords: zod.string().array(),
  customerGroup: zod.string().min(1, { message: 'Nhóm khách hàng là bắt buộc!' }),
  customerJourney: zod.string().min(1, { message: 'Hành trình khách hàng là bắt buộc!' }),
  description: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentContent?: Content;
};

export function ContentAssistantNewEditForm({ currentContent }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      topic: currentContent?.topic || '',
      contentType: currentContent?.contentType || '',
      mainSeoKeyword: currentContent?.mainSeoKeyword || '',
      secondarySeoKeywords: currentContent?.secondarySeoKeywords || [],
      customerGroup: currentContent?.customerGroup || '',
      customerJourney: currentContent?.customerJourney || '',
      description: currentContent?.description || '',
    }),
    [currentContent]
  );

  const methods = useForm({
    resolver: zodResolver(ContentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentContent) {
      reset(defaultValues);
    }
  }, [currentContent, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Xử lý lưu dữ liệu
      // Nếu có currentContent thì cập nhật, ngược lại thì tạo mới
      console.log('Form data:', data);
      
      toast.success(currentContent ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
      
      router.push(paths.dashboard.contentAssistant.root);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader title="Chi tiết" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="topic" label="Chủ đề bài viết" />

        <Field.Select name="contentType" label="Loại bài viết">
          <MenuItem value="Blog">Blog</MenuItem>
          <MenuItem value="Bài đăng">Bài đăng</MenuItem>
          <MenuItem value="Tin tức">Tin tức</MenuItem>
        </Field.Select>

        <Field.Text name="mainSeoKeyword" label="Từ khoá SEO chính" />

        <Field.Autocomplete
          name="secondarySeoKeywords"
          label="Từ khoá SEO phụ"
          placeholder="+ Thêm từ khoá"
          multiple
          freeSolo
          disableCloseOnSelect
          options={[]}
          getOptionLabel={(option: string) => option}
          renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: string) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
        />
      </Stack>
    </Card>
  );

  const renderCustomerInfo = (
    <Card>
      <CardHeader title="Thông tin khách hàng" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Select name="customerGroup" label="Nhóm khách hàng">
          <MenuItem value="Mới">Mới</MenuItem>
          <MenuItem value="Tiềm năng">Tiềm năng</MenuItem>
          <MenuItem value="Khách hàng hiện tại">Khách hàng hiện tại</MenuItem>
        </Field.Select>

        <Field.Select name="customerJourney" label="Hành trình khách hàng">
          <MenuItem value="Nhận biết">Nhận biết</MenuItem>
          <MenuItem value="Cân nhắc">Cân nhắc</MenuItem>
          <MenuItem value="Quyết định">Quyết định</MenuItem>
        </Field.Select>
      </Stack>
    </Card>
  );

  const renderContent = (
    <Card>
      <CardHeader title="Nội dung" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Editor name="description" />
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack direction="row" justifyContent="flex-end" spacing={2}>
      <Button
        variant="outlined"
        onClick={() => router.push(paths.dashboard.contentAssistant.root)}
      >
        Huỷ
      </Button>

      <Button type="submit" variant="contained" loading={isSubmitting}>
        {!currentContent ? 'Tạo nội dung' : 'Lưu thay đổi'}
      </Button>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {renderDetails}

        {renderCustomerInfo}

        {renderContent}

        {renderActions}
      </Stack>
    </Form>
  );
}