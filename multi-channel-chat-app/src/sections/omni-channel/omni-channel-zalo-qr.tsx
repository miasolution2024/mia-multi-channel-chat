/* eslint-disable @typescript-eslint/no-explicit-any */

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { getZaloQRLoginImage } from "@/actions/omni-channel";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

export function ZaloLoginQR({
  companyId,
  requestId,
  open,
  onClose,
}: {
  companyId?: string;
  requestId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [imageSrc, setImageSrc] = useState("");
  useEffect(() => {
    const getImage = async () => {
      const imageBase64 = await getZaloQRLoginImage(requestId, companyId);
      setImageSrc(`data:image/png;base64,${imageBase64}`);
    };

    if (open) {
      getImage();
    } else {
      setImageSrc("");
    }
  }, [open, requestId]);

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>Zalo QR Login</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          {imageSrc && (
            <Image
              alt="Zalo QR login"
              height={300}
              width={300}
              src={imageSrc}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
