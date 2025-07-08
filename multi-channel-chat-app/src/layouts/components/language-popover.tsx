/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { m } from 'framer-motion';
import { useCallback } from 'react';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { CustomPopover, usePopover } from '@/components/custom-popover';
import { useTranslate } from '@/locales';
import { varHover } from '@/components/animate';
import { FlagIcon } from '@/components/iconify';



// ----------------------------------------------------------------------

export function LanguagePopover({ data = [], sx, ...other }: any) {
  const popover = usePopover();

  const { onChangeLang, currentLang } = useTranslate();

  const handleChangeLang = useCallback(
    (newLang: any) => {
      onChangeLang(newLang);
      popover.onClose();
    },
    [onChangeLang, popover]
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          p: 0,
          width: 40,
          height: 40,
          ...(popover.open && { bgcolor: 'action.selected' }),
          ...sx,
        }}
        {...other}
      >
        <FlagIcon code={currentLang.countryCode} />
      </IconButton>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList sx={{ width: 160, minHeight: 72 }}>
          {data?.map((option: any) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang.value}
              onClick={() => handleChangeLang(option.value)}
            >
              <FlagIcon code={option.countryCode} />
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
