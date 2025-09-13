import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

type PublishModalProps = {
  open: boolean;
  onClose: () => void;
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  isSavingDraft: boolean;
  isPublishing: boolean;
  editData?: unknown;
};

export function PublishModal({
  open,
  onClose,
  onSaveDraft,
  onPublish,
  isSavingDraft,
  isPublishing,
  editData,
}: PublishModalProps) {
  const [action, setAction] = useState<'draft' | 'publish' | null>(null);

  const handleSaveDraft = async () => {
    setAction('draft');
    try {
      await onSaveDraft();
      onClose();
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setAction(null);
    }
  };

  const handlePublish = async () => {
    setAction('publish');
    try {
      await onSaveDraft();
      await onPublish();
      onClose();
    } catch (error) {
      console.error('Error publishing:', error);
    } finally {
      setAction(null);
    }
  };

  const isLoading = isSavingDraft || isPublishing || action !== null;

  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          {!editData ? "Hoàn thành bài viết" : "Cập nhật bài viết"}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {!editData 
            ? "Bạn muốn lưu nháp hay đăng bài ngay?"
            : "Bạn muốn lưu thay đổi hay cập nhật bài viết?"
          }
        </Typography>
      </DialogContent>
      
      <DialogActions>
        <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outlined"
          >
            Hủy
          </Button>
          
          <LoadingButton
            onClick={handleSaveDraft}
            loading={action === 'draft' || isSavingDraft}
            disabled={isLoading && action !== 'draft'}
            variant="outlined"
            color="primary"
          >
            {!editData ? "Lưu nháp" : "Lưu thay đổi"}
          </LoadingButton>
          
          <LoadingButton
            onClick={handlePublish}
            loading={action === 'publish' || isPublishing}
            disabled={isLoading && action !== 'publish'}
            variant="contained"
            color="primary"
          >
            {!editData ? "Đăng bài" : "Cập nhật"}
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}