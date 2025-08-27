import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import CardHeader from "@mui/material/CardHeader";

import { paths } from "@/routes/path";
import { toast } from "@/components/snackbar";
import { Form, Field } from "@/components/hook-form";
import { Content } from "./view/content-assistant-list-view";

// ----------------------------------------------------------------------

const ContentSchema = zod.object({
  topic: zod.string().min(1, { message: "Chủ đề là bắt buộc!" }),
  post_type: zod.string().min(1, { message: "Loại bài viết là bắt buộc!" }),
  main_seo_keyword: zod
    .string()
    .min(1, { message: "Từ khoá SEO chính là bắt buộc!" }),
  secondary_seo_keywords: zod.string().array(),
  customer_group: zod.union([zod.string(), zod.array(zod.any())]).refine(
    (val) => {
      if (typeof val === "string") return val.length > 0;
      if (Array.isArray(val)) return val.length > 0;
      return false;
    },
    { message: "Nhóm khách hàng là bắt buộc!" }
  ),
  customer_journey: zod.union([zod.string(), zod.array(zod.any())]).refine(
    (val) => {
      if (typeof val === "string") return val.length > 0;
      if (Array.isArray(val)) return val.length > 0;
      return false;
    },
    { message: "Hành trình khách hàng là bắt buộc!" }
  ),
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
      topic: currentContent?.topic || "",
      post_type: currentContent?.post_type || "",
      main_seo_keyword: currentContent?.main_seo_keyword || "",
      secondary_seo_keywords: currentContent?.secondary_seo_keywords || [],
      customer_group: Array.isArray(currentContent?.customer_group)
        ? currentContent.customer_group[0]?.customer_group_id?.name || ""
        : currentContent?.customer_group || "",
      customer_journey: Array.isArray(currentContent?.customer_journey)
        ? currentContent.customer_journey[0]?.customer_journey_id?.name || ""
        : currentContent?.customer_journey || "",
      description: currentContent?.description || "",
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
      console.log("Form data:", data);

      toast.success(
        currentContent ? "Cập nhật thành công!" : "Tạo mới thành công!"
      );

      router.push(paths.dashboard.contentAssistant.root);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader title="Chi tiết" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="topic" label="Chủ đề bài viết" />

        <Field.Select name="post_type" label="Loại bài viết">
          <MenuItem value="Blog">Blog</MenuItem>
          <MenuItem value="Bài đăng">Bài đăng</MenuItem>
          <MenuItem value="Tin tức">Tin tức</MenuItem>
        </Field.Select>

        <Field.Text name="main_seo_keyword" label="Từ khoá SEO chính" />

        <Field.Autocomplete
          name="secondary_seo_keywords"
          label="Từ khoá SEO phụ"
          placeholder="+ Thêm từ khoá"
          multiple
          freeSolo
          disableCloseOnSelect
          options={[]}
          getOptionLabel={(option: string) => option}
          renderOption={(
            props: React.HTMLAttributes<HTMLLIElement>,
            option: string
          ) => (
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
        <Field.Select name="customer_group" label="Nhóm khách hàng">
          <MenuItem value="Mới">Mới</MenuItem>
          <MenuItem value="Tiềm năng">Tiềm năng</MenuItem>
          <MenuItem value="Khách hàng hiện tại">Khách hàng hiện tại</MenuItem>
        </Field.Select>

        <Field.Select name="customer_journey" label="Hành trình khách hàng">
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
        {!currentContent ? "Tạo nội dung" : "Lưu thay đổi"}
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
