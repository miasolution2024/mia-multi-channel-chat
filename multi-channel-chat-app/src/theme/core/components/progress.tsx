/* eslint-disable @typescript-eslint/no-explicit-any */
import { varAlpha } from "../../styles";

// ----------------------------------------------------------------------

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"];

// ----------------------------------------------------------------------

function styleColors(ownerState: any, styles: any) {
  const outputStyle = COLORS.reduce((acc, color) => {
    if (ownerState.color === color) {
      acc = styles(color);
    }
    return acc;
  }, {});

  return outputStyle;
}

const MuiLinearProgress = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme, ownerState }: any) => {
      const styled = {
        colors: styleColors(ownerState, (color: any) => ({
          backgroundColor: varAlpha(
            theme.vars.palette[color].mainChannel,
            0.24
          ),
        })),
        inheritColor: {
          ...(ownerState.color === "inherit" && {
            "&::before": { display: "none" },
            backgroundColor: varAlpha(
              theme.vars.palette.text.primaryChannel,
              0.24
            ),
          }),
        },
      };
      return {
        borderRadius: 4,
        ...(ownerState.variant !== "buffer" && {
          ...styled.inheritColor,
          ...styled.colors,
        }),
      };
    },
    bar: { borderRadius: "inherit" },
  },
};

// ----------------------------------------------------------------------

export const progress = { MuiLinearProgress };
