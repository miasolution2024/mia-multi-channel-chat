'use client';

import { useState, useCallback } from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import { Iconify } from '@/components/iconify';
import { toast } from '@/components/snackbar';

// ----------------------------------------------------------------------

type Props = {
  value: string;
  children: React.ReactElement;
  onCopy?: (value: string) => void;
};

export function CopyToClipboard({ value, children, onCopy }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      if (onCopy) {
        onCopy(value);
      }
      toast.success('Copied!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Copy failed!');
    }
  }, [value, onCopy]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
      {children}
      <Tooltip title={isCopied ? 'Copied' : 'Copy'}>
        <IconButton onClick={handleCopy}>
          <Iconify icon={isCopied ? 'eva:checkmark-fill' : 'eva:copy-fill'} width={24} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}