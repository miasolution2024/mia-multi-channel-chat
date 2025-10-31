/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

export function ConfirmDialog({ open, title, action, content, onClose, ...other }: any) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

      <DialogActions>
       

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Huỷ
        </Button>
         {action}
      </DialogActions>
    </Dialog>
  );
}
