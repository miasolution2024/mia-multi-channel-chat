/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { alpha as hexAlpha } from "@mui/material/styles";

import { Block } from "./styles";
import { SvgColor } from "../../svg-color";
import { CONFIG } from "@/config-global";

// ----------------------------------------------------------------------

export function PresetsOptions({ value, options, onClickOption }: any) {
  return (
    <Block title="Presets">
      <Box
        component="ul"
        gap={1.5}
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
      >
        {options.map((option: any) => {
          const selected = value === option.name;

          return (
            <Box component="li" key={option.name} sx={{ display: "flex" }}>
              <ButtonBase
                onClick={() => onClickOption(option.name)}
                sx={{
                  width: 1,
                  height: 64,
                  borderRadius: 1.5,
                  color: option.value,
                  ...(selected && {
                    bgcolor: hexAlpha(option.value, 0.08),
                  }),
                }}
              >
                <SvgColor
                  width={28}
                  src={`${CONFIG.assetsDir}/assets/icons/settings/ic-siderbar-duotone.svg`}
                  sx={{ color: "currentColor" }}
                />
              </ButtonBase>
            </Box>
          );
        })}
      </Box>
    </Block>
  );
}
